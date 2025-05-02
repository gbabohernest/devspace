import User from "../../models/user.model.js";
import { ResourceNotFoundError } from "../../utils/index.utils.js";
import formatDate from "../../utils/helpers/dateFormatter.js";
import Project from "../../models/project.model.js";
import { StatusCodes } from "http-status-codes";
import paginate from "../../utils/paginate.js";

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

  const { username, bio, email, createdAt } = user;
  const userData = {
    Username: username,
    Bio: bio,
    Email: email,
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

export { getAllThisUserProjects, getThisUserInfo };
