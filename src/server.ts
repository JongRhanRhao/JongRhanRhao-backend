import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import router from '../src/routes/jongRoute';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "http:localhost:5173",
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
//POST: localhost:3000/api/auth/register {name, email, password, role}
//POST: localhost:3000/api/auth/login {email, password}
app.use("/api/jong", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
