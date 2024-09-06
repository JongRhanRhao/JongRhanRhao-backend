import { eq } from "drizzle-orm";
import passportIns from "passport";
import passportInstance from "passport";
import Debug from "debug";

import { localStrat } from "./strategies/local";
import pool from "../config/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/schema";

const debug = Debug("app:passport");
const db = drizzle(pool);

passportIns.use(localStrat);

passportIns.serializeUser((user: any, done) => {
  debug("@passport serialize");
  done(null, user.userId);
});

passportIns.deserializeUser(async (id: string, done) => {
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

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passportInstance;
