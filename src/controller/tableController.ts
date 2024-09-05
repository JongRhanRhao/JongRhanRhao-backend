import { Request, Response } from "express";
import pool from "../config/db";

// Get all tables
export const getAllTables = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tables");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a table by ID
export const getTableById = async (req: Request, res: Response) => {
  const tableId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM tables WHERE table_id = $1",
      [tableId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (err) {
    console.error("Error fetching table:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Create a new table
export const createTable = async (req: Request, res: Response) => {
  const { table_number, status, store_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tables (table_number, status, store_id) VALUES ($1, $2, $3) RETURNING *",
      [table_number, status, store_id]
    );
    const newTable = result.rows[0];
    res.status(201).json(newTable);
  } catch (err) {
    console.error("Error creating table:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a table
export const updateTable = async (req: Request, res: Response) => {
  const tableId = req.params.id;
  const { table_number, status, store_id } = req.body;

  try {
    const existingTableResult = await pool.query(
      "SELECT * FROM tables WHERE table_id = $1",
      [tableId]
    );

    if (existingTableResult.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    const updatedTableResult = await pool.query(
      "UPDATE tables SET table_number = $1, status = $2, store_id = $3 WHERE table_id = $4 RETURNING *",
      [table_number, status, store_id, tableId]
    );

    res.json(updatedTableResult.rows[0]);
  } catch (err) {
    console.error("Error updating table:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a table
export const deleteTable = async (req: Request, res: Response) => {
  const tableId = req.params.id;

  try {
    const existingTableResult = await pool.query(
      "SELECT * FROM tables WHERE table_id = $1",
      [tableId]
    );

    if (existingTableResult.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    await pool.query("DELETE FROM tables WHERE table_id = $1", [tableId]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting table:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};
