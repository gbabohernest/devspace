import User from "../../models/user.model.js";
import {
  BadRequestError,
  ResourceNotFoundError,
} from "../../utils/index.utils.js";
import formatDate from "../../utils/helpers/dateFormatter.js";
import Project from "../../models/project.model.js";
import { StatusCodes } from "http-status-codes";
import paginate from "../../utils/paginate.js";
import transactionHelper from "../../utils/helpers/transaction.js";
import uploadToCloudinary from "../../utils/cloudinary.js";
import { unlinkSync } from "node:fs";
import deleteOldAvatarIfNotDefault from "../../utils/helpers/deleteAvatar.js";

/**
 * Get User information
 * @param req
 * @param res
 * @returns {Promise<ResourceNotFoundError>}
 */
const getThisUserInfo = async (req, res) => {
  const { userId } = req.userInfo;

  const user = await User.findById(userId, "-password -_id", null);

  if (!user) {
    return new ResourceNotFoundError("No user found");
  }

  const { username, bio, email, createdAt, avatarURL } = user;
  const userData = {
    Username: username,
    Bio: bio,
    Email: email,
    Avatar: avatarURL,
    Projects: await user.getTotalProjects(userId),
    Joined: formatDate(createdAt),
  };

  res
    .status(200)
    .json({ success: true, message: "Your Data is Retrieved", userData });
};

/**
 * Get all this user's project, public & private projects
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getAllThisUserProjects = async (req, res) => {
  const { userId } = req.userInfo;

  const projects = await paginate(
    req,
    Project,
    { createdBy: userId },
    "",
    { updatedAt: -1 },
    ["title", "description", "tech"],
  );

  if (projects.data.length < 1) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `You have not created any Project(s). Start creating project(s)`,
      projects: projects.data,
    });
  }

  res.status(200).json({
    success: true,
    message: "A paginated list of all your project(s)",
    projects,
  });
};

/**
 * Upload user's avatar to cloudinary and store the public_id and secure url in database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const changeAvatar = async (req, res, next) => {
  await transactionHelper(async (session) => {
    if (!req.file) {
      return next(new BadRequestError("Please add your new avatar"));
    }

    await deleteOldAvatarIfNotDefault(req.userInfo.userId);

    const [{ url, publicId }, user] = await Promise.all([
      uploadToCloudinary(req.file.path),
      User.findById(req.userInfo.userId, { avatarURL: 1, updatedAt: 1 }, null),
    ]);

    Object.assign(user, { avatarURL: url, avatarId: publicId });

    await user.save({ session, validateBeforeSave: true, timestamp: false });

    return res
      .status(200)
      .json({ success: true, message: "Avatar changed successfully", user });
  }, next);

  unlinkSync(req.file.path);
};

export { getAllThisUserProjects, getThisUserInfo, changeAvatar };
