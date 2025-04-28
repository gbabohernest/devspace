import {
  CustomApiError,
  BadRequestError,
  AuthError,
} from "../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import transactionHelper from "../utils/helpers/transaction.js";
import {
  authenticateUserValidator,
  userValidationSchema,
} from "../utils/validators/user.validation.js";

const registerUser = async (req, res, next) => {
  await transactionHelper(async (session) => {
    let { username, email, password } = req.body;

    const { error, value } = userValidationSchema.validate({
      username,
      email,
      password,
    });

    if (error) {
      return next(new BadRequestError(error?.details[0]?.message));
    }

    username = value.username;
    email = value.email;
    password = value.password;

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

  const { error, value } = authenticateUserValidator.validate({
    email,
    password,
  });

  if (error) {
    throw new BadRequestError(error?.details[0]?.message);
  }
  const user = await User.findOne(
    { email: value.email },
    { email: 1, password: 1 },
    null,
  );

  if (!user) {
    throw new AuthError("Invalid Email credential");
  }

  const isPasswordVerified = await user.isPwdVerified(value.password);

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
