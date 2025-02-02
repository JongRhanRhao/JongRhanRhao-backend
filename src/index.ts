import { createServer } from "http";
import { Server, Socket } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://g8.fsd.cpe.eng.cmu.ac.th",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
});

io.on("connection", (socket: Socket) => {
  socket.on("store_update", (data: { storeId: string }) => {
    console.log(`Store updated: ${data.storeId}`);
    io.emit("store_update", { storeId: data.storeId });
  });

  socket.on("reservation_update", (data: { reservationId: string }) => {
    console.log(`Reservation updated: ${data.reservationId}`);
    io.emit("reservation_update", { reservationId: data.reservationId });
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `🍺 JongRhanRhao server is running on ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`
  );
});
