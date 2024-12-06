import axios from "axios";
import { CronJob } from "cron";
import { db } from "../db";
import { exchangeRate } from "../db/schema";
import { and, eq } from "drizzle-orm";

const refreshExchangeRate = async () => {
  const freshRates = await axios.get(
    `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API_KEY}&currencies=USD&base_currency=EUR`
  );

  await db
    .update(exchangeRate)
    .set({ rate: freshRates.data.data.USD })
    .where(and(eq(exchangeRate.to, "USD"), eq(exchangeRate.from, "EUR")));
};

const job = new CronJob(
  "0 * * * *",
  refreshExchangeRate,
  null,
  true,
  "Europe/Paris"
);
