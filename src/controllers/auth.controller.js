import CustomApiError from "../utils/errors/custom-api.error.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import transactionHelper from "../utils/helpers/transaction.js";

const registerUser = async (req, res, next) => {
  await transactionHelper(async (session) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        new CustomApiError(
          "Please provide username, email, password",
          StatusCodes.BAD_REQUEST,
        ),
      );
    }

    //!TODO validate inputs using a validation library

    const existingUser = await User.findOne({ email }, { email: 1 }, null);
    if (existingUser) {
      return next(
        new CustomApiError(
          "Try again with another email.",
          StatusCodes.CONFLICT,
        ),
      );
    }

    const user = await User.create([{ username, email, password }], {
      session,
    });

    const userData = user[0].toObject();
    delete userData.password;

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      user: userData,
    });
  }, next);
};

const loginUser = async (req, res) => {
  res.status(200).json({ success: true, message: "testing login..." });
};
export { registerUser, loginUser };
