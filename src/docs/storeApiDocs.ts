/**
 * @swagger
 * tags:
 *   - name: Stores
 *     description: API related to store management.
 */

/**
 * @swagger
 * /stores/api/stores:
 *   get:
 *     summary: Retrieve all stores
 *     description: Returns a list of all stores.
 *     tags:
 *       - Stores
 *     responses:
 *       200:
 *         description: A list of stores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   storeId:
 *                     type: string
 *                     description: The unique ID of the store.
 *                   shopName:
 *                     type: string
 *                     description: The name of the store.
 *                   address:
 *                     type: string
 *                     description: The address of the store.
 *                   status:
 *                     type: string
 *                     description: The current status of the store (open, closed, etc.).
 */

/**
 * @swagger
 * /stores/api/stores/popular:
 *   get:
 *     summary: Retrieve popular stores
 *     description: Returns a list of popular stores.
 *     tags:
 *       - Stores
 *     responses:
 *       200:
 *         description: A list of popular stores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   storeId:
 *                     type: string
 *                     description: The unique ID of the store.
 *                   shopName:
 *                     type: string
 *                     description: The name of the store.
 */

/**
 * @swagger
 * /stores/api/stores/{id}:
 *   get:
 *     summary: Retrieve a store by ID
 *     description: Returns the details of a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A store object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storeId:
 *                   type: string
 *                 shopName:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 openTimeBooking:
 *                   type: string
 *                   format: date-time
 *                 address:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Store not found.
 */

/**
 * @swagger
 * /stores/api/stores:
 *   post:
 *     summary: Create a new store
 *     description: Creates a new store and returns the created store object.
 *     tags:
 *       - Stores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: string
 *               staffId:
 *                 type: string
 *               shopName:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               openTimeBooking:
 *                 type: string
 *               cancelReserve:
 *                 type: boolean
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *               rating:
 *                 type: number
 *               isPopular:
 *                 type: boolean
 *               type:
 *                 type: string
 *               defaultSeats:
 *                 type: integer
 *               ageRange:
 *                 type: string
 *             required:
 *               - ownerId
 *               - shopName
 *     responses:
 *       201:
 *         description: Store created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storeId:
 *                   type: string
 *                 shopName:
 *                   type: string
 *       409:
 *         description: Store already exists.
 */

/**
 * @swagger
 * /stores/api/stores/{id}:
 *   put:
 *     summary: Update a store
 *     description: Updates the details of an existing store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopName:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               openTimeBooking:
 *                 type: string
 *               cancelReserve:
 *                 type: boolean
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *               rating:
 *                 type: number
 *               isPopular:
 *                 type: boolean
 *               type:
 *                 type: string
 *               defaultSeats:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Store updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storeId:
 *                   type: string
 *       404:
 *         description: Store not found.
 */

/**
 * @swagger
 * /stores/api/stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     description: Deletes a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Store deleted successfully.
 *       404:
 *         description: Store not found.
 */

/**
 * @swagger
 * /stores/api/stores/add-store-images:
 *   post:
 *     summary: Add images to a store
 *     description: Adds images to an existing store.
 *     tags:
 *       - Stores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     original:
 *                       type: string
 *                     thumbnail:
 *                       type: string
 *             required:
 *               - storeId
 *               - images
 *     responses:
 *       201:
 *         description: Images added successfully.
 *       400:
 *         description: Invalid input data.
 */

/**
 * @swagger
 * /stores/api/stores/{id}/images:
 *   get:
 *     summary: Retrieve images for a store
 *     description: Returns a list of images for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to retrieve images for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of images for the store.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   original:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *       404:
 *         description: No images found for this store.
 */

/**
 * @swagger
 * /stores/api/stores/{id}/staff:
 *   get:
 *     summary: Retrieve staff for a store
 *     description: Returns a list of staff members for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to retrieve staff for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of staff members for the store.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   name:
 *                     type: string
 *       404:
 *         description: Store not found or no staff found for this store.
 */
/**
 * @swagger
 * /stores/api/stores/{id}/staff:
 *   delete:
 *     summary: Remove a staff member from a store
 *     description: Removes a staff member from a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store from which the staff member will be removed.
 *         schema:
 *           type: string
 *       - name: staffId
 *         in: query
 *         required: true
 *         description: The ID of the staff member to be removed.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Staff member removed successfully.
 *       404:
 *         description: Store not found or staff member not found.
 */

/**
 * @swagger
 * /stores/api/stores/{id}/reviews:
 *   get:
 *     summary: Retrieve reviews for a store
 *     description: Returns a list of reviews for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to retrieve reviews for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews for the store.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Store not found or no reviews found for this store.
 */

/**
 * @swagger
 * /stores/api/stores/{id}/reviews:
 *   post:
 *     summary: Add a review for a store
 *     description: Adds a review for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store to add a review for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               comment:
 *                 type: string
 *               rating:
 *                 type: number
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - userId
 *               - comment
 *               - rating
 *     responses:
 *       201:
 *         description: Review added successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Store not found.
 */

/**
 * @swagger
 * /stores/api/stores/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review for a store
 *     description: Deletes a specific review from a store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store.
 *         schema:
 *           type: string
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
 *         description: Store or review not found.
 */
/**
 * @swagger
 * /stores/{storeId}/availability:
 *   get:
 *     summary: Get availability for a store
 *     description: Retrieve the availability status for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: The ID of the store to retrieve availability for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability status for the store.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date
 *                 unavailableDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date
 *       404:
 *         description: Store not found.
 */

/**
 * @swagger
 * /stores/{storeId}/availability:
 *   post:
 *     summary: Create or update availability for a store
 *     description: Creates or updates the availability status for a specific store.
 *     tags:
 *       - Stores
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         description: The ID of the store to create or update availability for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availableDates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *               unavailableDates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *             required:
 *               - availableDates
 *               - unavailableDates
 *     responses:
 *       201:
 *         description: Availability created or updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Store not found.
 */
