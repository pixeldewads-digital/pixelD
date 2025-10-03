import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
  callbacks: {
    async session({ session, user }) {
      (session.user as any).role = user.role;
      return session;
    },
    async signIn({ user }) {
      const admins = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map(s => s.trim());

      if (user?.email && admins.includes(user.email)) {
        await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" }});
      }
      return true;
    }
  }
});