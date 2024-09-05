import * as multer from "multer";
declare global {
  namespace Express {
    // interface User {
    //   user_id: string;
    //   user_email: string;
    //   role: string;
    // }

    interface Request {
      // user?: User;
      files?: multer.File[];
    }
  }
}
