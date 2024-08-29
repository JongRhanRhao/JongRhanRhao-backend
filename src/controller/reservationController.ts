import { Request, Response } from "express";
import pool from "../dbConfig/db";

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reservations');
    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReservationById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM reservations WHERE reservation_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  console.log("Creating reservation:", req.body);
  const { tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, customerPhone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservations (table_id, number_of_table, customer_id, reservation_time, number_of_people, customer_name, customer_phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, customerPhone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, customerPhone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reservations SET table_id = $1, number_of_table = $2, customer_id = $3, reservation_time = $4, number_of_people = $5, customer_name = $6, customer_phone = $7 WHERE reservation_id = $8 RETURNING *',
      [tableId, numberOfTable, customerId, reservationTime, numberOfPeople, customerName, customerPhone, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM reservations WHERE reservation_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(204).json({});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};