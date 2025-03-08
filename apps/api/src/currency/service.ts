import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { exchangeRate } from "../db/schema";
import { Currency } from "@trck-fnds/shared";

export const convertCurrency = async (
  amount: number,
  from: Currency,
  to = Currency.USD
) => {
  const exchangeRates = await db
    .select()
    .from(exchangeRate)
    .where(and(eq(exchangeRate.from, from), eq(exchangeRate.to, to)));

  return amount * exchangeRates[0].rate;
};
