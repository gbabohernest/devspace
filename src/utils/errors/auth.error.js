import CustomApiError from "./custom-api.error.js";
import { StatusCodes } from "http-status-codes";

class AuthError extends CustomApiError {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default AuthError;
