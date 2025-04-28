import Joi from "joi";

const userValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z][A-Za-z0-9_]{2,29}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Joi - Username must start with a letter and only contain letters, numbers, and underscores, no space(s)",
      "string.min": "Joi - Username must be at least 3 characters",
      "string.max": "Joi - Username cannot exceed 30 characters",
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .trim(true)
    .required()
    .messages({
      "string.email":
        "Joi - Please provide a valid email address that ends with .com or .net",
    }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.min": "Joi - Password must be at least 8 characters",
    "string.max": "Joi - Password cannot exceed 128 characters",
  }),
});

const authenticateUserValidator = Joi.object({
  email: Joi.string().trim(true).required(),
  password: Joi.string().required(),
});

export { userValidationSchema, authenticateUserValidator };
