import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/express/providers/google";
import { db } from "../db";
import { ExpressAuthConfig } from "@auth/express";

const useSecureCookies = process.env.NEXTAUTH_URL!.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(process.env.NEXTAUTH_URL!).hostname;

export const authConfig: ExpressAuthConfig = {
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
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub!;
      return session;
    },
  },
};
