import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { dbClient } from "../../../db/client";
import { users } from "../../../db/schema";

export const localStrat = new LocalStrategy(
  { usernameField: 'email' },
  async (email: string, password: string, done) => {
    try {
      const result = await dbClient.select().from(users).where(eq(users.userEmail, email)).limit(1);
      const user = result[0];

      if (!user) return done(null, false, { message: 'User not found' });

      // Check if password exists and is not null
      if (!user.password) {
        return done(null, false, { message: 'This account uses Google login' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
