import express from 'express'
import { myTiktok, getMyTiktokOAuth } from '../controller/tiktok-controller'
const router = express.Router();

router.get('/', myTiktok)

router.get('/oauth', getMyTiktokOAuth);


export default router 