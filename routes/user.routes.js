import express from "express";
import {
    register,
    confirm,
    login,
    logout,
    recover,
    checkToken,
    restore,
    auth,
} from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/user.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
    registerSchema,
    confirmSchema,
    loginSchema,
    recoverSchema,
} from "../schemas/user.schema.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), register);
router.get("/confirm/:token", validateSchema(confirmSchema), confirm);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", checkAuth, logout);
router.post("/recover", validateSchema(recoverSchema), recover);
router.post("/check-token", checkToken);
router.post("/restore", restore);
router.get("/auth", checkAuth, auth);

export default router;
