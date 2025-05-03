import { CustomApiError } from "../../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";

const authorizationMiddleware = (req, res, next) => {
  const { role } = req.userInfo;

  if (role !== "admin") {
    return next(
      new CustomApiError(
        "You are not authorized to make this request",
        StatusCodes.FORBIDDEN,
      ),
    );
  }

  next();
};

export default authorizationMiddleware;
