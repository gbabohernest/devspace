import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../../config/env.js";
import formatDate from "../utils/helpers/dateFormatter.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters "],
      maxLength: [30, "Username cannot exceeds 30 characters"],
      match: [
        /^[A-Za-z][A-Za-z0-9_]{2,29}$/,
        "Username must start with a letter and only contain letters, numbers, and underscores, no space(s)",
      ],
      index: true,
    },

    bio: {
      type: String,
      trim: true,
      maxLength: [100, "Bio cannot exceeds 100 characters"],
      default:
        "I am a user who hasn't updated my bio yet but loves using the Devspace API.",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: "Please enter a valid email address",
      },
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Must be at least 8 characters"],
      maxLength: [128, "Password cannot exceed 128 character"],
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Format the createdAt & updatedAt properties to  a readable format in API response.
 */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.createdAt = formatDate(ret.createdAt);
    ret.updatedAt = formatDate(ret.updatedAt);
    // delete ret._id;
    delete ret.__v;
    return ret;
  },
});
userSchema.methods.isPwdVerified = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role },
    JWT_SECRET_KEY,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

userSchema.methods.getTotalProjects = async function (userId) {
  const projects = await mongoose.models.Project.find(
    { createdBy: userId },
    "createdBy",
    null,
  );
  return projects.length;
};
const User = mongoose.model("User", userSchema);

export default User;
