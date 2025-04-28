/**
 *  Performs some checks before granting access to authenticated route.
 *  Checks if user is authenticated with a JWT attached to their request.
 * @param req
 * @param res
 * @param next
 */
import authError from "../../utils/errors/auth.error.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../../../config/env.js";

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new authError("No access token provided, Not Authorized"));
  }

  const [, token] = authorization.split(" ");

  try {
    const payload = await jwt.verify(token, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { userId, username, role } = payload;
    req.userInfo = { userId, username, role };

    next();
  } catch (error) {
    next(new authError(error.message));
  }
};

export default authMiddleware;
