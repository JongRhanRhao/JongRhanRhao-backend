import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

import pool from "../config/db";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { user_name, email, password, role, phone_number } = req.body;

  try {
    const existingUserResult = await pool.query(
      "SELECT * FROM users WHERE user_name = $1 OR user_email = $2",
      [user_name, email]
    );

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (user_name, user_email, password, role, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_name, email, hashedPassword, role, phone_number]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.role },
      process.env.JWT_SECRET || "enviably-utensil-mountain",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  passport.authenticate("local", { session: true }),
    (req: Request, res: Response) => {
      const user = req.body;
      const token = jwt.sign(
        { userId: user.user_id, email: user.user_email, role: user.role },
        process.env.JWT_SECRET || "enviably-utensil-mountain",
        { expiresIn: "1h" }
      );

      res.json({ token });
    };
};

export const localStrat = new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );
      const user = result.rows[0];

      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// export const googleStrat = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.SERVER_URL}/users/auth/google/callback`,
//   },
//   async function (accessToken, refreshToken, profile, cb) {
//     try {
//       const existingUserResult = await pool.query(
//         "SELECT * FROM users WHERE user_email = $1",
//         [profile.emails[0].value]
//       );

//       if (existingUserResult.rows.length > 0) {
//         const existingUser = existingUserResult.rows[0];
//         return cb(null, existingUser);
//       } else {
//         const newUserResult = await pool.query(
//           "INSERT INTO users (user_id, user_name, user_email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//           [
//             profile.id, // Google profile ID as user_id
//             profile.displayName, // Name from Google profile
//             profile.emails[0].value, // Email from Google profile
//             "", // Empty password since it’s OAuth
//             "user", // Default role
//           ]
//         );

//         const newUser = newUserResult.rows[0];
//         return cb(null, newUser);
//       }
//     } catch (err) {
//       return cb(err);
//     }
//   }
// );

// export const facebookStrat = new FacebookStrategy(
//   {
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: `${process.env.SERVER_URL}/users/auth/facebook/callback`,
//     profileFields: ["id", "displayName", "emails"],
//   },
//   async function (accessToken, refreshToken, profile, cb) {
//     try {
//       const existingUserResult = await pool.query(
//         "SELECT * FROM users WHERE user_id = $1",
//         [profile.id]
//       );

//       if (existingUserResult.rows.length > 0) {
//         const existingUser = existingUserResult.rows[0];
//         return cb(null, existingUser);
//       } else {
//         const newUserResult = await pool.query(
//           "INSERT INTO users (user_id, user_name, user_email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//           [
//             profile.id, // Facebook profile ID as user_id
//             profile.displayName, // Name from Facebook profile
//             profile.emails && profile.emails.length > 0
//               ? profile.emails[0].value
//               : null, // Email from Facebook profile
//             "", // Empty password since it’s OAuth
//             "user", // Default role
//           ]
//         );

//         const newUser = newUserResult.rows[0];
//         return cb(null, newUser);
//       }
//     } catch (err) {
//       return cb(err);
//     }
//   }
// );

// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// export const googleAuthCallback = passport.authenticate("google", {
//   failureRedirect: "/login",
//   session: false,
// });
// (req, res) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = jwt.sign(
//     {
//       userId: req.user?.user_id ?? "",
//       email: req.user?.user_email,
//       role: req.user.role,
//     },
//     process.env.JWT_SECRET || "enviably-utensil-mountain",
//     { expiresIn: "1h" }
//   );

//   res.json({ token });
// };

// export const facebookAuth = passport.authenticate("facebook", {
//   scope: ["email"],
// });

// export const facebookAuthCallback = passport.authenticate("facebook", {
//   failureRedirect: "/login",
//   session: false,
// });
// (req, res) => {
//   const token = jwt.sign(
//     {
//       userId: req.user?.user_id,
//       email: req.user?.user_email,
//       role: req.user?.role,
//     },
//     process.env.JWT_SECRET || "enviably-utensil-mountain",
//     { expiresIn: "1h" }
//   );
//   res.json({ token });
// };
