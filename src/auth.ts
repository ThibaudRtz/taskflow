import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { env } from "@/env";
import { prisma } from "@/lib/prisma";

export const googleAuthEnabled = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret:
    env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "taskflow-dev-secret" : undefined),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: googleAuthEnabled
    ? [
        Google({
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});
