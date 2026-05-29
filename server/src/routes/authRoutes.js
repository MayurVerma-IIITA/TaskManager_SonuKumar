import { Router } from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";
import { validateRequest } from "../validators/validateRequest.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getMe);

export default router;
