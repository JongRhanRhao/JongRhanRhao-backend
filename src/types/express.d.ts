import { User } from "../models/users";
import * as multer from "multer";
declare global {
  namespace Express {
    interface Request {
      files?: multer.File[];
    }
    interface Request {
      isAuthenticated: () => boolean;
      user?: User;
    }
  }
}
