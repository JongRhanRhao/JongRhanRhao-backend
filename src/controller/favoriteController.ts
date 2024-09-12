import { Request, Response } from "express";
import pool from "../config/db";

// Get all favorites
export const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM favorites");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a favorite by ID
export const getFavoriteById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE favorite_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching favorite:", err);
    res.status(500).json({ error: err.message });
  }
};

//Get a favorite by customer ID
export const getFavoriteByCustomerId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching favorite:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new favorite
export const createFavorite = async (req: Request, res: Response) => {
  const { customerId, storeId } = req.body;
  try {
    // Check if the favorite already exists
    const existingFavorite = await pool.query(
      "SELECT * FROM favorites WHERE customer_id = $1 AND store_id = $2",
      [customerId, storeId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: "Favorite already exists" });
    }

    // Insert a new favorite if it doesn't exist
    const result = await pool.query(
      "INSERT INTO favorites (customer_id, store_id) VALUES ($1, $2) RETURNING *",
      [customerId, storeId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating favorite:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get favorite status for a customer and store
export const getFavoriteStatus = async (req: Request, res: Response) => {
  const { customerId, storeId } = req.body;
  try {
    // Query to check if the favorite exists in the database
    const result = await pool.query(
      "SELECT * FROM favorites WHERE customer_id = $1 AND store_id = $2",
      [customerId, storeId]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ isFavorite: true });
    } else {
      return res.status(200).json({ isFavorite: false });
    }
  } catch (err) {
    console.error("Error checking favorite status:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a favorite
export const updateFavorite = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { customerId, storeId } = req.body;
  try {
    const result = await pool.query(
      "UPDATE favorites SET customer_id = $1, store_id = $2 WHERE favorite_id = $3 RETURNING *",
      [customerId, storeId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating favorite:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a favorite
export const deleteFavorite = async (req: Request, res: Response) => {
  const { customerId, storeId } = req.body;
  try {
    // Delete the favorite if it exists
    const result = await pool.query(
      "DELETE FROM favorites WHERE customer_id = $1 AND store_id = $2 RETURNING *",
      [customerId, storeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: err.message });
  }
};
