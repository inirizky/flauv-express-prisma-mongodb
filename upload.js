import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "assets"));
  },
  filename: (req, file, cb) => {
    const uniqueName = file.originalname;
    cb(null, uniqueName);
  },
});

export const deleteFile = async (filename) => {
  const filepath = path.join(__dirname, "assets", filename);
  fs.unlink(filepath, (err) => {
    if (err) {
      console.log(`Error deleting file: ${filepath}`);
    } else {
      console.log(`File deleted  `);
    }
  });
};

const upload = multer({ storage });

export default upload;
