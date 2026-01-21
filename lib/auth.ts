import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./db";

export const STATIC_ADMIN_EMAIL = "admin@admin.com";

export function isStaticAdmin(email?: string | null) {
  if (!email) return false;
  const enabled = process.env.ENABLE_STATIC_ADMIN?.toLowerCase() !== "false";
  return enabled && email.toLowerCase() === STATIC_ADMIN_EMAIL;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (isStaticAdmin(credentials.email)) {
          if (credentials.password !== "admin123") {
            return null;
          }
          return {
            id: "static-admin",
            email: STATIC_ADMIN_EMAIL,
            name: "Admin de Teste"
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });

        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
    };
  }
}
