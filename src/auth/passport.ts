import { eq } from "drizzle-orm";
import passport from "passport";
import Debug from "debug";

import { localStrat } from "./strategies/local";
import pool from "../config/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/schema";
import { googleStrat } from "./strategies/google";
import { facebookStrat } from "./strategies/facebook";
import { User } from "../models/users";

const debug = Debug("app:passport");
const db = drizzle(pool);

passport.use(localStrat);
passport.use("google", googleStrat as unknown as passport.Strategy);
passport.use(facebookStrat);

passport.serializeUser((user: any, done) => {
  debug("@passport serialize");
  done(null, user.userId); 
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);

    if (result.length === 0) {
      return done(new Error("User not found"));
    }

    const user = result[0];

    const userToReturn: User = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
      phoneNumber: user.phoneNumber ?? "",
      profilePicture: user.profilePicture ?? "",
      googleId: user.googleId ?? "",
      facebookId: user.facebookId ?? "",
    };

    done(null, userToReturn);
  } catch (err) {
    done(err);
  }
});

export default passport;
