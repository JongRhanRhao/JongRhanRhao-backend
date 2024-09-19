import { eq } from "drizzle-orm";
import { dbClient as db } from "../../db/client";
import { reviewsTable, users } from "../../db/schema";

export const createReview = async (req, res) => {
  const { shopId, customerId, rating, reviewText, avatarUrl } = req.body;

  try {
    const customer = await db
      .select({
        userName: users.userName,
      })
      .from(users)
      .where(eq(users.userId, customerId))
      .limit(1);

    if (!customer.length) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const newReview = await db
      .insert(reviewsTable)
      .values({
        shopId,
        customerId,
        rating,
        reviewText,
        avatarUrl,
      })
      .returning();

    const reviewWithCustomerName = {
      ...newReview[0],
      userName: customer[0].userName,
    };

    res.status(201).json(reviewWithCustomerName);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

export const getReviewsByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const reviews = await db
      .select({
        reviewId: reviewsTable.reviewId,
        shopId: reviewsTable.shopId,
        customerId: reviewsTable.customerId,
        rating: reviewsTable.rating,
        reviewText: reviewsTable.reviewText,
        createdAt: reviewsTable.createdAt,
        avatarUrl: reviewsTable.avatarUrl,
        userName: users.userName,
      })
      .from(reviewsTable)
      .leftJoin(users, eq(reviewsTable.customerId, users.userId)) // Perform join with users table
      .where(eq(reviewsTable.shopId, shopId));

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { reviewText, rating, avatarUrl } = req.body;

  try {
    const updatedReview = await db
      .update(reviewsTable)
      .set({
        reviewText,
        rating,
        avatarUrl,
      })
      .where(eq(reviewsTable.reviewId, reviewId))
      .returning();

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    await db.delete(reviewsTable).where(eq(reviewsTable.reviewId, reviewId));
    res.status(204).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
