import { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../db";
import { User, users } from "../db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (priceId: string) => {
  const prices = await stripe.prices.list({
    lookup_keys: [priceId],
    expand: ["data.product"],
  });

  return await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.FRONT_URL}/subscription-success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_URL}?canceled=true`,
  });
};

export const createPortalSession = async (user: User) => {
  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = `${process.env.FRONT_URL}/dashboard`;

  return await stripe.billingPortal.sessions.create({
    customer: user.customerId!,
    return_url: returnUrl,
  });
};

export const webhookHandler = async (req: Request, res: Response) => {
  let event = req.body;
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature!,
        endpointSecret
      );
    } catch (err) {
      console.log(
        `⚠️  Webhook signature verification failed.`,
        (err as Error).message
      );
      return res.sendStatus(400);
    }
  }

  let subscription;
  let status;
  // Handle the event
  switch (event.type) {
    case "customer.subscription.deleted":
      subscription = event.data.object;
      status = subscription.status;
      handleSubscriptionDeleted(subscription);
      break;
    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;
      handleSubscriptionCreated(subscription);
      break;
    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;
      handleSubscriptionUpdated(subscription);
      break;
    default:
    // Unexpected event type
  }
  // Return a 200 res to acknowledge receipt of the event
  return res.send();
};

const handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  await db
    .update(users)
    .set({ isSubscribed: true, planId: subscription.items.data[0].price.id })
    .where(eq(users.email, customerEmail));
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  await db
    .update(users)
    .set({ isSubscribed: false, planId: null })
    .where(eq(users.email, customerEmail));
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  await db
    .update(users)
    .set({ planId: subscription.items.data[0].price.id })
    .where(eq(users.email, customerEmail));
};

const getCustomerEmail = async (customerId: string) => {
  const customer = (await stripe.customers.retrieve(
    customerId
  )) as Stripe.Customer;

  if (!customer.email) {
    throw new Error("No user found");
  }

  return customer.email;
};
