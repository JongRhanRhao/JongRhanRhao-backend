import { Strategy as LocalStrategy } from "passport-local";
import pool from "../../config/db";
import { users } from "../../../db/schema";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(pool);

export const localStrat = new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done) => {
    try {
      const user = await db.select().from(users);

      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
