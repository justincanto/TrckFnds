import { createRouter } from "../../utils/create-router";
import { User } from "../db/schema";
import {
  createCheckoutSession,
  createPortalSession,
  webhookHandler,
} from "./service";
const express = require("express");

const subscriptionRouter = createRouter();
const subscriptionWebhookRouter = createRouter();

subscriptionRouter.post("/create-checkout-session", async (req, res) => {
  const session = await createCheckoutSession(req.body.priceId);
  res.send({ sessionUrl: session.url! });
});

subscriptionRouter.get("/create-portal-session", async (req, res) => {
  const user = res.locals.session.user as User;

  const portalSession = await createPortalSession(user);
  res.send({ sessionUrl: portalSession.url! });
});

subscriptionWebhookRouter.post(
  "/subscription/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    await webhookHandler(req, res);
  }
);

export { subscriptionWebhookRouter };

export default subscriptionRouter;
