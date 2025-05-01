import mongoose from "mongoose";
import { CustomApiError } from "../utils/index.utils.js";
import { StatusCodes } from "http-status-codes";
import formatDate from "../utils/helpers/dateFormatter.js";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [50, "Title cannot exceed 50 characters"],
      index: true,
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

    tech: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Tech stack is required"],
      validate: [
        {
          validator: function (value) {
            return Array.isArray(value);
          },
          message: "Tech stack must be an array of strings",
        },

        {
          validator: function (value) {
            return value.length > 0;
          },
          message: "Tech stack must contain at least one technology",
        },
        {
          validator: function (value) {
            return value.every(
              (item) => typeof item === "string" && item.trim() !== "",
            );
          },
          message: "Each technology must be a non-empty string",
        },
      ],
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
      index: true,
    },
  },
  { timestamps: true },
);

// these fields must always be unique: a user cannot create multiple projects with the same title.
projectSchema.index({ title: 1, createdBy: 1 }, { unique: true });

/**
 * A virtual field | Will be added to the Json response but won't be saved to DB
 */
projectSchema.virtual("creator", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
  options: { select: "-createdAt -updatedAt", lean: true },
});

/**
 * Ensure that when the response is sent back, it includes the virtauls field(s).
 * transform: Before you send back the document make some changes ( happen during  doc serialization (JSON))
 */
projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false, //remove _v
  transform: (doc, ret) => {
    ret.createdAt = formatDate(ret.createdAt);
    ret.updatedAt = formatDate(ret.updatedAt);
    delete ret.id;
    delete ret.createdBy;
    // delete ret._id;
    return ret;
  },
});

/**
 * Restrict Project duplications by a user.
 * A user cannot create a project with the same title.
 */
projectSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existingProject = await mongoose.models.Project.findOne(
      {
        title: this.title,
        createdBy: this.createdBy,
      },
      { title: 1, createdBy: 1 },
      null,
    );

    if (existingProject) {
      return next(
        new CustomApiError(
          "Project name already exists in your account, Try another name",
          StatusCodes.CONFLICT,
        ),
      );
    }
  }

  next();
});

projectSchema.pre("save", function (next) {
  this.tech = this.tech.map((value) => value.trim().toLowerCase());
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
