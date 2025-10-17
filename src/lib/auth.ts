import { NextAuthOptions, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Demo",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        const email = credentials?.email;
        if (!email) return null;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: email.split("@")[0],
            role: "VIEWER",
            orgId: "org-demo",
          },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orgId: user.orgId,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.orgId = (user as any).orgId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as Session & { user: any }).user = {
        ...(session.user || {}),
        id: token.sub,
        role: (token as any).role,
        orgId: (token as any).orgId,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// For App Router with next-auth v4, route handlers will create the handler:
// see src/app/api/auth/[...nextauth]/route.ts
export default authOptions;
