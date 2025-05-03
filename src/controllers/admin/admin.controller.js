import User from "../../models/user.model.js";
import { CustomApiError } from "../../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import Project from "../../models/project.model.js";
import paginate from "../../utils/paginate.js";

/**
 * GET a paginated List of all users
 */
const getUsers = async (req, res) => {
  const { userId, role } = req.userInfo;

  const projection = "username email updatedAt";
  try {
    const users = await paginate(
      req,
      User,
      { role: "user" },
      projection,
      { updatedAt: -1 },
      ["username", "bio"],
    );

    res.status(200).json({
      success: true,
      message: "All DevSpace Users",
      users,
    });
  } catch (error) {
    return new CustomApiError(
      "Something went wrong, Failed to fetch all users",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await paginate(
      req,
      Project,
      {},
      "",
      { updatedAt: -1 },
      ["title", "description", "tech"],
      "creator",
    );

    if (projects.data.length < 1) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "No project(s) created yet by our user(s)",
        projects,
      });
    }

    //paginated list of projects
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Paginated List of All projects created by DevSpace users",
      projects,
    });
  } catch (error) {
    return new CustomApiError(
      "Failed to fetch all projects",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export { getUsers, getProjects };
