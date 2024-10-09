/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: API related to reservation management.
 */

/**
 * @swagger
 * /stores/api/reservations:
 *   get:
 *     summary: Retrieve all reservations
 *     description: Returns a list of all reservations.
 *     tags:
 *       - Reservations
 *     responses:
 *       200:
 *         description: A list of reservations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reservation_id:
 *                     type: string
 *                     description: The unique ID of the reservation.
 *                   shop_id:
 *                     type: string
 *                     description: The ID of the store for the reservation.
 *                   customer_id:
 *                     type: string
 *                     description: The ID of the customer who made the reservation.
 *                   reservation_date:
 *                     type: string
 *                     description: The date of the reservation.
 *                   reservation_time:
 *                     type: string
 *                     description: The time of the reservation.
 *                   reservation_status:
 *                     type: string
 *                     description: The status of the reservation (confirmed, cancelled, etc.).
 */

/**
 * @swagger
 * /stores/api/reservations/{id}:
 *   get:
 *     summary: Retrieve a reservation by ID
 *     description: Returns the details of a specific reservation.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A reservation object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation_id:
 *                   type: string
 *                 shop_id:
 *                   type: string
 *                 customer_id:
 *                   type: string
 *                 reservation_date:
 *                   type: string
 *                 reservation_time:
 *                   type: string
 *                 reservation_status:
 *                   type: string
 *       404:
 *         description: Reservation not found.
 */

/**
 * @swagger
 * /stores/api/reservations/customer/{id}:
 *   get:
 *     summary: Retrieve reservations by customer ID
 *     description: Returns a list of reservations for a specific customer.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to retrieve reservations for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations for the customer.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reservation_id:
 *                     type: string
 *                     description: The unique ID of the reservation.
 *                   shop_name:
 *                     type: string
 *                     description: The name of the store for the reservation.
 *                   reservation_date:
 *                     type: string
 *                     description: The date of the reservation.
 *                   reservation_time:
 *                     type: string
 *                     description: The time of the reservation.
 *       404:
 *         description: No reservations found for this customer.
 */

/**
 * @swagger
 * /stores/api/reservations/store/{id}:
 *   get:
 *     summary: Retrieve reservations by shop ID
 *     description: Returns a list of reservations for a specific shop.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve reservations for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations for the shop.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reservation_id:
 *                     type: string
 *                     description: The unique ID of the reservation.
 *                   customer_id:
 *                     type: string
 *                     description: The ID of the customer who made the reservation.
 *                   reservation_date:
 *                     type: string
 *                     description: The date of the reservation.
 *                   reservation_time:
 *                     type: string
 *                     description: The time of the reservation.
 *       404:
 *         description: No reservations found for this shop.
 */

/**
 * @swagger
 * /stores/api/reservations/{shopId}/{reservationDate}:
 *   get:
 *     summary: Retrieve reservations by shop ID and date
 *     description: Returns a list of reservations for a specific shop on a specific date.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: shopId
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve reservations for.
 *         schema:
 *           type: string
 *       - name: reservationDate
 *         in: path
 *         required: true
 *         description: The date of the reservations to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations for the shop on the specified date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reservation_id:
 *                     type: string
 *                     description: The unique ID of the reservation.
 *                   customer_id:
 *                     type: string
 *                     description: The ID of the customer who made the reservation.
 *                   reservation_time:
 *                     type: string
 *                     description: The time of the reservation.
 *       404:
 *         description: No reservations found for this shop on this date.
 */

/**
 * @swagger
 * /stores/api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     description: Creates a new reservation and returns the created reservation object.
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: string
 *               customer_id:
 *                 type: string
 *               reservation_date:
 *                 type: string
 *               reservation_time:
 *                 type: string
 *               number_of_people:
 *                 type: integer
 *               note:
 *                 type: string
 *               phone_number:
 *                 type: string
 *             required:
 *               - shop_id
 *               - customer_id
 *               - reservation_date
 *               - reservation_time
 *               - number_of_people
 *     responses:
 *       201:
 *         description: Reservation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation_id:
 *                   type: string
 *                 shop_id:
 *                   type: string
 *                 customer_id:
 *                   type: string
 *       400:
 *         description: Invalid input data.
 */

/**
 * @swagger
 * /stores/api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     description: Updates the details of an existing reservation.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservation_date:
 *                 type: string
 *               reservation_time:
 *                 type: string
 *               number_of_people:
 *                 type: integer
 *               note:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation_id:
 *                   type: string
 *       404:
 *         description: Reservation not found.
 */
/**
 * @swagger
 * /stores/api/reservations/status/{id}:
 *   put:
 *     summary: Update the status of a reservation
 *     description: Updates the status of an existing reservation.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to update the status for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the reservation (confirmed, cancelled, etc.).
 *     responses:
 *       200:
 *         description: Reservation status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation status updated to confirmed."
 *                 reservationId:
 *                   type: string
 *                   example: "abc123"
 *       400:
 *         description: Bad request. Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid status value provided."
 *       404:
 *         description: Reservation not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation with this ID does not exist."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the reservation status."
 */

/**
 * @swagger
 * /stores/api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     description: Deletes an existing reservation by ID.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reservation deleted successfully.
 *       404:
 *         description: Reservation not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation with this ID does not exist."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the reservation."
 */
