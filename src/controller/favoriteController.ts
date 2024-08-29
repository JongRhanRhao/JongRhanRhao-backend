import { Request, Response } from "express";
import pool from "../dbConfig/db";

// Get all favorites
export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM favorites');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a favorite by ID
export const getFavoriteById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM favorites WHERE favorite_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new favorite
export const createFavorite = async (req: Request, res: Response) => {
  const { userId, storeId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO favorites (user_id, store_id) VALUES ($1, $2) RETURNING *',
      [userId, storeId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update a favorite
export const updateFavorite = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { userId, storeId } = req.body;
  try {
    const result = await pool.query(
      'UPDATE favorites SET user_id = $1, store_id = $2 WHERE favorite_id = $3 RETURNING *',
      [userId, storeId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a favorite
export const deleteFavorite = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM favorites WHERE favorite_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};