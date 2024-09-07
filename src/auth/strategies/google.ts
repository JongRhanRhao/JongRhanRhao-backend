import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { eq, sql } from 'drizzle-orm';
import { users } from '../../../db/schema';
import { dbClient } from '../../../db/client';

export const googleStrat = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:3000/users/auth/google/callback', // Change this to your frontend URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await dbClient
        .select()
        .from(users)
        .where(sql`${users.googleId} = ${profile.id} OR ${users.userEmail} = ${profile.emails[0].value}`)
        .limit(1);

      let user = result[0];

      if (!user) {
        const newUser = {
          googleId: profile.id,
          userName: profile.displayName,
          userEmail: profile.emails[0].value,
          password: null,
          role: 'user',
        };
        const insertResult = await dbClient.insert(users).values(newUser).returning();
        user = insertResult[0];
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
