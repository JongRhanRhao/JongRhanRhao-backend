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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:5173");
  }
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);
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
      userRole: req.user?.role,
      phoneNumber: req.user?.phoneNumber,
      googleId: req.user?.googleId,
      facebookId: req.user?.facebookId,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    (req as any).session.destroy((err) => {
      if (err) {
        return res.status(500).send("Failed to destroy session");
      }
      res.clearCookie("connect.sid");
    });
  });
});

export default router;
