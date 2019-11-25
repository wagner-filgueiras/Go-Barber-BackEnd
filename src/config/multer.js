import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // how multer will store our image file
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // add a unique code before each image filename
      crypto.randomBytes(16, (err, res) => {
        // cb is callback
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
