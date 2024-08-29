import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
// TODO: Add input validations and error handling for possible bugs
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
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
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role },
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
