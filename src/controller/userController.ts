// controllers/userController.ts

import { Request, Response } from "express";
import { User } from "../models/users";
import pool from "../db";
import jwt from "jsonwebtoken"; // Import the 'jsonwebtoken' library
import bcrypt from "bcryptjs";

// Example in-memory data store
let users: User[] = [];

// Get all users
export const getAllUsers = (req: Request, res: Response) => {
  res.json(users);
};

// Get a user by ID
export const getUserById = (req: Request, res: Response) => {
  const user = users.find(u => u.userId === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
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
export const updateUser = (req: Request, res: Response) => {
  const userIndex = users.findIndex(u => u.userId === parseInt(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = req.body;
    res.json(users[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
};

// Delete a user
export const deleteUser = (req: Request, res: Response) => {
  users = users.filter(u => u.userId !== parseInt(req.params.id));
  res.status(204).send();
};