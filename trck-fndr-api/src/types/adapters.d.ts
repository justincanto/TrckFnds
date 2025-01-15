import { InferSelectModel } from "drizzle-orm";
import { users } from "../db/schema";

declare module "@auth/express/adapters" {
  interface AdapterUser extends InferSelectModel<typeof users> {
    isSubscribed: boolean;
    hasConnections: boolean;
    customerId: string | null;
    planId: string | null;
  }
}
