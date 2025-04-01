import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      callbackURL: `${process.env.API_BASE_URL}/auth/callback/google`,
      proxy: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      if (!profile.emails?.[0]) {
        return;
      }

      const user = await db.query.users.findFirst({
        where: eq(users.email, profile.emails[0].value),
      });

      if (user) {
        return cb(null, user);
      }

      const [newUser] = await db
        .insert(users)
        .values({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          hasConnections: false,
          image: profile.photos?.[0].value,
        })
        .returning();

      return cb(null, newUser);
    }
  )
);

/* How to store the user information in the session */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(async function (id: string, done) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
