import { SessionData, Store } from "express-session";
import { eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { sessions } from "./schema";
import * as schema from "./schema";

// Create a custom session store that extends the Express session Store
export class DrizzleSessionStore extends Store {
  private db: NeonHttpDatabase<typeof schema>;
  private tableName: string;

  constructor(options: {
    db: NeonHttpDatabase<typeof schema>;
    tableName?: string;
  }) {
    super();
    this.db = options.db;
    this.tableName = options.tableName || "sessions";
  }

  // Get a session by its ID
  get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ): void {
    this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sid))
      .then((res) => {
        if (res.length === 0 || !res[0]) {
          return callback(null, null);
        }

        const session = res[0];

        if (new Date(session.expiresAt) < new Date()) {
          return this.destroy(sid, (err) => callback(err, null));
        }

        let sessionData: SessionData;
        try {
          sessionData = JSON.parse(session.data);
          callback(null, sessionData);
        } catch (err) {
          callback(err);
        }
      })
      .catch((err) => callback(err));
  }

  // Set or update a session
  set(sid: string, session: SessionData, callback?: (err?: any) => void): void {
    try {
      const expiresAt = session.cookie.expires || this.getExpiryDate(session);
      const data = JSON.stringify(session);

      this.db
        .insert(sessions)
        .values({
          id: sid,
          data,
          expiresAt,
        })
        .onConflictDoUpdate({
          target: sessions.id,
          set: {
            data,
            expiresAt,
          },
        })
        .then(() => callback && callback())
        .catch((err) => callback && callback(err));
    } catch (err) {
      callback && callback(err);
    }
  }

  // Destroy/delete a session
  destroy(sid: string, callback?: (err?: any) => void): void {
    this.db
      .delete(sessions)
      .where(eq(sessions.id, sid))
      .then(() => callback && callback())
      .catch((err) => callback && callback(err));
  }

  // Touch/extend a session's expiry
  touch(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): void {
    try {
      const expiresAt = session.cookie.expires || this.getExpiryDate(session);

      this.db
        .update(sessions)
        .set({ expiresAt })
        .where(eq(sessions.id, sid))
        .then(() => callback && callback())
        .catch((err) => callback && callback(err));
    } catch (err) {
      callback && callback(err);
    }
  }

  // Calculate expiry date based on maxAge
  private getExpiryDate(session: SessionData): Date {
    const maxAge = session.cookie.maxAge || 86400000; // Default to 1 day
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + maxAge);
    return expiryDate;
  }

  // Optional: Add a cleanup function to periodically remove expired sessions
  cleanup(): Promise<void> {
    return this.db
      .delete(sessions)
      .where(eq(sessions.expiresAt, new Date()))
      .then();
  }
}
