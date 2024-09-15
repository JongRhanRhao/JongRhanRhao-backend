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
  const user = req?.user ?? null;
  if (req.isAuthenticated()) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .json({ message: "Failed to log out", error: err.message });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res
          .status(500)
          .json({ message: "Failed to destroy session", error: err.message });
      }

      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
