import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.body.userId = (user as any).userId; // Attach userId to the request
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateJWT;