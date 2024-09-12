import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import helmet from "helmet";

import { NODE_ENV } from "./utils/env";
import { sessionInstance } from "./auth/session";
import "./auth/passport";

import auth from "./routes/auth";
import jong from "./routes/jong";
import { users } from "../db/schema";

dotenv.config();

export const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionInstance);

// Session
if (NODE_ENV === "production") app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users/auth", auth);
app.use("/stores/api", jong);
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});
