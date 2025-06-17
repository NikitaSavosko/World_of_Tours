import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/validations"
import { GetUserByEmail, GetUserById } from "./data/user"
import bcrypt from "bcrypt"

export type ExtendedUser = DefaultSession["user"] & {
    id: string
    role: "ADMIN" | "USER"
}

// Расширяем типы
declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id?: string
        role?: "ADMIN" | "USER"
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = signInSchema.safeParse(credentials)
                if (!validatedFields.success) {
                    console.log("❌ Невалидные поля:", credentials)
                    return null
                }

                const { email, password } = validatedFields.data
                const user = await GetUserByEmail(email)

                if (!user || !user.password) return null

                const passwordsMatch = await bcrypt.compare(password, user.password)
                if (!passwordsMatch) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            // Первый раз: после signIn
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }

            // Каждую последующую сессию — гарантируем наличие актуального user
            if (!token.id) return token

            const dbUser = await GetUserById(token.id)
            if (dbUser) {
                token.role = dbUser.role
            }

            return token
        },

        async session({ token, session }) {
            if (session.user && token.id) {
                session.user.id = token.id
            }

            if (session.user && token.role) {
                session.user.role = token.role
            }

            return session
        },
    },
})
