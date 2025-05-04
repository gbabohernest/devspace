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
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

app.set("trust proxy", 1 /* number of proxies between user and server */);

//For handling file path when loading swagger.yaml file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//SWAGGER DOCS
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

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
app.use("/api/v1/admin", authorizationRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res
    .status(StatusCodes.OK)
    .send(
      `<h1 style="text-align: center; font-family: Arial, sans-serif; color: #333; font-size: 2.5rem;">DevSpace API v1</h1>` +
        `<a href="/api-docs" style="display: block; text-align: center; margin-top: 20px; font-size: 1.2rem; color: #007BFF; text-decoration: none;">Documentation</a>`,
    );
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
