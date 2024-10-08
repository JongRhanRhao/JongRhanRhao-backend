import "express-session";
import "passport";

declare module "express-session" {
  interface SessionData {
    passport: {
      user?: any;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      logout(callback?: (err?: any) => void): void;
    }
  }
}
