import { eq } from "drizzle-orm";
import passport from "passport";
import Debug from "debug";

import { localStrat } from "./strategies/local";
import { googleStrat } from "./strategies/google"; // Import googleStrat
import pool from "../config/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/schema";

const debug = Debug("app:passport");
const db = drizzle(pool);

// Use both local and google strategies
passport.use(localStrat);
passport.use(googleStrat);

passport.serializeUser((user: any, done) => {
  try {
    debug(`Serializing user with ID: ${user.userId}`);
    done(null, user.userId);
  } catch (err) {
    debug("Error during serialization", err);
    done(err);
  }
});

passport.deserializeUser(async (id: string, done) => {
  debug(`Deserializing user with ID: ${id}`);
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

    done(null, user);
  } catch (err) {
    debug("Error during deserialization", err);
    done(err);
  }
});

export default passport;