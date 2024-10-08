import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import pool from "../config/db.js";

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
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const userResult = await pool.query(
      "SELECT profile_picture FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileImage = userResult.rows[0].profile_picture;

    res.json({
      profileImage: profileImage ? `/stores/images${profileImage}` : null,
    });
  } catch (err) {
    console.error("Error fetching profile image:", (err as Error).message);
    res.status(500).json({ error: "Server error" });
  }
};
