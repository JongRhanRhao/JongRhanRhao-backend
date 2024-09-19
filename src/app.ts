import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./auth/passport";
import path from "path";

import { NODE_ENV } from "./utils/env";
import auth from "./routes/auth";
import jong from "./routes/jong";
import user from "./routes/user";
import setupMiddlewares from "./auth/middleware";
import { __dirname } from "./controller/storeController";
import { sessionInstance } from "./auth/session";

dotenv.config();

export const app = express();

setupMiddlewares(app);

if (NODE_ENV === "production") app.set("trust proxy", 1);

app.use(sessionInstance);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users/auth", auth);
app.use("/users", user);
app.use("/stores/api", jong);
app.use("/stores/images", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});
