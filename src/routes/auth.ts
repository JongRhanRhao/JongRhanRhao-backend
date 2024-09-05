import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  // facebookAuth,
  // facebookAuthCallback,
  // googleAuth,
  // googleAuthCallback,
  login,
  register,
} from "../controller/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/google", googleAuth);
// router.get("/google/callback", googleAuthCallback);
// router.get("/facebook", facebookAuth);
// router.get("/facebook/callback", facebookAuthCallback);

export default router;
