import { body } from "express-validator";

const stages = ["TODO", "IN_PROGRESS", "DONE"];

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 140 })
    .withMessage("Title must be 140 characters or fewer"),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be 1000 characters or fewer"),
  body("stage")
    .optional()
    .isIn(stages)
    .withMessage("Stage must be TODO, IN_PROGRESS, or DONE")
];

export const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 140 })
    .withMessage("Title must be 140 characters or fewer"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be 1000 characters or fewer"),
  body("stage")
    .optional()
    .isIn(stages)
    .withMessage("Stage must be TODO, IN_PROGRESS, or DONE")
];
