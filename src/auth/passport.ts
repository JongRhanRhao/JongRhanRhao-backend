import { eq } from "drizzle-orm";
import passport from "passport";

import { localStrat } from "./strategies/local.js";
import { users } from "../../db/schema.js";
import { googleStrat } from "./strategies/google.js";
import { facebookStrat } from "./strategies/facebook.js";
import { dbClient } from "../../db/client.js";
import { User } from "../models/users.js";

passport.use(localStrat);
passport.use("google", googleStrat as unknown as passport.Strategy);
passport.use(facebookStrat);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).userId);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await dbClient
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);

    done(null, user[0] as Express.User);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
