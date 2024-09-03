import * as multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      files?: multer.File[];  // Declare `files` as an array of `multer.File`
    }
  }
}