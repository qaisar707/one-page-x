import express from "express";
const router = express.Router();
import authenticate from "../middleware/authMiddleware";
import multerUpload from "../middleware/multer";
import { createSocialPostWIthMany } from "../controller/post-controller";

router.post(
  "/make-with-may",
  authenticate,
  multerUpload.single("file"),
  createSocialPostWIthMany
);

export default router;
