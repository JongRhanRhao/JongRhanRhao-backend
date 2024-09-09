import { eq } from "drizzle-orm";
import passport from "passport";
import Debug from "debug";

import { localStrat } from "./strategies/local";
import pool from "../config/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/schema";
import { googleStrat } from "./strategies/google";
import { facebookStrat } from "./strategies/facebook";

const debug = Debug("app:passport");
const db = drizzle(pool);

// Use the strategies
passport.use(localStrat);
passport.use('google', googleStrat as unknown as passport.Strategy);
passport.use(facebookStrat)

// Serialize the user (store userId in session)
passport.serializeUser((user: any, done) => {
  debug("@passport serialize");
  done(null, user.userId); // Store only userId in session
});

// Deserialize the user (retrieve the user from the DB by userId)
passport.deserializeUser(async (id: string, done) => {
  debug("@passport deserialize");
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);

    const user = result[0];

    if (!user) {
      return done(new Error("User not found"));
    }

    done(null, user[0]); // Pass user object to done()
  } catch (err) {
    done(err); // Handle errors during deserialization
  }
});

export default passport;