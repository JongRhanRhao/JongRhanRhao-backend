import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

import {
  // facebookStrat,
  localStrat,
  // googleStrat,
} from "../controller/authController";
import pool from "../config/db";

passport.use("local", localStrat);
// passport.use("google", googleStrat);
// passport.use("facebook", facebookStrat);

passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
