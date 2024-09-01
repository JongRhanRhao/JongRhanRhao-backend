import { Request, Response } from "express";
import pool from "../db";

// Get all stores
export const getAllStores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM stores");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a store by ID
export const getStoreById = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM stores WHERE store_id = $1", [storeId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (err) {
    console.error("Error fetching store:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Create a new store
export const createStore = async (req: Request, res: Response) => {
  const { ownerId, staffId, shopName, openTimeBooking, cancelReserve } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO stores (store_id, owner_id, staff_id, shop_name, open_timebooking, cancel_reserve) VALUES (generate_nanoid(), $1, $2, $3, $4, $5) RETURNING *',
      [ownerId, staffId, shopName, openTimeBooking, cancelReserve]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a store
export const updateStore = async (req: Request, res: Response) => {
  const storeId = req.params.id;
  const { shopName, openTimeBooking, cancelReserve, ownerId, staffId } = req.body;

  try {
    const existingStoreResult = await pool.query("SELECT * FROM stores WHERE store_id = $1", [storeId]);

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updatedStoreResult = await pool.query(
      "UPDATE stores SET shop_name = $1, open_timebooking = $2, cancel_reserve = $3, owner_id = $4, staff_id = $5 WHERE store_id = $6 RETURNING *",
      [shopName, openTimeBooking, cancelReserve, ownerId, staffId, storeId]
    );

    res.json(updatedStoreResult.rows[0]);
  } catch (err) {
    console.error("Error updating store:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a store
export const deleteStore = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    const existingStoreResult = await pool.query("SELECT * FROM stores WHERE store_id = $1", [storeId]);

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    await pool.query("DELETE FROM stores WHERE store_id = $1", [storeId]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};