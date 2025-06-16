"use server"

import { signUpSchema } from "@/lib/validations"
import { z } from "zod"
import bcrypt from "bcrypt"
import { GetUserByEmail } from "../../data/user"
import { prisma } from "../../prisma/prisma"
import { signIn } from "../../auth"


export const register = async (values: z.infer<typeof signUpSchema>) => {
    const validatedFields = signUpSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Введены не правильные данные" }
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = GetUserByEmail(email)

    if (await existingUser) {
        return { error: "Такой пользователь уже есть" }
    } else {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        })
    }


    return { success: "Пользователь создан" }
}