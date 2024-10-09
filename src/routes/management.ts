import express from "express";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getUserStores,
  addStoreImage,
  getStoreImages,
  getStoreStaff,
  deleteStoreStaff,
  getStoreAvailability,
  createStoreAvailability,
  getPopularStores,
} from "../controller/storeController.js";
import {
  getAllFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  getFavoriteByCustomerId,
  getFavoriteStatus,
} from "../controller/favoriteController.js";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationByCustomerId,
  getReservationByShopId,
  updateReservationStatus,
  getReservationByShopIdAndDate,
} from "../controller/reservationController.js";
import {
  createReview,
  deleteReview,
  getReviewsByShop,
  updateReview,
} from "../controller/reviewController.js";

const router = express.Router();

// Store routes
router.get("/stores", getAllStores);
router.get("/stores/popular", getPopularStores);
router.get("/stores/:id", getStoreById);
router.get("/stores/user/:userId", getUserStores);
router.post("/stores", createStore);
router.put("/stores/:id", updateStore);
router.delete("/stores/:id", deleteStore);
router.post("/stores/add-store-images", addStoreImage);
router.get("/stores/:id/images", getStoreImages);
router.get("/stores/:id/staff", getStoreStaff);
router.delete("/stores/:id/staff", deleteStoreStaff);
router.get("/stores/:storeId/availability", getStoreAvailability);
router.post("/stores/:storeId/availability", createStoreAvailability);

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
router.get(
  "/reservations/:shopId/:reservationDate",
  getReservationByShopIdAndDate
);
router.post("/reservations", createReservation);
router.put("/reservations/:id", updateReservation);
router.put("/reservations/status/:id", updateReservationStatus);
router.delete("/reservations/:id", deleteReservation);

// Review routes
router.post("/reviews", createReview);
router.get("/reviews/:shopId", getReviewsByShop);
router.put("/reviews/:reviewId", updateReview);
router.delete("/reviews/:reviewId", deleteReview);

export default router;
