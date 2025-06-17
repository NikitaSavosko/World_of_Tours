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
    providers: [Credentials({
        async authorize(credentials) {
            const validatedFields = signInSchema.safeParse(credentials)

            if (validatedFields.success) {
                const { email, password } = validatedFields.data

                const user = await GetUserByEmail(email)
                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (passwordsMatch) return user;
            }

            return null
        }
    })],
    session: { strategy: "jwt" },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session
        },
        async jwt({ token }) {
            console.log("JWT CALLBACK - token.sub", token.sub)
            if (!token.sub) return token;

            const existingUser = await GetUserById(token.sub)

            if (!existingUser) return token;

            token.role = existingUser.role;

            return token
        }
    }
})