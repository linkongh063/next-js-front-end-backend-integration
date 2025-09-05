import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import prisma from "./lib/prisma"
// import { compare } from "bcryptjs" // make sure you installed bcryptjs

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log('credentials', credentials)
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password")
        }
        console.log('credentials', credentials)
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // })
        const user = {email: 'm.alinkon10@gmail.com', password: 'password', name: 'Md Abdul Ahad Linkon', role: 'CUSTOMER', id: '6ec07df2-8438-4793-9bab-274037b3711d'}
        console.log('user', user)

        if (!user) {
          throw new Error("Invalid email or password 000")
        }

        // check password hash
        if (user.password === credentials.password) {
          console.log('password match')
        }else{
          console.log('password not match')
        }
        // const valid = await compare(credentials.password, user.password)
        const valid = user.password === credentials.password ? true : false
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
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
