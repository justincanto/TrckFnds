import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/express/providers/google";
import { db } from "../db";
import { ExpressAuthConfig } from "@auth/express";

export const authConfig: ExpressAuthConfig = {
  providers: [Google],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
};
