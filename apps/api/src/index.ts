import express from "express";
import { ExpressAuth } from "@auth/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authConfig } from "./config/auth.config";
import bankRouter from "./bank";
import { authenticatedUser } from "./middlewares/auth.middleware";
import portfolioRouter from "./portfolio";
import "./currency/cron";
import "./portfolio/cron";
import "./bank/cron";
import subscriptionRouter, { subscriptionWebhookRouter } from "./subscription";

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

app.use("/auth/*", ExpressAuth(authConfig));

app.use("/bank", authenticatedUser, bankRouter);
app.use("/portfolio", authenticatedUser, portfolioRouter);
app.use("/subscription", authenticatedUser, subscriptionRouter);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
