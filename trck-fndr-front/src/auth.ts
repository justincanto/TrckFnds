import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
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
  },
});
