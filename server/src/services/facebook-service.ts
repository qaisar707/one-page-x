import axios from "axios";
import crypto from "crypto";
import dayjs from "dayjs";

export function prepareQueryForFbGraphql(access_token:string, gqlQueryParams:string) {
  try {
    if (!access_token || !gqlQueryParams) {
      throw new Error(
        "Access token and GraphQL query parameters are required."
      );
    }

    const app_secret:any = process.env.FACEBOOK_APP_SECRET;
    const appsecret_proof = crypto
      .createHmac("sha256", app_secret)
      .update(access_token)
      .digest("hex");

    const requestData = {
      access_token: access_token,
      appsecret_proof: appsecret_proof,
      batch: JSON.stringify([
        { method: "GET", relative_url: `${gqlQueryParams}` },
      ]),
    };

    return requestData;
  } catch (error:any) {
    console.error("Error preparing Facebook GraphQL query:", error.message);
    throw error;
  }
}

export function prepareMutationForFbGraphql(
  access_token: string,
  gqlQueryParams: string,
  batchBody: any) {
  try {
    if (!access_token || !gqlQueryParams || !batchBody) {
      throw new Error(
        "Access token, GraphQL query parameters, and batch body are required."
      );
    }

    const app_secret:any = process.env.FACEBOOK_APP_SECRET;
    const appsecret_proof = crypto
      .createHmac("sha256", app_secret)
      .update(access_token)
      .digest("hex");

    const requestData = {
      access_token: access_token,
      appsecret_proof: appsecret_proof,
      batch: JSON.stringify([
        {
          method: "POST",
          relative_url: gqlQueryParams,
          body: Object.keys(batchBody)
            .map((key) => `${key}=${encodeURIComponent(batchBody[key])}`)
            .join("&"),
        },
      ]),
    };

    return requestData;
  } catch (error:any) {
    console.error("Error preparing Facebook GraphQL mutation:", error.message);
    throw error;
  }
}
interface IFbGraphlqReq{ access_token: string; appsecret_proof: string; batch: string; }
export async function makeFacebookGraphqlReq(requestData:IFbGraphlqReq ) {
  try {
    if (!requestData) {
      throw new Error("Request data is required.");
    }

    const FACEBOOK_GRAPH_API_BASE_URL = "https://graph.facebook.com/";

    const { data } = await axios.post(FACEBOOK_GRAPH_API_BASE_URL, requestData);

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response data format.");
    }

    const post = JSON.parse(data[0]?.body);
    if (!post) {
      throw new Error("Invalid response body format.");
    }

    return post.data ? post.data[0] : post;
  } catch (error) {
    console.error("Error making Facebook GraphQL request:", error);
    throw error;
  }
}

export async function validateFacebookToken(access_token:string) {
  try {
    if (!access_token) {
      throw new Error("Access token is required.");
    }

    const currentUserToken = access_token;
    const validAppAccessToken = process.env.FACEBOOK_APP_ACCESS_TOKEN;

    let BASE_URL = "https://graph.facebook.com/debug_token";
    BASE_URL += `?input_token=${currentUserToken}`;
    BASE_URL += `&access_token=${validAppAccessToken}`;

    const response = await axios.get(BASE_URL);
    const data = response.data;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response data format.");
    }

    return data;
  } catch (error) {
    console.error("Error validating Facebook token:", error);
    throw error;
  }
}

export async function postToFacebook(
  accessToken: { access_token: string; platform_user_id: number; },
  text: string,
  published: boolean,
  scheduled_at: string | number | Date | dayjs.Dayjs | null | undefined,
  image_url = null
) {
  try {
    const { access_token, platform_user_id: userId } = accessToken;
    const gqlQueryParams = `${userId}/accounts`;
    const accessProofForPages = prepareQueryForFbGraphql(
      access_token,
      gqlQueryParams
    );

    return makeFacebookGraphqlReq(accessProofForPages)
      .then((pagesInfo) => {
        const { access_token, id } = pagesInfo;
        const item = `${id}/feed`;

        let batchBody:any = scheduled_at
          ? {
              message: text,
              scheduled_publish_time: scheduled_at,
              published,
            }
          : {
              message: text,
              published,
            };

        if (image_url) {
          batchBody.link = image_url;
        }

        let accessProofForPost = prepareMutationForFbGraphql(
          access_token,
          item,
          batchBody
        );

        return makeFacebookGraphqlReq(accessProofForPost);
      })
      .then((postResponse:any) => {

        if (postResponse?.id) {
          const response = scheduled_at
            ? {
                message: `Post Scheduled to be Published at ${dayjs(
                  scheduled_at
                ).unix()}`,
                postResponse,
              }
            : {
                message: `Post Pulished`,
                postResponse,
              };
          return response;
        } else throw postResponse
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    throw error;
  }
}
