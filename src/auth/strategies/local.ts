import { Strategy as LocalStrategy } from "passport-local";
import { drizzle } from "drizzle-orm/node-postgres";
import bcrypt from "bcryptjs";
import { users } from "../../../db/schema";
import pool from "../../config/db";
import { eq } from "drizzle-orm";

const db = drizzle(pool);

export const localStrat = new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done) => {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.userEmail, email))
        .limit(1);

      const user = result[0];

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
