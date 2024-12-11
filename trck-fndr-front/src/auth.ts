import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";

const useSecureCookies = process.env.NEXTAUTH_URL!.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(process.env.NEXTAUTH_URL!).hostname;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
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
      return !!auth || !request.url.includes("dashboard");
    },
    session: async ({ session, token }) => {
      session.user.id = token.sub!;
      return session;
    },
  },
});
