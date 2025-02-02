import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { dbClient } from "../../../db/client.js";
import { users } from "../../../db/schema.js";

dotenv.config();

export const googleStrat = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/users/auth/google/callback`,
  },
  async function (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      const existingUser = await dbClient
        .select()
        .from(users)
        .where(eq(users.googleId, profile.id))
        .limit(1);

      if (existingUser.length > 0) {
        return done(null, existingUser[0]);
      }
      const profilePicture = profile.photos?.[0]?.value || null;
      const birthYear = profile.birthday
        ? new Date(profile.birthday).getFullYear()
        : 0;

      const newUser = await dbClient
        .insert(users)
        .values({
          userId: nanoid(21),
          userName: profile.displayName,
          userEmail: profile.emails[0].value,
          googleId: profile.id,
          phoneNumber: profile.phone,
          profilePicture,
          birthYear,
          role: "user",
        })
        .returning();

      return done(null, newUser[0]);
    } catch (err) {
      return done(err, null);
    }
  }
);
