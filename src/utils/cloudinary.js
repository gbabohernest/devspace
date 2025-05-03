import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./index.utils.js";
import cloudinary from "../../config/cloudinary.config.js";

const uploadToCloudinary = async (asset) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(asset, {
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 500, height: 500, crop: "fill", gravity: "auto" },
      ],
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    throw new CustomApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export default uploadToCloudinary;
