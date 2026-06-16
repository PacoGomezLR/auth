import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"

const options = {
    providers: [Google, GitHub],
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token?.sub;     // Para recuperar ID de usuario desde el token
            session.user.role = token?.role   // Para recuperar Rol de usuario desde el token
            return session
        },

        async jwt({ token }) {  
            if (!token.sub) return token;
            
            const user = await prisma.user.findUnique({
                where: {
                    id: token.sub
                }
            })
            if (!user) return token;

            token.role = user?.role
            return token
        }
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth(options)
