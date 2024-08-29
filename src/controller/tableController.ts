import { Request, Response } from "express";
import pool from "../dbConfig/db";

// Get all tables
export const getAllTables = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM tables');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a table by ID
export const getTableById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM tables WHERE table_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new table
export const createTable = async (req: Request, res: Response) => {
  const { name, capacity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tables (name, capacity) VALUES ($1, $2) RETURNING *',
      [name, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update a table
export const updateTable = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, capacity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tables SET name = $1, capacity = $2 WHERE table_id = $3 RETURNING *',
      [name, capacity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a table
export const deleteTable = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM tables WHERE table_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};