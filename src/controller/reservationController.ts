import { Request, Response } from "express";
import pool from "../dbConfig/dbConfig";

// Get all reservations
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reservations');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a reservation by ID
export const getReservationById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM reservations WHERE reservation_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new reservation
export const createReservation = async (req: Request, res: Response) => {
  const { customerId, shopId, reservationDate, reservationTime, reservationStatus, phoneNumber } = req.body;

try {
  const result = await pool.query(
    'INSERT INTO reservations (customer_id, shop_id, reservation_date, reservation_time, reservation_status, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [customerId, shopId, reservationDate, reservationTime, reservationStatus, phoneNumber]
  );

  res.status(201).json(result.rows[0]);
} catch (err) {
  res.status(500).json({ error: err.message });
}
};

// Update a reservation
export const updateReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, phone_number } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reservations SET table_id = $1, number_of_table = $2, customer_id = $3, reservation_time = $4, number_of_people = $5, customer_name = $6, customer_phone = $7 WHERE reservation_id = $8 RETURNING *',
      [tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, phone_number, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a reservation
export const deleteReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM reservations WHERE reservation_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(204).json({});
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: err.message });
  }
};