import { config } from "dotenv";

config();

export const {
  PORT,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  DEFAULT_AVATAR_URL,
  DEFAULT_AVATAR_PUBLIC_ID,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
