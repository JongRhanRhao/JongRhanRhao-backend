
import pool from "../dbConfig/db";
import { users } from "@db/schema";
import { User } from "@src/models/users";
import db from "../dbConfig/db";
import { Request, Response } from "express";
import { exists } from "drizzle-orm";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from 'uuid';


// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user

export const createUser = async (req: Request, res: Response) => {
  // 1. Input validation
  await Promise.all([
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }), // Enforce minimum password length
    body('role').notEmpty().trim().escape(),
  ].map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // 2. Check for existing email
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 3. Hash the password
    const saltRounds = 10; // Adjust as needed for security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Generate a unique user ID using uuidv4
    const userId = uuidv4();

    // 5. Insert new user into the database
    const result = await pool.query(
      `INSERT INTO users (user_id, name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, email, hashedPassword, role]
    );

    if (result.rowCount === 0) {
      // Handle unexpected issues
      return res.status(409).json({ error: 'Failed to create user' });
    }

    // 6. Respond with the newly created user (excluding sensitive data like password)
    const newUser = result.rows[0];
    delete newUser.password; // Don't send the hashed password back
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: `An error occurred while creating the user: ${error.message}` });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE user_id = $5 RETURNING *',
      [name, email, password, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};