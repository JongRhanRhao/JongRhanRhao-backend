/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: API for managing favorites.
 */

/**
 * @swagger
 * /stores/api/favorites:
 *   get:
 *     summary: Get all favorites
 *     description: Retrieve a list of all favorites.
 *     tags:
 *       - Favorites
 *     responses:
 *       200:
 *         description: A list of favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   favorite_id:
 *                     type: integer
 *                   customer_id:
 *                     type: integer
 *                   store_id:
 *                     type: integer
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites/{id}:
 *   get:
 *     summary: Get a favorite by ID
 *     description: Retrieve a favorite by its unique ID.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the favorite to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The favorite object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorite_id:
 *                   type: integer
 *                 customer_id:
 *                   type: integer
 *                 store_id:
 *                   type: integer
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites/customer/{id}:
 *   get:
 *     summary: Get favorites by customer ID
 *     description: Retrieve all favorites for a specific customer.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer whose favorites to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of favorites for the customer.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   favorite_id:
 *                     type: integer
 *                   customer_id:
 *                     type: integer
 *                   store_id:
 *                     type: integer
 *       404:
 *         description: No favorites found for the customer.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites:
 *   post:
 *     summary: Create a new favorite
 *     description: Add a new favorite for a customer.
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               storeId:
 *                 type: integer
 *             required:
 *               - customerId
 *               - storeId
 *     responses:
 *       201:
 *         description: Favorite created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorite_id:
 *                   type: integer
 *                 customer_id:
 *                   type: integer
 *                 store_id:
 *                   type: integer
 *       400:
 *         description: Favorite already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites/status:
 *   post:
 *     summary: Get favorite status
 *     description: Check if a store is a favorite for a specific customer.
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               storeId:
 *                 type: integer
 *             required:
 *               - customerId
 *               - storeId
 *     responses:
 *       200:
 *         description: Returns the favorite status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites/{id}:
 *   put:
 *     summary: Update a favorite
 *     description: Update an existing favorite by ID.
 *     tags:
 *       - Favorites
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the favorite to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               storeId:
 *                 type: integer
 *             required:
 *               - customerId
 *               - storeId
 *     responses:
 *       200:
 *         description: Favorite updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorite_id:
 *                   type: integer
 *                 customer_id:
 *                   type: integer
 *                 store_id:
 *                   type: integer
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /stores/api/favorites/remove:
 *   post:
 *     summary: Delete a favorite
 *     description: Remove a favorite for a specific customer and store.
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               storeId:
 *                 type: integer
 *             required:
 *               - customerId
 *               - storeId
 *     responses:
 *       204:
 *         description: Favorite deleted successfully.
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal server error.
 */
