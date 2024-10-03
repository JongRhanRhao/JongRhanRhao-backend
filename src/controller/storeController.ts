import { Request, Response } from "express";
import { eq, inArray, and, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { format } from "date-fns";

import pool from "../config/db";
import { dbClient as db } from "../../db/client";
import { storeAvailability, storeImages, stores, users } from "../../db/schema";

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
    console.error("Error adding images:", error);
    // Handle database errors explicitly (e.g., unique constraint violations)
    if (error.code === "23505") {
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

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Directories for storing uploaded images and thumbnails
const uploadsDir = path.join(__dirname, "uploads/stores/");
const thumbnailsDir = path.join(uploadsDir, "thumbnails/");

// Ensure the directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  },
});

// Configure multer for multiple file uploads (up to 10 images)
const upload = multer({ storage: storage }).array("images", 10);

// Image upload controller
export const uploadStoreImages = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  try {
    // Check if the store exists
    const existingStoreResult = await pool.query(
      "SELECT * FROM stores WHERE store_id = $1",
      [storeId]
    );

    if (existingStoreResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Handle file uploads
    upload(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(500)
          .json({ error: "Multer upload error: " + err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ error: "File upload error: " + err.message });
      }

      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files as Express.Multer.File[];

      // Process each uploaded file
      const imagePromises = files.map(async (file) => {
        const originalImagePath = path.join(uploadsDir, file.filename);
        const thumbnailImagePath = path.join(
          thumbnailsDir,
          `thumb_${file.filename}`
        );

        try {
          // Create a thumbnail using sharp
          await sharp(file.path)
            .resize({ width: 200 })
            .toFile(thumbnailImagePath);

          // Return the original and thumbnail paths
          return { original: originalImagePath, thumbnail: thumbnailImagePath };
        } catch (sharpError) {
          console.error("Sharp error:", sharpError.message);
          return { original: originalImagePath, thumbnail: null }; // Fallback if thumbnail creation fails
        }
      });

      try {
        const images = await Promise.all(imagePromises);

        // Insert image URLs into the database
        const insertImagePromises = images.map((image) =>
          pool.query(
            "INSERT INTO store_images (store_id, original, thumbnail) VALUES ($1, $2, $3) RETURNING *",
            [storeId, image.original, image.thumbnail]
          )
        );

        const imageResults = await Promise.all(insertImagePromises);

        // Send response with the uploaded images and store information
        return res.json({
          store: existingStoreResult.rows[0],
          images: imageResults.map((result) => ({
            original: `/uploads/stores/${path.basename(
              result.rows[0].original
            )}`,
            thumbnail: result.rows[0].thumbnail
              ? `/uploads/stores/thumbnails/${path.basename(
                  result.rows[0].thumbnail
                )}`
              : null,
          })),
        });
      } catch (insertError) {
        console.error("Database insert error:", insertError.message);
        return res
          .status(500)
          .json({ error: "Error saving image URLs to the database" });
      }
    });
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: "Server error" });
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

export const createBooking = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { userId, date, seats } = req.body;

  try {
    const availability = await db
      .select()
      .from(storeAvailability)
      .where(
        and(
          eq(storeAvailability.storeId, storeId),
          eq(storeAvailability.date, new Date(date).toISOString().split("T")[0])
        )
      )
      .limit(1);

    let availableSeats;

    if (availability.length > 0) {
      availableSeats = availability[0].availableSeats;
    } else {
      const store = await db
        .select()
        .from(stores)
        .where(eq(stores.storeId, storeId))
        .limit(1);
      if (!store[0]) {
        return res.status(404).json({ error: "Store not found" });
      }
      availableSeats = store[0].defaultSeats;
    }

    if (seats > availableSeats) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    const booking = await db
      .insert(bookings)
      .values({
        storeId,
        userId,
        date: new Date(date).toISOString().split("T")[0],
        seats,
      })
      .returning();

    // Update availability
    if (availability.length > 0) {
      await db
        .update(storeAvailability)
        .set({ availableSeats: availableSeats - seats })
        .where(
          and(
            eq(storeAvailability.storeId, storeId),
            eq(
              storeAvailability.date,
              new Date(date).toISOString().split("T")[0]
            )
          )
        );
    } else {
      await db.insert(storeAvailability).values({
        storeId,
        date: new Date(date).toISOString().split("T")[0],
        availableSeats: availableSeats - seats,
        isReservable: true,
      });
    }

    res.status(201).json(booking[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};
