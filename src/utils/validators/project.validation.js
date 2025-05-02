import Joi from "joi";

const projectValidationSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().trim(true).messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 50 characters",
  }),

  description: Joi.string()
    .min(5)
    .pattern(/^[A-Za-z0-9\s.,!?-]+$/)
    .required()
    .trim(true)
    .messages({
      "string.min": "Description must be at least 5 characters",
      "string.pattern.base":
        "Please use valid characters for description (letters, numbers, basic punctuation)",
    }),

  tech: Joi.array().items(Joi.string().trim().min(1)).required().messages({
    "array.min": "At least one technology is required",
  }),

  isPublic: Joi.boolean().default(true).optional(),
});

export default projectValidationSchema;
