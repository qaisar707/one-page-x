import express from "express";
import {
  loginWithInstagram,
  getRefreshAccessToken,
  instagramCallback,
  makeInstagramPost,
} from "../controller/instagram-controller";
import authenticate from "../middleware/authMiddleware";

const router = express.Router();

router.get("/oauth", authenticate, loginWithInstagram);
router.get("/callback", instagramCallback);
router.get("/refresh-access-token", getRefreshAccessToken);
router.post("/make-post", authenticate, makeInstagramPost);

export default router;
