import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from "../controller/storeController";
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from "../controller/tableController";
import {
  getAllFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
} from "../controller/favoriteController";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controller/reservationController";

const router = express.Router();

// User routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Store routes
router.get("/stores", getAllStores);
router.get("/stores/:id", getStoreById);
router.post("/stores", createStore);
router.put("/stores/:id", updateStore);
router.delete("/stores/:id", deleteStore);

// Table routes
router.get("/tables", getAllTables);
router.get("/tables/:id", getTableById);
router.post("/tables", createTable);
router.put("/tables/:id", updateTable);
router.delete("/tables/:id", deleteTable);

// Favorite routes
router.get("/favorites", getAllFavorites);
router.get("/favorites/:id", getFavoriteById);
router.post("/favorites", createFavorite);
router.put("/favorites/:id", updateFavorite);
router.delete("/favorites/:id", deleteFavorite);

// Reservation routes
router.get("/reservations", getAllReservations);
router.get("/reservations/:id", getReservationById);
router.post("/reservations", createReservation);
router.put("/reservations/:id", updateReservation);
router.delete("/reservations/:id", deleteReservation);

export default router;