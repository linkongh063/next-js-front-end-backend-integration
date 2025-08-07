import NextAuth from "next-auth"
import { session } from '@/lib/session'
import GoogleProvider from 'next-auth/providers/google'
const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID!
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const allowedAdmins = ["linkon.softzino@gmail.com"];
            console.log("User ID:", allowedAdmins);
            console.log("User email:", user.email);
            if (allowedAdmins.includes(user.email!)) {
                return true;
            }
            return false; // Block non-admins
        },
        async redirect({ url, baseUrl }) {
            return "/(admin)/dashboard"; // Redirect after login
        }
    },
})