/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API related to user management.
 */
/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update user profile
 *     description: Updates the details of an existing user profile.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: The new name of the user.
 *               phone_number:
 *                 type: string
 *                 description: The new phone number of the user.
 *             required:
 *               - user_name
 *               - phone_number
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: The ID of the updated user.
 *                 user_name:
 *                   type: string
 *                   description: The updated name of the user.
 *                 phone_number:
 *                   type: string
 *                   description: The updated phone number of the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
