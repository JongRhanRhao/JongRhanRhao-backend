import express from "express";
import helmet from "helmet";
import cors from "cors";
import { app } from "../app";
import bodyParser from "body-parser";
import { sessionInstance } from "./session";

export default function setupMiddlewares(app: any) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(sessionInstance);
}
