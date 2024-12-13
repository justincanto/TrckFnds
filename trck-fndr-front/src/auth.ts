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
      profile: (profile) => {
        return {
          ...profile,
          isSubscribed: false,
          hasConnections: false,
        };
      },
    }),
  ],
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
      // @ts-expect-error needed for drizzle adapter wrong typing
      return auth?.user?.isSubscribed || !request.url.includes("dashboard");
    },
    session: async ({ session, token, user }) => {
      // @ts-ignore
      session.user.isSubscribed = user.isSubscribed;
      // @ts-ignore
      session.user.hasConnections = user.hasConnections;
      session.user.id = user.id!;
      return session;
    },
  },
});
