import CustomApiError from "./custom-api.error.js";
import { StatusCodes } from "http-status-codes";

class ResourceNotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default ResourceNotFoundError;
