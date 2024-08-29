import express from "express";
import authenticateJWT from "../auth/authMiddleware";
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
router.get("/users", authenticateJWT, getAllUsers);
router.get("/users/:id", authenticateJWT, getUserById);
router.post("/users", authenticateJWT, createUser);
router.put("/users/:id", authenticateJWT, updateUser);
router.delete("/users/:id", authenticateJWT, deleteUser);

// Store routes
router.get("/stores", authenticateJWT, getAllStores);
router.get("/stores/:id", authenticateJWT, getStoreById);
router.post("/stores", authenticateJWT, createStore);
router.put("/stores/:id", authenticateJWT, updateStore);
router.delete("/stores/:id", authenticateJWT, deleteStore);

// Table routes
router.get("/tables", authenticateJWT, getAllTables);
router.get("/tables/:id", authenticateJWT, getTableById);
router.post("/tables", authenticateJWT, createTable);
router.put("/tables/:id", authenticateJWT, updateTable);
router.delete("/tables/:id", authenticateJWT, deleteTable);

// Favorite routes
router.get("/favorites", authenticateJWT, getAllFavorites);
router.get("/favorites/:id", authenticateJWT, getFavoriteById);
router.post("/favorites", authenticateJWT, createFavorite);
router.put("/favorites/:id", authenticateJWT, updateFavorite);
router.delete("/favorites/:id", authenticateJWT, deleteFavorite);

// Reservation routes
router.get("/reservations", authenticateJWT, getAllReservations);
router.get("/reservations/:id", authenticateJWT, getReservationById);
router.post("/reservations", authenticateJWT, createReservation);
router.put("/reservations/:id", authenticateJWT, updateReservation);
router.delete("/reservations/:id", authenticateJWT, deleteReservation);


export default router;