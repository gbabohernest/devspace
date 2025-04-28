import CustomApiError from "./custom-api.error.js";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);

    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
