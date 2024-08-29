import { Request, Response } from "express";
import pool from "../dbConfig/db";

// Get all stores
export const getAllStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM stores');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a store by ID
export const getStoreById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM stores WHERE store_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new store
export const createStore = async (req: Request, res: Response) => {
  const { name, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO stores (name, location) VALUES ($1, $2) RETURNING *',
      [name, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update a store
export const updateStore = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE stores SET name = $1, location = $2 WHERE store_id = $3 RETURNING *',
      [name, location, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a store
export const deleteStore = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM stores WHERE store_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};