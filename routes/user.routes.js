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
    loginSchema,
    recoverSchema,
    tokenSchema,
} from "../schemas/user.schema.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), register);
router.get("/confirm/:token", validateSchema(tokenSchema), confirm);
router.post("/login", validateSchema(loginSchema), login);
router.get("/logout", checkAuth, logout);
router.post("/recover", validateSchema(recoverSchema), recover);
router.get("/check-token/:token", validateSchema(tokenSchema), checkToken);
router.post("/restore", restore);
router.get("/auth", checkAuth, auth);

export default router;
