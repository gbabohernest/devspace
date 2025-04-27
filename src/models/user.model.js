import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [2, "Username should be at least three(3) characters "],
      maxLength: [30, "Username cannot be more than fifty(50) characters"],
      match: [
        /^[A-Za-z][A-Za-z0-9_]{2,29}$/,
        "Username must start with a letter, not a number",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "At least six (6) character for password"],
      maxLength: [1024, "Password too long"],
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
