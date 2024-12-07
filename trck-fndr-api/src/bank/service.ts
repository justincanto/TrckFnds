import axios from "axios";
import { db } from "../db";
import { bankConnection } from "../db/schema";
import { eq } from "drizzle-orm";
import { PowensBankAccounts, PowensTransaction } from "./types";
import { convertCurrency } from "../currency/service";
import { Currency } from "../types/currency";
import dayjs from "dayjs";

export const getConnectionUrl = async (userId: string) => {
  //find the user's access token if it exists or create and store it
  const userBankConnection = await db
    .select()
    .from(bankConnection)
    .where(eq(bankConnection.userId, userId));

  const accessToken =
    userBankConnection[0]?.accessToken ||
    (await createAndStoreUserAccessToken(userId));

  //then get the temporary code
  const {
    data: { code },
  } = await axios.get(`${process.env.POWENS_BASE_URL}/auth/token/code`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  //and return the webview url
  return `https://webview.powens.com/connect?domain=trckfnds-sandbox.biapi.pro&client_id=${process.env.POWENS_CLIENT_ID}&redirect_uri=http://localhost:3000/bank-connection/success&code=${code}`;
};

export const getAccounts = async (userId: string) => {
  const userBankConnection = await db
    .select()
    .from(bankConnection)
    .where(eq(bankConnection.userId, userId));

  const accounts = await axios.get(
    `${process.env.POWENS_BASE_URL}/users/me/accounts`,
    {
      headers: {
        Authorization: `Bearer ${userBankConnection[0].accessToken}`,
      },
    }
  );

  return accounts.data;
};

export const getBankAccountsOverview = async (userId: string) => {
  const userBankConnection = await db
    .select()
    .from(bankConnection)
    .where(eq(bankConnection.userId, userId));

  if (userBankConnection.length === 0) {
    return { balance: 0 };
  }

  const accounts = (await axios.get(
    `${process.env.POWENS_BASE_URL}/users/me/accounts`,
    {
      headers: {
        Authorization: `Bearer ${userBankConnection[0].accessToken}`,
      },
    }
  )) as { data: PowensBankAccounts };

  const balance = await Object.keys(accounts.data.balances).reduce(
    async (acc, key) => {
      if (key === Currency.USD) {
        return (await acc) + accounts.data.balances[key]!;
      }

      return (
        (await acc) +
        (await convertCurrency(
          accounts.data.balances[key as Currency]!,
          key as Currency
        ))
      );
    },
    Promise.resolve(0)
  );

  return { balance };
};

const createAndStoreUserAccessToken = async (userId: string) => {
  const {
    data: { auth_token },
  } = await axios.post(`${process.env.POWENS_BASE_URL}/auth/init`, {
    client_id: process.env.POWENS_CLIENT_ID,
    client_secret: process.env.POWENS_CLIENT_SECRET,
  });

  await db.insert(bankConnection).values({ accessToken: auth_token, userId });

  return auth_token;
};

export const getUserRevenuesAndExpensesByMonthWithEvolution = async (
  userId: string
) => {
  const currentMonthData = await getUserRevenuesAndExpensesByMonth(
    userId,
    new Date()
  );
  const previousMonthData = await getUserRevenuesAndExpensesByMonth(
    userId,
    dayjs().subtract(1, "month").toDate()
  );
  return {
    expenses: {
      current: currentMonthData.expenses,
      evolution: currentMonthData.expenses - previousMonthData.expenses,
      isFavorable: currentMonthData.expenses < previousMonthData.expenses,
    },
    revenues: {
      current: currentMonthData.revenues,
      evolution: currentMonthData.revenues - previousMonthData.revenues,
      isFavorable: currentMonthData.revenues > previousMonthData.revenues,
    },
    savingRate: {
      current: currentMonthData.revenues / currentMonthData.expenses,
      evolution:
        (currentMonthData.revenues - previousMonthData.revenues) /
        (currentMonthData.expenses - previousMonthData.expenses),
      isFavorable:
        currentMonthData.revenues / currentMonthData.expenses >
        previousMonthData.revenues / previousMonthData.expenses,
    },
  };
};

const getUserRevenuesAndExpensesByMonth = async (
  userId: string,
  date: Date
) => {
  const userTransations = await getUserTransactionsOfTheMonth(userId, date);
  return extractRevenuesAndExpensesFromTransactions(
    userTransations.transactions
  );
};

const getUserTransactionsOfTheMonth = async (userId: string, date: Date) => {
  const { accessToken } =
    (
      await db
        .select()
        .from(bankConnection)
        .where(eq(bankConnection.userId, userId))
    )?.[0] ?? {};

  const powensTransactions = await axios.get(
    `${
      process.env.POWENS_BASE_URL
    }/users/me/transactions?limit=1000&min_date=${dayjs(date)
      .startOf("month")
      .format("YYYY-MM-DD")}&max_date=${dayjs(date)
      .endOf("month")
      .format("YYYY-MM-DD")}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return powensTransactions.data as {
    total: number;
    transactions: PowensTransaction[];
  };
};

const extractRevenuesAndExpensesFromTransactions = (
  transactions: PowensTransaction[]
) => {
  const revenuesAndExpenses = transactions.reduce(
    (acc, transaction) => {
      const transactionToIgnore = transactions.find(
        (t) =>
          t.value === -transaction.value &&
          t.id !== transaction.id &&
          t.wording === transaction.wording
      );

      if (transactionToIgnore) {
        return acc;
      }

      if (transaction.value > 0) {
        return { ...acc, revenues: acc.revenues + transaction.value };
      }
      return { ...acc, expenses: acc.expenses + transaction.value };
    },
    { revenues: 0, expenses: 0 }
  );

  return {
    revenues: Math.round(revenuesAndExpenses.revenues),
    expenses: -Math.round(revenuesAndExpenses.expenses),
  };
};
