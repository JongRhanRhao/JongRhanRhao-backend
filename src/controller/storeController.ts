import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

import pool from "../config/db";
import { dbClient } from "../../db/client";
import { storeImages, stores, users } from "../../db/schema";

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
    const result = await pool.query(
      "SELECT * FROM stores WHERE store_id = $1",
      [storeId]
    );
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

// create a store
const generateStoreId = (shopName: string): string => {
  return shopName.trim().toUpperCase().replace(/\s+/g, "-");
};

export const createStore = async (req: Request, res: Response) => {
  const {
    ownerId,
    staffId,
    shopName,
    openTimeBooking,
    cancelReserve,
    address,
    status,
    rating,
    maxSeats,
    currSeats,
    isPopular,
    type,
    imageUrl,
    description,
    facebookLink,
    googleMapLink,
  } = req.body;

  const storeId = generateStoreId(shopName);
  const now = new Date();

  const existingStoreCheck = await pool.query(
    "SELECT * FROM stores WHERE shop_name = $1 AND owner_id = $2",
    [shopName, ownerId]
  );

  if (existingStoreCheck.rows.length > 0) {
    return res.status(409).json({ error: "Store already exists" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO stores (store_id, owner_id, staff_id, shop_name, description, image_url, open_timebooking, cancel_reserve, address, status, rating, max_seats, curr_seats, is_popular, type, created_at, updated_at, facebook_link, google_map_link) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
       RETURNING *`,
      [
        storeId,
        ownerId,
        staffId,
        shopName,
        description,
        imageUrl,
        openTimeBooking,
        cancelReserve,
        address,
        status,
        rating,
        maxSeats,
        currSeats,
        isPopular,
        type,
        now,
        now,
        facebookLink,
        googleMapLink,
      ]
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
    currSeats,
    isPopular,
    type,
    description,
    imageUrl,
    rating,
  } = req.body;

  try {
    const existingStoreResult = await pool.query(
      "SELECT * FROM stores WHERE store_id = $1",
      [storeId]
    );

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updatedStoreResult = await pool.query(
      `UPDATE stores 
      SET shop_name = $1, open_timebooking = $2, cancel_reserve = $3, description = $4 , owner_id = $5, staff_id = $6, address = $7, status = $8, max_seats = $9, curr_seats = $10, is_popular = $11, type = $12, image_url = $13, rating = $14 
      WHERE store_id = $15
      RETURNING *`,
      [
        shopName,
        openTimeBooking,
        cancelReserve,
        description,
        ownerId,
        staffId,
        address,
        status,
        maxSeats,
        currSeats,
        isPopular,
        type,
        imageUrl,
        rating,
        storeId,
      ]
    );

    res.json(updatedStoreResult.rows[0]);
  } catch (err) {
    console.error("Error updating store:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all stores for a specific user (owner or staff)
export const getUserStores = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM stores 
       WHERE $1 = ANY(owner_id) OR $1 = ANY(staff_id)`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user's stores:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a store
export const deleteStore = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    const existingStoreResult = await pool.query(
      "SELECT * FROM stores WHERE store_id = $1",
      [storeId]
    );

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    await pool.query("DELETE FROM stores WHERE store_id = $1", [storeId]);
    res.status(204).send({ message: "Store deleted" });
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/stores/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  },
});

// Configure multer for multiple file uploads
const upload = multer({ storage: storage }).array("images", 10); // Allow up to 10 images to be uploaded at once

// Route to upload multiple store images
export const uploadStoreImages = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    const existingStoreResult = await pool.query(
      "SELECT * FROM stores WHERE store_id = $1",
      [storeId]
    );

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
      const imageUrls = (req.files as multer.File[]).map(
        (file) => `/uploads/stores/${file.filename}`
      );

      // Insert multiple image URLs into the database
      try {
        const insertImagePromises = imageUrls.map((imageUrl) => {
          return pool.query(
            "INSERT INTO store_images (store_id, image_url) VALUES ($1, $2) RETURNING *",
            [storeId, imageUrl]
          );
        });

        const imageResults = await Promise.all(insertImagePromises);
        res.json({
          store: existingStoreResult.rows[0],
          images: imageResults.map((result) => result.rows[0]),
        });
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

export const addStoreImage = async (req: Request, res: Response) => {
  const { storeId, images } = req.body;

  if (!storeId || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  try {
    const imageRecords = images.map(
      (image: { original: string; thumbnail: string }) => ({
        storeId,
        original: image.original,
        thumbnail: image.thumbnail,
      })
    );
    await dbClient.insert(storeImages).values(imageRecords);
    res.status(201).json({ message: "Images added successfully" });
  } catch (error) {
    console.error("Error adding images:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the images" });
  }
};

export const getStoreImages = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  if (!storeId) {
    return res.status(400).json({ error: "Store ID is required" });
  }

  try {
    const images = await dbClient
      .select()
      .from(storeImages)
      .where(eq(storeImages.storeId, storeId));

    if (images.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for this store" });
    }

    res.json(images);
  } catch (error) {
    console.error("Error fetching store images:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the images" });
  }
};

export const getStoreStaff = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  if (!storeId) {
    return res.status(400).json({ error: "Store ID is required" });
  }

  try {
    const store = await dbClient
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId));

    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (!store[0].staffId || store[0].staffId.length === 0) {
      return res.status(404).json({ message: "No staff found for this store" });
    }

    const staff = await dbClient
      .select()
      .from(users)
      .where(inArray(users.userId, store[0].staffId));

    if (staff.length === 0) {
      return res.status(404).json({ message: "No staff found for this store" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching store staff:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the store staff" });
  }
};

export const deleteStoreStaff = async (req: Request, res: Response) => {
  const { storeId, staffId } = req.body;

  if (!storeId || !staffId) {
    return res
      .status(400)
      .json({ error: "Store ID and staff ID are required" });
  }

  try {
    const store = await dbClient
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId));

    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (!store[0].staffId || store[0].staffId.length === 0) {
      return res.status(404).json({ message: "No staff found for this store" });
    }

    const updatedStaff = store[0].staffId.filter(
      (id: string) => id !== staffId
    );

    await dbClient
      .update(stores)
      .set({ staffId: updatedStaff })
      .where(eq(stores.storeId, storeId));

    res.json({ message: "Staff removed successfully" });
  } catch (error) {
    console.error("Error removing staff:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the staff" });
  }
};
