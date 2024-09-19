import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export default function setupMiddlewares(app: any) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  // app.use(limiter);
  app.use(mongoSanitize()); // Prevent NoSQL injections
  app.use(xss()); // Prevent XSS attacks
  app.use(hpp()); // Prevent HTTP Parameter Pollution attacks
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:5173",
        ],
      },
    })
  );
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
}
