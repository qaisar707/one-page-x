import express from "express";
import {
  makeLinkedinPost,
  linkedinCallback,
  loginWithLinkedin,
} from "../controller/linkedin-controller";

import authenticate from "../middleware/authMiddleware";

const router = express.Router();
router.get("/oauth", authenticate, loginWithLinkedin);
router.get("/callback", linkedinCallback);
router.post("/make-post", authenticate, makeLinkedinPost);

export default router;
