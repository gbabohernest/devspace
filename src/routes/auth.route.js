import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = new Router();

authRouter.route("/register").post(registerUser);

authRouter.route("/login").post(loginUser);

export default authRouter;
