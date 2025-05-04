import express from "express";
import databaseConnection from "./database/connection.database.js";
import { PORT } from "../config/env.js";
import errorMiddleware from "./middlewares/errors.middleware.js";
import helmet from "helmet";
import cors from "cors";
import sanitizeInputMiddleware from "./middlewares/sanitize-inputs/sanitize-inputs.middleware.js";
import limiter from "./utils/rate-limit.js";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import meRouter from "./routes/me.route.js";
import authorizationRouter from "./routes/authorization.route.js";
import { StatusCodes } from "http-status-codes";

const app = express();

app.set("trust proxy", 1 /* number of proxies between user and server */);

/**
 * Security and Json usage
 */
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(sanitizeInputMiddleware);

/**
 * Routes
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/admin/", authorizationRouter);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send(`<h2>DevSpace API v1</h2>`);
});

authRouter.route("/login-test").post((req, res) => {
  res.json({ message: "login test work" });
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);

const port = PORT || 5000;

const startSever = async () => {
  try {
    await databaseConnection();
    app.listen(port, () => {
      console.log(`DevSpace is running  on PORT ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

await startSever();
