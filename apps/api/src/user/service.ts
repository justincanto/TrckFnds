import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const setUserHasConnections = async (
  userId: string,
  hasConnections: boolean
) => {
  return await db
    .update(users)
    .set({ hasConnections })
    .where(eq(users.id, userId));
};
