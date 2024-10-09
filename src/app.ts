import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./auth/passport.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger.js";

import { NODE_ENV } from "./utils/env.js";
import auth from "./routes/auth.js";
import management from "./routes/management.js";
import user from "./routes/user.js";
import setupMiddlewares from "./auth/middleware.js";
import { sessionInstance } from "./auth/session.js";

dotenv.config();

const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);

setupMiddlewares(app);


if (NODE_ENV === "production") app.set("trust proxy", 1);

app.use(sessionInstance);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users/auth", auth);
app.use("/users", user);
app.use("/stores/api", management);
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "JongRhanRhao backend is up and running!" });
});

export default app;
