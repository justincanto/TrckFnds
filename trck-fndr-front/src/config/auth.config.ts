import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/express/providers/google";
import { db } from "../db/schema";

export const authConfig = {
  providers: [Google],
  adapter: DrizzleAdapter(db),
};
