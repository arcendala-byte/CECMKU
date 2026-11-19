import type { NextAuthConfig } from "next-auth";
import type { Role, AccountStatus } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isVoterRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/voting");

      if (isAdminRoute) {
        if (!isLoggedIn) return false;

        const role = auth?.user?.role as Role | undefined;

        if (role !== "SUPER_ADMIN" && role !== "ELECTION_ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }

        return true;
      }

      if (isVoterRoute) {
        return isLoggedIn;
      }

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
        token.accountStatus = user.accountStatus as AccountStatus;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.accountStatus = token.accountStatus as AccountStatus;
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
