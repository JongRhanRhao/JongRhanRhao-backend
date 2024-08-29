import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../dbConfig/db";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as jwt.JwtPayload;
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.body.userId = decoded.userId;
    req.body.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Input validation
const validateUserInput = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role").notEmpty().withMessage("Role is required"),
];

// Register route
router.post("/register", validateUserInput, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  try {
    const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    
    if (userExists.rowCount === null) {
      return res.status(500).json({ message: "Database error" }); // Or handle the error appropriately
    }
    if (userExists.rowCount > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    console.log("Login Request Body:", req.body);

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("Database Query Result:", result.rows);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Stored Password Hash:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", passwordMatch);

    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" },
      );
      console.log("Token:", token);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;