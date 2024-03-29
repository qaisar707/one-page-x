import axios from "axios";
import Token from "../model/token";
import {
  makeFacebookGraphqlReq,
  validateFacebookToken,
  prepareQueryForFbGraphql,
  prepareMutationForFbGraphql,
} from "../services/facebook-service";
import e from "express";
import { ICustomRequest } from "../middleware/interfaces";


export async function getMyFacebookToken(req:ICustomRequest, res:e.Response) {
  try {
    let url = "https://www.facebook.com/v19.0/dialog/oauth";
    const APP_ID = process.env.FACEBOOK_APP_ID;
    const REDIRECT_URI = `https://localhost:8000/facebook/callback?id=${req?.user._id}`;

    url += `?client_id=${APP_ID}`;
    url += `&redirect_uri=${REDIRECT_URI}`;
    url += `&scope=email,pages_read_engagement,pages_manage_posts`;

    res.status(200).json({ url });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}

export async function catchFacebookRedirect(req:e.Request, res:e.Response) {
  const { code, id } = req.query;
  const FACEBOOK_GRAPH_API_BASE_URL = "https://graph.facebook.com";
  const REDIRECT_URI = `https://localhost:8000/facebook/callback?id=${id}`;

  try {
    const { data } = await axios.get(
      `${FACEBOOK_GRAPH_API_BASE_URL}/v19.0/oauth/access_token`,
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: `${REDIRECT_URI}`,
          code,
        },
      }
    );

    const { access_token, token_type } = data;
    const { data: extendedToken } = await validateFacebookToken(access_token);

    const {
      data_access_expires_at,
      scopes: permission,
      user_id: fbUserID,
    } = extendedToken;

    await Token.create({
      access_token: access_token,
      type: token_type,
      user: id,
      platform: "facebook",
      permission,
      platform_user_id: fbUserID,
      expiry_date: new Date(Date.now() + data_access_expires_at),
    });
    const redirectUrl = `http://localhost:3000?success=true&platform=facebook`;

    res.redirect(redirectUrl);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}

export async function makeMyFacebookPost(req:e.Request, res:e.Response) {
  const { message, link, published, scheduled_publish_time } = req.body;
  const { scheduled } = req.query;

  return Token.findOne({
    platform: "facebook",
  })
    .then((token) => {
      const { access_token, platform_user_id: userId }= token as {access_token:string,platform_user_id:string} 
      const gqlQueryParams = `${userId} / accounts`;
      const requestData = prepareQueryForFbGraphql(
        access_token,
        gqlQueryParams
      );

      return makeFacebookGraphqlReq(requestData);
    })
    .then((pagesInfo) => {
      const { access_token, id } = pagesInfo.data[0];
      const item = `${id} / feed`;

      const scheduledAt = Math.floor(Date.now() / 1000) + 1000;
      const batchBody = scheduled
        ? {
            message,
            link,
            scheduled_publish_time: scheduledAt,
            published,
          }
        : {
            message,
            link,
            published,
          };
      let temp = prepareMutationForFbGraphql(access_token, item, batchBody);

      return makeFacebookGraphqlReq(temp);
    })
    .then((test) => res.status(200).json({ test }))
    .catch((error:any) => {
      res.status(500).json({ error: error });
    });
}
