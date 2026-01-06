import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// Service bantu untuk dapat URL gambar
export function getImageUrl(file) {
  if (!file) return null;
  return `assets/${file.filename}`;
}
