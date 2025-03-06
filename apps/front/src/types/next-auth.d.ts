import { DefaultSession } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      isSubscribed: boolean;
      hasConnections: boolean;
      customerId?: string;
      planId?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

declare module "@auth/drizzle-adapter" {
  interface AdapterUser {
    id: string;
    email: string;
    emailVerified: Date | null;
    image: string;
    osuUserId: number;
    isAdmin: boolean;
    isAlphaTester: boolean;
    isBetaTester: boolean;
    isNew: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    lastLogin: Date | null;
  }
}
