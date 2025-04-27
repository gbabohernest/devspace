import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters "],
      maxLength: [30, "Username cannot exceeds 30 characters"],
      match: [
        /^[A-Za-z][A-Za-z0-9_]{2,29}$/,
        "Username must start with a letter and only contain letters, numbers, and underscores",
      ],
      index: true,
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
      select: false,
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

const User = mongoose.model("User", userSchema);

export default User;
