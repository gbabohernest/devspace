import transactionHelper from "../utils/helpers/transaction.js";
import Project from "../models/project.model.js";
import { BadRequestError, CustomApiError } from "../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import projectValidationSchema from "../utils/validators/project.validation.js";

/**
 * Create project, protected route, only authenticated users are allow to create project(s).
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const createProject = async (req, res, next) => {
  await transactionHelper(async (session) => {
    let { title, description, tech } = req.body;
    const { userId } = req.userInfo;

    const { error, value } = projectValidationSchema.validate({
      title,
      description,
      tech,
    });

    if (error) {
      return next(new BadRequestError(error?.details[0]?.message));
    }

    title = value.title;
    description = value.description;
    tech = value.tech;

    const project = await Project.create(
      [{ title, description, tech, createdBy: userId }],
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
  const projects = await Project.find(
    {},
    { title: 1, description: 1, tech: 1, createdBy: 1 },
    null,
  ).sort({ createdAt: -1 });

  if (!projects) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "No Project Found, signup and upload project(s)",
      projects,
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Paginated List of Projects",
    nbHits: projects.length,
    data: projects,
  });
};

export { createProject, getProjects };
