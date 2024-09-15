import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import helmet from "helmet";

import { createServer } from "http";
import { Server } from "socket.io";

import { NODE_ENV } from "./utils/env";
import { sessionInstance } from "./auth/session";
import "./auth/passport";

import auth from "./routes/auth";
import jong from "./routes/jong";

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

// socket
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected");

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });

  socket.on("store_update", (data) => {
    console.log(`Store updated: ${data.storeId}`);
    io.emit("store_update", { storeId: data.storeId });
  });

  socket.on("reservation_update", (data) => {
    console.log(`Reservation updated: ${data.reservationId}`);
    io.emit("reservation_update", { reservationId: data.reservationId });
  });
});

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

const PORT = 3000;
server.listen(PORT, () => {
  console.log(
    `🍺 JongRhanRhao server is running on ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`
  );
});
