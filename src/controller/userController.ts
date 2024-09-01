import { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { user_name, email, password, role } = req.body;

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
    const newUserResult = await pool.query(
      "INSERT INTO users (user_name, user_email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_name, email, hashedPassword, role]
    );

    const newUser = newUserResult.rows[0];

    // Create a token for the new user
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.user_email, role: newUser.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Respond with the token
    console.log("New user created:", newUser);
    res.status(201).json({ token });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { user_name, email, password, role, phoneNumber } = req.body;

  try {
    const existingUserResult = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUserResult.rows[0].password;

    const updatedUserResult = await pool.query(
      "UPDATE users SET user_name = $1, user_email = $2, password = $3, role = $4, phone_number = $5 WHERE user_id = $6 RETURNING *",
      [user_name, email, hashedPassword, role, phoneNumber, userId]
    );

    res.json(updatedUserResult.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const existingUserResult = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};