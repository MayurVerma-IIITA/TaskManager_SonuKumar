import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createTaskValidator, updateTaskValidator } from "../validators/taskValidators.js";
import { validateRequest } from "../validators/validateRequest.js";

const router = Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTaskValidator, validateRequest, createTask);
router.put("/:id", updateTaskValidator, validateRequest, updateTask);
router.delete("/:id", deleteTask);

export default router;
