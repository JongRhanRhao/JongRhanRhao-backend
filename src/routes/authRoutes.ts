import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { user_name, email, password, role, phone_number } = req.body;

  try {
    // Check if the user already exists by username or email
    const existingUserResult = await pool.query(
      "SELECT * FROM users WHERE user_name = $1 OR user_email = $2",
      [user_name, email]
    );

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If the user doesn't exist, hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (user_name, user_email, password, role, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_name, email, hashedPassword, role, phone_number]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.user_id, email: user.user_email, role: user.role },
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
});

export default router;
