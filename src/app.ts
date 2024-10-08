import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./auth/passport.js";

import { NODE_ENV } from "./utils/env.js";
import auth from "./routes/auth.js";
import jong from "./routes/management.js";
import user from "./routes/user.js";
import setupMiddlewares from "./auth/middleware.js";
import { sessionInstance } from "./auth/session.js";

dotenv.config();

const app = express();

setupMiddlewares(app);

if (NODE_ENV === "production") app.set("trust proxy", 1);

app.use(sessionInstance);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users/auth", auth);
app.use("/users", user);
app.use("/stores/api", jong);
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});

export default app;
