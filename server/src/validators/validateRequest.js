import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = {};

  for (const error of result.array()) {
    if (!errors[error.path]) {
      errors[error.path] = error.msg;
    }
  }

  return res.status(422).json({
    message: "Validation failed",
    errors
  });
};
