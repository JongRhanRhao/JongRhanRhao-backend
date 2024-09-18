import { Request, Response } from "express";
import { dbClient as db } from "../../db/client";
import pool from "../config/db";

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_name, phone_number } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET user_name = $1, phone_number = $2 WHERE user_id = $3 RETURNING *",
      [user_name, phone_number, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: err.message });
  }
};
