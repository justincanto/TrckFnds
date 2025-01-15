import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { accounts, sessions, users } from "./db/schema";

const useSecureCookies = process.env.NEXTAUTH_URL!.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(process.env.NEXTAUTH_URL!).hostname;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      profile: (profile) => {
        return {
          ...profile,
          isSubscribed: false,
          hasConnections: false,
        };
      },
    }),
  ],
  // @ts-expect-error - error in authjs drizzle-adapter
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: {
    strategy: "database",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "." + hostName,
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    authorized: async ({ request, auth }) => {
      return (
        auth?.user.isSubscribed ||
        (!request.url.includes("dashboard") &&
          !request.url.includes("subscription-success"))
      );
    },
    session: async ({ session, user }) => {
      session.user.isSubscribed = user.isSubscribed;
      session.user.hasConnections = user.hasConnections;
      session.user.id = user.id!;
      return session;
    },
  },
});
