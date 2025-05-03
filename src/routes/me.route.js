import { Router } from "express";
import authMiddleware from "../middlewares/authentication/auth.middleware.js";
import {
  changeAvatar,
  getAllThisUserProjects,
  getThisUserInfo,
} from "../controllers/users/me.controller.js";
import multerUploadMiddleware from "../middlewares/multer/multer.middleware.js";

const meRouter = new Router();

meRouter.get("/", authMiddleware, getThisUserInfo);
meRouter.get("/projects", authMiddleware, getAllThisUserProjects);
meRouter.post(
  "/change-avatar",
  authMiddleware,
  multerUploadMiddleware.single("image"),
  changeAvatar,
);

export default meRouter;
