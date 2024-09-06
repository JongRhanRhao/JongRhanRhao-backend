import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(
    `🍺 JongRhanRhao server is running on ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`
  );
});
