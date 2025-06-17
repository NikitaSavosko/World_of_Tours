'use server'
import { prisma } from "../prisma/prisma";


export const GetUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        return user;
    } catch {
        return null;
    }
}

export const GetUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })

        return user;
    } catch {
        return null;
    }
}