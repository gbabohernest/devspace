import { Router } from "express";
import {
  getUsers,
  getProjects,
} from "../controllers/admin/admin.controller.js";
import authMiddleware from "../middlewares/authentication/auth.middleware.js";
import authorizationMiddleware from "../middlewares/authorization/authorization.middleware.js";

const authorizationRouter = new Router();

authorizationRouter.get(
  "/users",
  authMiddleware,
  authorizationMiddleware,
  getUsers,
);

authorizationRouter.get(
  "/projects",
  authMiddleware,
  authorizationMiddleware,
  getProjects,
);

export default authorizationRouter;
