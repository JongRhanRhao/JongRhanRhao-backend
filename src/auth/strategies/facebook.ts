import { Strategy as FacebookStrategy } from "passport-facebook";
import { eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import { dbClient } from "../../../db/client";

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error("Missing Facebook OAuth environment variables");
}

export const facebookStrat = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "https://yourdomain.com/users/auth/facebook/callback",
    profileFields: ["id", "displayName", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
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
            facebookId: profile.id,
            userEmail: profile.emails?.[0]?.value || null,
            userName: profile.displayName,
            phoneNumber: profile.phone, // Set to null since phone isn't available by default
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
