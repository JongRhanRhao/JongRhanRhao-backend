/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: API related to review management.
 */

/**
 * @swagger
 * /stores/api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Creates a new review for a specific shop.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopId:
 *                 type: string
 *                 description: The ID of the shop being reviewed.
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer writing the review.
 *               rating:
 *                 type: number
 *                 description: The rating given by the customer (1 to 5).
 *               reviewText:
 *                 type: string
 *                 description: The text of the review.
 *               avatarUrl:
 *                 type: string
 *                 description: The URL of the customer's avatar.
 *             required:
 *               - shopId
 *               - customerId
 *               - rating
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewId:
 *                   type: string
 *                 shopId:
 *                   type: string
 *                 customerId:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 reviewText:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 userName:
 *                   type: string
 *       404:
 *         description: Customer not found.
 *       500:
 *         description: Error creating review.
 */

/**
 * @swagger
 * /stores/api/reviews/{shopId}:
 *   get:
 *     summary: Retrieve reviews by shop ID
 *     description: Returns all reviews for a specific shop.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - name: shopId
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve reviews for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews for the specified shop.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewId:
 *                     type: string
 *                   shopId:
 *                     type: string
 *                   customerId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   reviewText:
 *                     type: string
 *                   avatarUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   userName:
 *                     type: string
 *       404:
 *         description: Shop not found.
 *       500:
 *         description: Error fetching reviews.
 */

/**
 * @swagger
 * /stores/api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Updates the details of an existing review.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: The ID of the review to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewText:
 *                 type: string
 *               rating:
 *                 type: number
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Error updating review.
 */

/**
 * @swagger
 * /stores/api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes a specific review.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: The ID of the review to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: Error deleting review.
 */
