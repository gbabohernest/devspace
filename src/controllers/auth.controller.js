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
import formatDate from "../utils/helpers/dateFormatter.js";

const registerUser = async (req, res, next) => {
  await transactionHelper(async (session) => {
    let { username, email, password, bio } = req.body;

    const { error, value } = userValidationSchema.validate({
      username,
      email,
      password,
      bio,
    });

    if (error) {
      return next(new BadRequestError(error?.details[0]?.message));
    }

    username = value.username;
    email = value.email;
    password = value.password;
    bio = value.bio;

    const existingUser = await User.findOne(
      { $or: [{ email }, { username }] },
      { email: 1, username: 1 },
      null,
    );
    if (existingUser) {
      return next(
        new CustomApiError(
          "Try again with another email or username.",
          StatusCodes.CONFLICT,
        ),
      );
    }

    let user = await User.create([{ username, email, password, bio }], {
      session,
    });

    user = user[0].toObject();

    const userData = {
      Username: user.username,
      Bio: user.bio,
      Email: user.email,
      Avatar: user.avatarURL,
      Password: user.password, //shows we are hashing the password
      "Joined Date": formatDate(user.createdAt),
    };

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
    { email: 1, password: 1, username: 1, role: 1 },
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
    const userData = user.toObject();
    delete userData.password;
    delete userData._id;

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login success", token });
  } catch (error) {
    throw new CustomApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export { registerUser, loginUser };
