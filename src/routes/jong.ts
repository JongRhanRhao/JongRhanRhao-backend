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
  uploadStoreImages,
  getUserStores,
  addStoreImage,
  getStoreImages,
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
  getFavoriteByCustomerId,
  getFavoriteStatus,
} from "../controller/favoriteController";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationByCustomerId,
  getReservationByShopId,
  updateReservationStatus,
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
router.get("/stores/user/:userId", getUserStores);
router.post("/stores", createStore);
router.put("/stores/:id", updateStore);
router.delete("/stores/:id", deleteStore);
router.post("/stores/:id/upload-image", uploadStoreImages);
router.post("/stores/add-store-images", addStoreImage);
router.get("/stores/:id/images", getStoreImages);

// Table routes
router.get("/tables", getAllTables);
router.get("/tables/:id", getTableById);
router.post("/tables", createTable);
router.put("/tables/:id", updateTable);
router.delete("/tables/:id", deleteTable);

// Favorite routes
router.get("/favorites", getAllFavorites);
router.get("/favorites/:id", getFavoriteById);
router.get("/favorites/customer/:id", getFavoriteByCustomerId);
router.post("/favorites", createFavorite);
router.post("/favorites/status", getFavoriteStatus);
router.put("/favorites/:id", updateFavorite);
router.post("/favorites/remove", deleteFavorite);

// Reservation routes
router.get("/reservations", getAllReservations);
router.get("/reservations/:id", getReservationById);
router.get("/reservations/customer/:id", getReservationByCustomerId);
router.get("/reservations/store/:id", getReservationByShopId);
router.post("/reservations", createReservation);
router.put("/reservations/:id", updateReservation);
router.put("/reservations/status/:id", updateReservationStatus);
router.delete("/reservations/:id", deleteReservation);

export default router;
