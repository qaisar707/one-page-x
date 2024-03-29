import express from "express";

const router = express.Router();
import authenticate from "../middleware/authMiddleware";

import { registerUser, loginUser } from "../controller/user-controller";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
