// controllers/reservationController.ts

import { Request, Response } from "express";
import { Reservation } from "../models/reservation";

let reservations: Reservation[] = [];

// Get all reservations
export const getAllReservations = (req: Request, res: Response) => {
  res.json(reservations);
};

// Get a reservation by ID
export const getReservationById = (req: Request, res: Response) => {
  const reservation = reservations.find(r => r.reservationId === parseInt(req.params.id));
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404).send("Reservation not found");
  }
};

// Create a new reservation
export const createReservation = (req: Request, res: Response) => {
  const newReservation: Reservation = req.body;
  reservations.push(newReservation);
  res.status(201).json(newReservation);
};

// Update a reservation
export const updateReservation = (req: Request, res: Response) => {
  const reservationIndex = reservations.findIndex(r => r.reservationId === parseInt(req.params.id));
  if (reservationIndex !== -1) {
    reservations[reservationIndex] = req.body;
    res.json(reservations[reservationIndex]);
  } else {
    res.status(404).send("Reservation not found");
  }
};

// Delete a reservation
export const deleteReservation = (req: Request, res: Response) => {
  reservations = reservations.filter(r => r.reservationId !== parseInt(req.params.id));
  res.status(204).send();
};