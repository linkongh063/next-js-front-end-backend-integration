import { authConfig } from './lib/auth/config';
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from './lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Normalize and validate incoming credentials
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })
        // console.log('user', user)
        
        if (!user) {
          throw new Error("Invalid email or password 000")
        }

        // check password hash
        if (user.password === password) {
          console.log('password match')
        } else {
          console.log('password not match')
        }
        // const valid = await compare(password, user.password)
        const valid = user.password === password ? true : false
        console.log('valid', valid)
        if (!valid) {
          throw new Error("Invalid email or password 111")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = (token as any).id as string;
        (session.user as any).role = (token as any).role as string;
      }
      return session
    },
  },
})
