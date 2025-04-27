import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minLength: [3, "Title must be atl least 3 characters"],
      maxLength: [50, "Title cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [5, "Description must be at least 5 characters"],
      match: [
        /^[A-Za-z0-9\s.,!?-]+$/,
        "Use valid characters (letters, numbers, basic punctuation)",
      ],
    },

    technologies: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: [
        {
          validator: (arr) => arr.length > 0,
          msg: "At least on technology required",
        },
        {
          validator: (arr) =>
            arr.every((tech) => typeof tech === "string" && tech.trim() !== ""),
          msg: "Invalid technology entry",
        },
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
