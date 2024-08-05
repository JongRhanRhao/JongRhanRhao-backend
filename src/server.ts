import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { dbClient, dbConn } from "../db/client";
import { users, stores, tables, favorites, reservations } from "../db/schema";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
