import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { dbClient } from "../../../db/client";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

dotenv.config();

export const googleStrat = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/users/auth/google/callback`,
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      const existingUser = await dbClient
        .select()
        .from(users)
        .where(eq(users.googleId, profile.id))
        .limit(1);

      if (existingUser.length > 0) {
        return cb(null, existingUser[0]);
      }
      const profilePicture = profile.photos?.[0]?.value || null;
      const newUser = await dbClient
        .insert(users)
        .values({
          userName: profile.displayName,
          userEmail: profile.emails[0].value,
          googleId: profile.id,
          phoneNumber: profile.phone,
          profilePicture,
          role: "user",
        })
        .returning();

      return cb(null, newUser[0]);
    } catch (err) {
      return cb(err, null);
    }
  }
);
