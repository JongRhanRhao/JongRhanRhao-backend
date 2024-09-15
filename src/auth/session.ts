import session from "express-session";
import { NODE_ENV } from "../utils/env";

export const sessionInstance = session({
  secret: process.env.SESSION_SECRET || "tanned-catchable-spool",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "strict",
  },
});
