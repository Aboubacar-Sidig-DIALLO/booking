import { NextAuthOptions, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password-utils";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 jour par défaut (session courte)
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        rememberMe: { label: "Se souvenir de moi", type: "checkbox" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        // Note: rememberMe n'est plus utilisé pour la session, seulement pour le pré-remplissage

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { org: true },
        });

        if (!user || !(user as any).password) return null;

        // Vérifier le mot de passe
        const isValidPassword = await verifyPassword(
          password,
          (user as any).password
        );
        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orgId: user.orgId,
          mustChangePassword: (user as any).mustChangePassword,
          orgSlug: user.org.slug,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.orgId = (user as any).orgId;
        token.mustChangePassword = (user as any).mustChangePassword;
        token.orgSlug = (user as any).orgSlug;
      }

      // Session courte par défaut (1 jour)
      token.maxAge = 24 * 60 * 60; // 1 jour

      return token;
    },
    async session({ session, token }) {
      (session as Session & { user: any }).user = {
        ...(session.user || {}),
        id: token.sub,
        role: (token as any).role,
        orgId: (token as any).orgId,
        mustChangePassword: (token as any).mustChangePassword,
        orgSlug: (token as any).orgSlug,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  pages: {
    signIn: "/login",
    error: "/error",
  },
  debug: process.env.NODE_ENV === "development",
};

// For App Router with next-auth v4, route handlers will create the handler:
// see src/app/api/auth/[...nextauth]/route.ts
export default authOptions;
