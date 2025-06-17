import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/validations"
import { GetUserByEmail, GetUserById } from "./data/user"
import bcrypt from "bcrypt"

export type ExtendedUser = DefaultSession["user"] & {
    role: "ADMIN" | "USER"
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role?: "ADMIN" | "USER"
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = signInSchema.safeParse(credentials)

                if (!validatedFields.success) {
                    console.log("❌ Невалидные поля:", credentials)
                    return null
                }

                const { email, password } = validatedFields.data
                const user = await GetUserByEmail(email)

                if (!user) {
                    console.log("❌ Пользователь не найден:", email)
                    return null
                }

                if (!user.password) {
                    console.log("❌ У пользователя нет пароля:", email)
                    return null
                }

                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (!passwordsMatch) {
                    console.log("❌ Пароль не совпадает:", email)
                    return null
                }

                console.log("✅ Пользователь авторизован:", email)

                // Возвращаем только нужные поля
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }

        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token }) {
            try {
                console.log("JWT CALLBACK - token.sub", token.sub)

                if (!token.sub) return token

                const existingUser = await GetUserById(token.sub)
                if (!existingUser) return token

                token.role = existingUser.role
                return token
            } catch (error) {
                console.error("JWT callback error:", error)
                return token
            }
        },

        async session({ token, session }) {
            try {
                if (token.sub && session.user) {
                    session.user.id = token.sub
                }

                if (token.role && session.user) {
                    session.user.role = token.role
                }

                return session
            } catch (error) {
                console.error("Session callback error:", error)
                return session
            }
        }
    }
})
