import { Request, Response } from "express";
import { eq, inArray, and } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

import pool from "../config/db";
import { dbClient as db } from "../../db/client";
import {
  storeAvailability,
  storeImages,
  stores,
  storeWeeklySchedule,
  users,
} from "../../db/schema";

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
    defaultSlots,
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
      `INSERT INTO stores (store_id, owner_id, staff_id, shop_name, description, image_url, open_timebooking, cancel_reserve, address, status, rating, max_seats, curr_seats, is_popular, type, created_at, updated_at, facebook_link, google_map_link, default_slots) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
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
        defaultSlots,
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
    googleMapLink,
    facebookLink,
    defaultSlots,
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
       SET shop_name = $1, 
           open_timebooking = $2, 
           cancel_reserve = $3, 
           description = $4, 
           owner_id = $5, 
           staff_id = $6, 
           address = $7, 
           status = $8, 
           max_seats = $9, 
           curr_seats = $10, 
           is_popular = $11, 
           type = $12, 
           image_url = $13, 
           rating = $14, 
           facebook_link = $15, 
           google_map_link = $16, 
           default_slots = $17
       WHERE store_id = $18
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
        facebookLink,
        googleMapLink,
        defaultSlots,
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
    await db.insert(storeImages).values(imageRecords);
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
    const images = await db
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
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId));

    if (store.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (!store[0].staffId || store[0].staffId.length === 0) {
      return res.status(404).json({ message: "No staff found for this store" });
    }

    const staff = await db
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
    const store = await db
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

    await db
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

// Store Availability Controller

// Create Store Availability
export const createStoreAvailability = async (req, res) => {
  try {
    const { storeId, date, availableSlots } = req.body;

    const result = await db.insert(storeAvailability).values({
      storeId,
      date,
      availableSlots,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Store availability created", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating store availability", error });
  }
};

// Read Store Availability by storeId and date

interface AvailableSlot {
  time: string;
  availableSeats: number;
}

interface Store {
  defaultSlots: AvailableSlot[];
}

// Function to get store availability
export async function getStoreAvailability(
  storeId: string,
  date: string
): Promise<AvailableSlot[]> {
  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay();

  try {
    // 1. Check if there's custom availability for this specific date
    const customAvailability = await db
      .select()
      .from(storeAvailability)
      .where(
        and(
          eq(storeAvailability.storeId, storeId),
          eq(storeAvailability.date, selectedDate.toISOString().split("T")[0])
        )
      )
      .execute();

    if (customAvailability.length) {
      return customAvailability[0].availableSlots as AvailableSlot[]; // Return custom availability
    }

    // 2. If no custom availability, fall back to weekly schedule
    const weeklyAvailability = await db
      .select()
      .from(storeWeeklySchedule)
      .where(
        and(
          eq(storeWeeklySchedule.storeId, storeId),
          eq(storeWeeklySchedule.dayOfWeek, dayOfWeek)
        )
      )
      .execute();

    if (weeklyAvailability.length) {
      return weeklyAvailability[0].availableSlots as AvailableSlot[]; // Return weekly availability
    }

    // 3. If no weekly availability, fall back to default slots
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId))
      .execute();

    if (store.length) {
      return store[0].defaultSlots as AvailableSlot[]; // Return default slots
    }

    throw new Error("Store availability not found");
  } catch (error) {
    throw new Error(`Error fetching store availability: ${error.message}`);
  }
}

// Update Store Availability
export const updateStoreAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableSlots } = req.body;

    const result = await db
      .update(storeAvailability)
      .set({ availableSlots, updatedAt: new Date() })
      .where(eq(storeAvailability.id, id))
      .execute();

    if (result.length === 0) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.json({ message: "Store availability updated", result });
  } catch (error) {
    res.status(500).json({
      message: "Error updating store availability",
      error: error.message,
    });
  }
};

// Delete Store Availability
export const deleteStoreAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db
      .delete(storeAvailability)
      .where(eq(storeAvailability.id, id))
      .execute();

    if (result.length === 0) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.json({ message: "Store availability deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting store availability",
      error: error.message,
    });
  }
};
