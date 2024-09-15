import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("store_update", (data) => {
    console.log(`Store updated: ${data.storeId}`);
    io.emit("store_update", { storeId: data.storeId });
  });

  socket.on("reservation_update", (data) => {
    console.log(`Reservation updated: ${data.reservationId}`);
    io.emit("reservation_update", { reservationId: data.reservationId });
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `🍺 JongRhanRhao server is running on ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`
  );
});
