import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3, {
        message: "Имя должно содержать минимум 3 символа"
    }),
    email: z.string().email({ message: "Не правильный email" }),
    password: z.string().min(6, {
        message: "Пароль должен содержать минимум 6 символов"
    }),
});

export const signInSchema = z.object({
    email: z.string().email({ message: "Не правильный email" }),
    password: z.string().min(1, {
        message: "Требуется пароль"
    }),
});