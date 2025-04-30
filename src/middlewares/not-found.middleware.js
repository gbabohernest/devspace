import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message:
      "Sorry, I do not understand your request, Please try again with a correct resource path",
  });
};

export default notFoundMiddleware;
