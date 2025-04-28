import {
  CustomApiError,
  BadRequestError,
  AuthError,
} from "../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import transactionHelper from "../utils/helpers/transaction.js";

const registerUser = async (req, res, next) => {
  await transactionHelper(async (session) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        new BadRequestError("Please provide username, email, password"),
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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email }, { email: 1, password: 1 }, null);

  if (!user) {
    throw new AuthError("Invalid Email credential");
  }

  const isPasswordVerified = await user.isPwdVerified(password);

  if (!isPasswordVerified) {
    throw new AuthError("Invalid credential");
  }

  try {
    const token = await user.generateToken();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login success", token });
  } catch (error) {
    new CustomApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export { registerUser, loginUser };
