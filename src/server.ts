import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
