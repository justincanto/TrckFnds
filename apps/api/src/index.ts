import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bankRouter from "./bank";
import { authenticatedUser } from "./middlewares/auth.middleware";
import portfolioRouter from "./portfolio";
import "./currency/cron";
import "./portfolio/cron";
import "./bank/cron";
import subscriptionRouter, { subscriptionWebhookRouter } from "./subscription";
import passport from "passport";
import session from "express-session";
import authRouter from "./auth";
import { DrizzleSessionStore } from "./db/sessionStore";
import { db } from "./db";
import { userRouter } from "./user";

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.set("trust proxy", true);

app.use("/", subscriptionWebhookRouter);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    store: new DrizzleSessionStore({ db }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.use("/bank", authenticatedUser, bankRouter);
app.use("/portfolio", authenticatedUser, portfolioRouter);
app.use("/subscription", authenticatedUser, subscriptionRouter);
app.use("/user", authenticatedUser, userRouter);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
