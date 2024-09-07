import passport from "passport";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { register } from "../controller/authController";
const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/dashboard");
});
// router.get("/google", googleAuth);
// router.get("/google/callback", googleAuthCallback);
// router.get("/facebook", facebookAuth);
// router.get("/facebook/callback", facebookAuthCallback);

export default router;
