import multer, { Multer } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${extname}`;
    cb(null, filename);
  },
});

export const upload: Multer = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
