import passport from "passport";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { register } from "../controller/authController";
const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.json({
      message: "Login successful",
      user: req.user,
    });
  }
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

// router.get("/facebook", facebookAuth);
// router.get("/facebook/callback", facebookAuthCallback);
router.get("/sessions", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      userId: req.user?.userId,
      userName: req.user?.userName,
      userEmail: req.user?.userEmail,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
