import transactionHelper from "../utils/helpers/transaction.js";
import Project from "../models/project.model.js";
import {
  BadRequestError,
  ResourceNotFoundError,
} from "../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import projectValidationSchema from "../utils/validators/project.validation.js";
import paginate from "../utils/paginate.js";

/**
 * Create project, protected route, only authenticated users are allow to create project(s).
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const createProject = async (req, res, next) => {
  await transactionHelper(async (session) => {
    let { title, description, tech, isPublic } = req.body;
    const { userId } = req.userInfo;

    const { error, value } = projectValidationSchema.validate({
      title,
      description,
      tech,
      isPublic,
    });

    if (error) {
      return next(new BadRequestError(error?.details[0]?.message));
    }

    title = value.title;
    description = value.description;
    tech = value.tech;
    isPublic = value.isPublic;

    const project = await Project.create(
      [{ title, description, tech, isPublic, createdBy: userId }],
      { session },
    );
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  }, next);
};

/**
 * Get a paginated list of projects - PUBLIC
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getProjects = async (req, res) => {
  const filter = { isPublic: true };
  const sort = { updatedAt: -1 };

  const projects = await paginate(
    req,
    Project,
    filter,
    "",
    sort,
    ["title", "description", "tech"],
    "creator",
  );

  if (projects.data.length < 1) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "No Project Found, signup and uploads project(s)",
      data: projects.data,
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Paginated List of Projects",
    projects,
  });
};

/**
 * Get more details about a project - PUBLIC
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getProject = async (req, res) => {
  const { id: projectId } = req.params;

  const project = await Project.findOne(
    { _id: projectId, isPublic: true },
    "",
    null,
  ).populate("creator", "username -_id");

  if (!project) {
    throw new ResourceNotFoundError("Sorry, No project Found, Try again!");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project Details Retrieved",
    project,
  });
};

/**
 * Update a project - Protected route | Authenticated users only
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const updateProject = async (req, res, next) => {
  await transactionHelper(async (session) => {
    const { id: projectId } = req.params;
    const { userId } = req.userInfo;

    const project = await Project.findOne(
      { _id: projectId, createdBy: userId },
      "",
      null,
    );

    if (!project) {
      return next(new ResourceNotFoundError("Sorry, No project found!"));
    }

    Object.assign(project, { ...req.body });
    await project.save({ session, validateBeforeSave: true, timestamp: false });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  }, next);
};

/**
 * Delete a project | Authenticated User
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const deleteProject = async (req, res, next) => {
  await transactionHelper(async (session) => {
    const { id: productId } = req.params;

    const project = await Project.findOneAndDelete(
      { _id: productId, createdBy: req.userInfo.userId },
      { title: 1, createdBy: 1 },
    ).session(session);

    if (!project) {
      return next(new ResourceNotFoundError("No project found to delete"));
    }

    res.status(StatusCodes.NO_CONTENT).end();
  }, next);
};

export { createProject, getProjects, getProject, updateProject, deleteProject };
