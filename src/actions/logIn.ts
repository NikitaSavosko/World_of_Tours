"use server"

import { signInSchema } from "@/lib/validations"
import { z } from "zod"
import { signIn } from "../../auth"
import { AuthError } from "next-auth"


export const login = async (values: z.infer<typeof signInSchema>) => {
    const validatedFields = signInSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Не правильные email или пароль" }
    }

    const { email, password } = validatedFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        })

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Не правильные email или пароль" }
                default:
                    return { error: "Что-то пошло не так" }
            }
        }

        throw error;
    }
}