import express from "express";
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
  getStoreStaff,
  deleteStoreStaff,
  getStoreAvailability,
  createStoreAvailability,
  updateStoreAvailability,
  deleteStoreAvailability,
} from "../controller/storeController";
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
import {
  createReview,
  deleteReview,
  getReviewsByShop,
  updateReview,
} from "../controller/reviewController";

const router = express.Router();

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
router.get("/stores/:id/staff", getStoreStaff);
router.delete("/stores/:id/staff", deleteStoreStaff);

// Store Availibility routes
router.get("/stores/available/:storeId/:date", async (req, res) => {
  const { storeId, date } = req.params;

  try {
    const availability = await getStoreAvailability(storeId, date);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/stores/available", createStoreAvailability);
router.put("/stores/available/:id", updateStoreAvailability);
router.delete("/stores/available/:id", deleteStoreAvailability);

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

// Review routes
router.post("/reviews", createReview);
router.get("/reviews/:shopId", getReviewsByShop);
router.put("/reviews/:reviewId", updateReview);
router.delete("/reviews/:reviewId", deleteReview);

export default router;
