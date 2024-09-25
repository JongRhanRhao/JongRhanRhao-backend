import { eq, or } from "drizzle-orm";
import { users } from "../../db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";
import { dbClient } from "../../db/client";

dotenv.config();
const router = express.Router();

export const register = async (req: Request, res: Response) => {
  const { user_name, email, password, role, phone_number, birthYear } =
    req.body;

  try {
    const existingUser = await dbClient
      .select()
      .from(users)
      .where(or(eq(users.userName, user_name), eq(users.userEmail, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await dbClient
      .insert(users)
      .values({
        userName: user_name,
        userEmail: email,
        password: hashedPassword,
        role,
        phoneNumber: phone_number,
        birthYear,
        profilePicture:
          "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png",
      })
      .returning();

    const token = jwt.sign(
      { userId: newUser.userId, email: newUser.userEmail, role: newUser.role },
      process.env.JWT_SECRET || "enviably-utensil-mountain",
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
