import { Request, Response } from "express";
import pool from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { multerFile } from "../models/multerfile";
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
  const {
    ownerId,
    staffId,
    shopName,
    openTimeBooking,
    cancelReserve,
    address,
    status,
    maxSeats,
    currSeats
  } = req.body;

  const existingStoreCheck = await pool.query(
    "SELECT * FROM stores WHERE shop_name = $1 AND owner_id = $2",
    [shopName, ownerId]
  );

  if (existingStoreCheck.rows.length > 0) {
    return res.status(409).json({ error: "Store already exists" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO stores (store_id, owner_id, staff_id, shop_name, open_timebooking, cancel_reserve, address, status, max_seats, curr_seats) 
       VALUES (generate_nanoid(), $1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [ownerId, staffId, shopName, openTimeBooking, cancelReserve, address, status, maxSeats, currSeats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating store:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a store
export const updateStore = async (req: Request, res: Response) => {
  const storeId = req.params.id;
  const {
    shopName,
    openTimeBooking,
    cancelReserve,
    ownerId,
    staffId,
    address,
    status,
    maxSeats,
    currSeats
  } = req.body;

  try {
    const existingStoreResult = await pool.query("SELECT * FROM stores WHERE store_id = $1", [storeId]);

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updatedStoreResult = await pool.query(
      `UPDATE stores 
      SET shop_name = $1, open_timebooking = $2, cancel_reserve = $3, owner_id = $4, staff_id = $5, address = $6, status = $7, max_seats = $8, curr_seats = $9 
      WHERE store_id = $10 
      RETURNING *`,
      [shopName, openTimeBooking, cancelReserve, ownerId, staffId, address, status, maxSeats, currSeats, storeId]
    );

    res.json(updatedStoreResult.rows[0]);
  } catch (err) {
    console.error("Error updating store:", err.message);
    res.status(500).json({ error: err.message });
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

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/stores/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  }
});

// Configure multer for multiple file uploads
const upload = multer({ storage: storage }).array('images', 10); // Allow up to 10 images to be uploaded at once

// Route to upload multiple store images
export const uploadStoreImages = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    const existingStoreResult = await pool.query("SELECT * FROM stores WHERE store_id = $1", [storeId]);

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Handling multiple file uploads using multer
    upload(req, res, async function (err) {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(500).json({ error: "Error uploading images" });
      }

      if (!req.files || !(req.files as multer.File[]).length) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Collect the file paths of the uploaded images
      const imageUrls = (req.files as multer.File[]).map(file => `/uploads/stores/${file.filename}`);

      // Insert multiple image URLs into the database
      try {
        const insertImagePromises = imageUrls.map(imageUrl => {
          return pool.query(
            "INSERT INTO store_images (store_id, image_url) VALUES ($1, $2) RETURNING *",
            [storeId, imageUrl]
          );
        });

        const imageResults = await Promise.all(insertImagePromises);
        res.json({ store: existingStoreResult.rows[0], images: imageResults.map(result => result.rows[0]) });
      } catch (dbError) {
        console.error("Database error:", dbError.message); // Log database errors
        res.status(500).json({ error: "Error saving image URLs" });
      }
    });
  } catch (err) {
    console.error("Error in uploadStoreImages function:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};