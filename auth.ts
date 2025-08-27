import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email ? String(creds.email) : "";
        const password = creds?.password ? String(creds.password) : "";
        console.log('email',email);
        console.log('password',password);
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        console.log('user ***ççç',user);
        if (!user) return null;
        // Plain password check per request
        if (user.role !== "ADMIN") return null;
        if (user.password !== password) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token as any;
    },
    async session({ session, token }) {
      (session as any).user.id = (token as any).id;
      (session as any).user.role = (token as any).role;
      return session;
    },
    async redirect() {
      return "/(admin)/dashboard";
    },
  },
});