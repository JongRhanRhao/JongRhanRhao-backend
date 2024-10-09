/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API related to user authentication.
 */

/**
 * @swagger
 * /users/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns the user object.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully.
 */

/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Log in a user and return a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: A JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

/**
 * @swagger
 * /users/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirect the user to Google for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page.
 */

/**
 * @swagger
 * /users/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback after Google OAuth authentication, redirects the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to the client application on success or failure.
 */
/**
 * @swagger
 * /users/auth/facebook:
 *   get:
 *     summary: Facebook OAuth login
 *     description: Redirect the user to Facebook for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Facebook authentication page.
 */

/**
 * @swagger
 * /users/auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     description: Callback after Facebook OAuth authentication, redirects the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to the client application on success or failure.
 */

/**
 * @swagger
 * /users/auth/sessions:
 *   get:
 *     summary: Get the current session user
 *     description: Check if the user is logged in and return their session data.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User session data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The session user object.
 *       401:
 *         description: No active session found.
 */

/**
 * @swagger
 * /users/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile information of the logged-in user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The current user's profile.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /users/auth/logout:
 *   get:
 *     summary: Log out the user
 *     description: Log out the user and destroy the session.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       500:
 *         description: Failed to log out.
 */
