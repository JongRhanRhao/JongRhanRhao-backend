import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import helmet from "helmet";

import "./config/passport";
import auth from "./routes/auth";
import jong from "./routes/jong";

dotenv.config();

export const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "tanned-catchable-spool",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users/auth", auth);
app.use("/stores/api/", jong);
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});
