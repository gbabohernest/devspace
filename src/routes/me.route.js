import { Router } from "express";
import authMiddleware from "../middlewares/authentication/auth.middleware.js";
import {
  getAllThisUserProjects,
  getThisUserInfo,
} from "../controllers/users/me.controller.js";

const meRouter = new Router();

meRouter.get("/", authMiddleware, getThisUserInfo);
meRouter.get("/projects", authMiddleware, getAllThisUserProjects);

export default meRouter;
