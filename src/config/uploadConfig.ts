import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '..', '..', 'uploads');

    // uploads 디렉토리가 없을 경우 자동으로 생성
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath);
    }

    cb(null, destinationPath);
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
