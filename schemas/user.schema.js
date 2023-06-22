import { z } from "zod";
import { recover } from "../controllers/user.controller";

export const registerSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Email is not valid",
        })
        .min(6, {
            message: "Email is required",
        }),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, {
            message: "Password must be at least 6 characters",
        }),
});

export const confirmSchema = z.object({
    token: z
        .string({
            required_error: "Token is required",
        })
        .min(128, {
            message: "Token is not valid",
        }),
});

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Email is not valid",
        })
        .min(6, {
            message: "Email is required",
        }),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, {
            message: "Password must be at least 6 characters",
        }),
});

export const recoverSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Email is not valid",
        })
        .min(6, {
            message: "Email is required",
        }),
});
