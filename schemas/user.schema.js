import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(2, {
            message: "Name must be at least 2 characters",
        }),
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

export const tokenSchema = z.object({
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

export const restoreSchema = z.object({
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6, {
            message: "Password must be at least 6 characters",
        }),
    token: z
        .string({
            required_error: "Token is required",
        })
        .min(128, {
            message: "Token is not valid",
        }),
});
