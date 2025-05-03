import User from "../../models/user.model.js";
import { DEFAULT_AVATAR_PUBLIC_ID } from "../../../config/env.js";
import cloudinary from "../../../config/cloudinary.config.js";
import { StatusCodes } from "http-status-codes";
import { CustomApiError, ResourceNotFoundError } from "../index.utils.js";

/**
 *  Try to delete user's  current avatar  if it is not the default avatar and
 *  user is trying to upload a new avatar, remove old avatar from cloudinary.
 *
 * @param userId - The user id for verification
 *
 */
const deleteOldAvatarIfNotDefault = async (userId) => {
  try {
    const user = await User.findById(userId, { avatarId: 1 }, null);

    if (user.avatarId !== DEFAULT_AVATAR_PUBLIC_ID) {
      // Not first time upload
      await cloudinary.uploader.destroy(user.avatarId, { invalidate: true });
    }
  } catch (error) {
    throw new CustomApiError(
      error.message | "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export default deleteOldAvatarIfNotDefault;
