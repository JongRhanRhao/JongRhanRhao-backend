import passport from "passport";
import passportInstance from "passport";
import Debug from "debug";

import { localStrat } from "../auth/strategies/local.ts";
import pool from "../config/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/schema";

const debug = Debug("app:passport");
const db = drizzle(pool);

passport.use("local", localStrat);

passportInstance.serializeUser((user: any, done) => {
  debug("@passport serialize");
  done(null, user.user_id);
});

passportInstance.deserializeUser(async (id: string, done) => {
  debug("@passport deserialize");
  try {
    const user = await db.select().from(users);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passportInstance;
