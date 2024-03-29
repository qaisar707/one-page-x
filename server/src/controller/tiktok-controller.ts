import e from 'express';
import getMyTikTok from '../services/tiktok-service';

export function myTiktok(req:e.Request, res:e.Response) {
    return getMyTikTok()
}
export async function getMyTiktokOAuth(req:e.Request, res:e.Response) {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });
    let url = 'https://www.tiktok.com/v2/auth/authorize/';

    url += `?client_key=awxx5cv1ozcqwa90`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += '&redirect_uri=https://ocloudsolutions.net';
    url += '&state=' + csrfState;

    res.status(200).json({ url })
}
