import { drizzle } from "drizzle-orm/node-postgres";
import { eq, or } from "drizzle-orm";
import { users } from "../../db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";

import pool from "../config/db";

dotenv.config();
const db = drizzle(pool);
const router = express.Router();

export const register = async (req: Request, res: Response) => {
  const { user_name, email, password, role, phone_number } = req.body;

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.userName, user_name), eq(users.userEmail, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        userName: user_name,
        userEmail: email,
        password: hashedPassword,
        role,
        phoneNumber: phone_number,
      })
      .returning();

    const token = jwt.sign(
      { userId: newUser.userId, email: newUser.userEmail, role: newUser.role },
      process.env.JWT_SECRET || "enviably-utensil-mountain",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const localLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userEmail, email))
      .limit(1);

    const user = result[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.userId, email: user.userEmail, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
