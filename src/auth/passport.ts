import { eq } from "drizzle-orm";
import passport from "passport";

import { localStrat } from "./strategies/local";
import { users } from "../../db/schema";
import { googleStrat } from "./strategies/google";
import { facebookStrat } from "./strategies/facebook";
import { dbClient } from "../../db/client";
import { User } from "../models/users";

passport.use(localStrat);
passport.use("google", googleStrat as unknown as passport.Strategy);
passport.use(facebookStrat);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await dbClient
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);

    done(null, user[0] as User);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
