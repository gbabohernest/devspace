import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { BadRequestError } from "../../utils/index.utils.js";

// Dynamically create the uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads/");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * multer middleware  for multipart / form data
 * checks the file uploads metadata
 */

// upload location & unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 100) + 1;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// file filter function
const fileFilter = (req, file, cb) => {
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only JPEG, PNG, and GIF files are allowed"), false);
  }
};

const multerUploadMiddleware = multer({
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB filesize
  },
  storage,
});

export default multerUploadMiddleware;
