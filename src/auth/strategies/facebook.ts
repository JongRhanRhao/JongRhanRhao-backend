import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { users } from "../../../db/schema.js";
import { dbClient } from "../../../db/client.js";

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error("Missing Facebook OAuth environment variables");
}

export const facebookStrat = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "https://yourdomain.com/users/auth/facebook/callback",
    profileFields: ["id", "displayName", "email"],
    passReqToCallback: true,
  },
  async (
    req,
    accessToken,
    refreshToken,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const user = await dbClient
        .select()
        .from(users)
        .where(eq(users.facebookId, profile.id))
        .limit(1);

      if (user.length) {
        return done(null, user[0]);
      } else {
        const newUser = await dbClient
          .insert(users)
          .values({
            userId: nanoid(21),
            facebookId: profile.id,
            userEmail: profile.emails?.[0]?.value || "",
            userName: profile.displayName,
            // phoneNumber: profile.phone,
            birthYear: 0,
            role: "user",
          })
          .returning();

        return done(null, newUser[0]);
      }
    } catch (error) {
      return done(error);
    }
  }
);
