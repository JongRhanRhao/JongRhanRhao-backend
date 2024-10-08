import { Request, Response } from "express";
import { eq, inArray, and, sql } from "drizzle-orm";
import { format } from "date-fns";

import pool from "../config/db.js";
import { dbClient as db } from "../../db/client.js";
import {
  storeAvailability,
  storeImages,
  stores,
  users,
} from "../../db/schema.js";

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
  return shopName
    .trim()
    .toUpperCase()
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, "-");
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
    isPopular,
    type,
    imageUrl,
    description,
    facebookLink,
    googleMapLink,
    defaultSeats,
    ageRange,
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
      `INSERT INTO stores (store_id, owner_id, staff_id, shop_name, description, image_url, open_timebooking, cancel_reserve, address, status, rating, is_popular, type, created_at, updated_at, facebook_link, google_map_link, default_seats, age_range) 
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
        isPopular,
        type,
        now,
        now,
        facebookLink,
        googleMapLink,
        defaultSeats,
        ageRange,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating store:", (err as Error).message);
    res.status(500).json({ error: (err as Error).message });
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
    isPopular,
    type,
    description,
    imageUrl,
    rating,
    googleMapLink,
    facebookLink,
    defaultSeats,
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
           is_popular = $9, 
           type = $10, 
           image_url = $11, 
           rating = $12, 
           facebook_link = $13, 
           google_map_link = $14, 
           default_seats = $15
       WHERE store_id = $16
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
        isPopular,
        type,
        imageUrl,
        rating,
        facebookLink,
        googleMapLink,
        defaultSeats,
        storeId,
      ]
    );
    res.json(updatedStoreResult.rows[0]);
  } catch (err) {
    console.error("Error updating store:", (err as Error).message);
    res.status(500).json({ error: (err as Error).message });
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
    console.error("Error fetching user's stores:", (err as Error).message);
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
    console.error("Error deleting store:", (err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addStoreImage = async (req: Request, res: Response) => {
  const { storeId, images } = req.body;

  if (!storeId || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const validImages = images.every(
    (image: { original: string; thumbnail: string }) => {
      return (
        typeof image.original === "string" &&
        typeof image.thumbnail === "string"
      );
    }
  );

  if (!validImages) {
    return res.status(400).json({ error: "Invalid image URLs" });
  }

  const imageRecords = images.map(
    (image: { original: string; thumbnail: string }) => ({
      storeId,
      original: image.original,
      thumbnail: image.thumbnail,
    })
  );

  try {
    await db.insert(storeImages).values(imageRecords);
    res.status(201).json({ message: "Images added successfully" });
  } catch (error) {
    console.error("Error adding images:", (error as Error).message);
    // Handle database errors explicitly (e.g., unique constraint violations)
    if ((error as any).code === "23505") {
      return res.status(409).json({ error: "Duplicate images detected" });
    }
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
    console.error("Error fetching store images:", (error as Error).message);
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
    console.error("Error fetching store staff:", (error as Error).message);
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
    console.error("Error removing staff:", (error as Error).message);
    res
      .status(500)
      .json({ error: "An error occurred while removing the staff" });
  }
};

// Store Availability
export const getStoreAvailability = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.storeId, storeId))
      .limit(1);
    if (!store[0]) {
      return res.status(404).json({ error: "Store not found" });
    }

    const availability = await db
      .select()
      .from(storeAvailability)
      .where(
        and(
          eq(storeAvailability.storeId, storeId),
          sql`${storeAvailability.date} BETWEEN ${startDate} AND ${endDate}`
        )
      );

    const defaultAvailability = {
      availableSeats: store[0].defaultSeats,
      isReservable: true,
    };

    const result: {
      date: string;
      availableSeats: number;
      isReservable: boolean;
    }[] = [];
    let currentDate = new Date(startDate as string);
    const end = new Date(endDate as string);

    while (currentDate <= end) {
      const existingAvailability = availability.find(
        (a) =>
          new Date(a.date).toISOString().split("T")[0] ===
          currentDate.toISOString().split("T")[0]
      );

      result.push({
        date: currentDate.toISOString().split("T")[0],
        availableSeats:
          existingAvailability?.availableSeats ??
          defaultAvailability.availableSeats,
        isReservable:
          existingAvailability?.isReservable ??
          defaultAvailability.isReservable,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return res.status(500).json({ error: "Failed to fetch availability" });
  }
};

export const createStoreAvailability = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { date, availableSeats, isReservable } = req.body;

  try {
    // Ensure the date is in a valid format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    // Step 1: Check if an availability already exists for the storeId and date
    const existingAvailability = await db
      .select()
      .from(storeAvailability)
      .where(
        and(
          eq(storeAvailability.storeId, storeId),
          eq(storeAvailability.date, formattedDate)
        )
      );

    if (existingAvailability.length > 0) {
      // Step 2: If an availability exists, delete the old entry
      await db
        .delete(storeAvailability)
        .where(
          and(
            eq(storeAvailability.storeId, storeId),
            eq(storeAvailability.date, formattedDate)
          )
        );
    }

    // Step 3: Insert the new availability data
    const result = await db
      .insert(storeAvailability)
      .values({
        storeId,
        date: formattedDate,
        availableSeats,
        isReservable,
      })
      .returning();

    res.status(201).json({
      message: "Availability created or replaced",
      availability: result[0],
    });
  } catch (error) {
    console.error("Error creating or updating availability:", error);
    res.status(500).json({ error: "Failed to create or update availability" });
  }
};
