import { Router } from "express";
import authMiddleware from "../middlewares/authentication/auth.middleware.js";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";

const projectRouter = new Router();

/**
 * PUBLIC ROUTES
 */
projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProject);

/**
 * PROTECTED ROUTES
 */
projectRouter.post("/", authMiddleware, createProject);
projectRouter.patch("/:id", authMiddleware, updateProject);
projectRouter.delete("/:id", authMiddleware, deleteProject);

export default projectRouter;
