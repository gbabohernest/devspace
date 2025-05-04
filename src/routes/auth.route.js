import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = new Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

export default authRouter;
