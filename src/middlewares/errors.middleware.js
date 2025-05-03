import { StatusCodes, getReasonPhrase } from "http-status-codes";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT } = StatusCodes;

const errorMiddleware = (err, req, res, next) => {
  let message = err.message || getReasonPhrase(INTERNAL_SERVER_ERROR);
  let statusCode = err.statusCode || INTERNAL_SERVER_ERROR;

  if (err.code === 11000) {
    message = "Duplicate Key Error Collection [ value(s) already exists ]";
    statusCode = CONFLICT;
  }

  if (err?.name === "CastError") {
    statusCode = BAD_REQUEST;
    message = "Please enter a valid resource id";
  }

  if (err?.name === "ValidationError") {
    if (err?.errors) {
      const msg = Object.values(err.errors).map(
        (val) => val?.properties?.path + " " + ":" + " " + val?.message,
      );
      message = msg.join(", ");
      statusCode = BAD_REQUEST;
    }
  }
  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
