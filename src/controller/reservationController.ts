import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import pool from "../config/db.js";
import { reservations, users } from "../../db/schema.js";
import { dbClient as db } from "../../db/client.js";

// Get all reservations
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM reservations");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Get a reservation by ID
export const getReservationById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT * FROM reservations WHERE reservation_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Get a reservation by customer ID with the shop name
export const getReservationByCustomerId = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT 
        r.reservation_id,
        r.reservation_date,
        r.reservation_time,
        r.reservation_status,
        r.phone_number,
        r.shop_id,
        r.note,
        s.shop_name
      FROM reservations r
      JOIN stores s ON r.shop_id = s.store_id
      WHERE r.customer_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Get a reservation by shop ID
export const getReservationByShopId = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT 
        r.reservation_id,
        r.reservation_date,
        r.reservation_time,
        r.reservation_status,
        r.phone_number,
        r.customer_id,
        r.number_of_people,
        r.note,
        u.user_name
      FROM reservations r
      JOIN users u ON r.customer_id = u.user_id
      WHERE r.shop_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const getReservationByShopIdAndDate = async (
  req: Request,
  res: Response
) => {
  const shopId = req.params.shopId;
  const reservationDate = req.params.reservationDate;

  if (!shopId || !reservationDate) {
    return res
      .status(400)
      .json({ error: "Shop ID and reservation date are required." });
  }

  try {
    const result = await db
      .select()
      .from(reservations)
      .innerJoin(users, eq(reservations.customerId, users.userId))
      .where(
        and(
          eq(reservations.shopId, shopId),
          eq(reservations.reservationDate, reservationDate)
        )
      );

    if (result.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: "Failed to fetch reservation" });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Create a new reservation with custom reservationId format (e.g., JRR0001)
export const createReservation = async (req: Request, res: Response) => {
  const {
    customerId,
    shopId,
    numberOfPeople,
    reservationDate,
    reservationTime,
    reservationStatus,
    phoneNumber,
    note,
  } = req.body;

  try {
    const lastReservation = await pool.query(
      "SELECT reservation_id FROM reservations ORDER BY reservation_id DESC LIMIT 1"
    );

    let newReservationId;
    if (lastReservation.rows.length > 0) {
      const lastId = lastReservation.rows[0].reservation_id;
      const numericPart = parseInt(lastId.slice(3));

      const newNumericPart = (numericPart + 1).toString().padStart(4, "0");
      newReservationId = `JRR${newNumericPart}`;
    } else {
      newReservationId = "JRR0001";
    }

    const result = await pool.query(
      `INSERT INTO reservations (reservation_id, customer_id, shop_id, number_of_people, reservation_date, reservation_time, reservation_status, note, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        newReservationId,
        customerId,
        shopId,
        numberOfPeople,
        reservationDate,
        reservationTime,
        reservationStatus,
        note,
        phoneNumber,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Update a reservation
export const updateReservation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { numberOfPeople, reservationTime, reservationStatus, phoneNumber } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE reservations 
       SET number_of_people = $1, reservation_time = $2, reservation_status = $3, phone_number = $4 
       WHERE reservation_id = $5 
       RETURNING *`,
      [numberOfPeople, reservationTime, reservationStatus, phoneNumber, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  const { reservationStatus } = req.body;
  const reservationId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE reservations SET reservation_status = $1 WHERE reservation_id = $2 RETURNING *",
      [reservationStatus, reservationId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating reservation status:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// Delete a reservation
export const deleteReservation = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM reservations WHERE reservation_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(204).json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
