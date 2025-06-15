import multer from "multer";
import fs from "fs";
import path from "path";

// Create the full path to /server/public/temp dynamically
const uploadPath = path.join(__dirname, "../../public/temp");

// Ensure the directory exists before using it
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Pass safe path
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save with original name
  }
});

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
  storage,
  limits,
});

export default upload;
