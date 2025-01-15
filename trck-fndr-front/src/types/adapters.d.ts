import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

declare module "@auth/core/adapters" {
  interface AdapterUser extends InferSelectModel<typeof users> {
    isSubscribed: boolean;
    hasConnections: boolean;
    customerId: string | null;
    planId: string | null;
  }
}
