import axios from "axios";
import { db } from "../db";
import { bankConnection } from "../db/schema";
import { eq } from "drizzle-orm";
import { PowensBankAccounts, PowensTransaction } from "./types";
import { convertCurrency } from "../currency/service";
import { Currency } from "../types/currency";
import dayjs from "dayjs";
import { AssetCategory, BankSourceDetails } from "../portfolio/types";
import { ASSET_TYPE_BY_POWENS_ACCOUNT_TYPE } from "./constant";
import { CONNECTION_SOURCES } from "../types/sources";

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

  const accounts = (await axios.get(
    `${process.env.POWENS_BASE_URL}/users/me/accounts`,
    {
      headers: {
        Authorization: `Bearer ${userBankConnection[0].accessToken}`,
      },
    }
  )) as { data: PowensBankAccounts };

  const connections = (await axios.get(
    `${process.env.POWENS_BASE_URL}/users/${accounts.data.accounts[0].id_user}/connections`,
    {
      headers: {
        Authorization: `Bearer ${userBankConnection[0].accessToken}`,
      },
    }
  )) as { data: { connections: { id: number; id_connector: number }[] } };

  const details = await Promise.all(
    accounts.data.accounts.map(async (account) => {
      return {
        name: account.name,
        usdValue:
          account.currency.id === Currency.USD
            ? account.balance
            : await convertCurrency(account.balance, account.currency.id),
        currency: account.currency.id,
        amount: account.balance,
        assetCategory: ASSET_TYPE_BY_POWENS_ACCOUNT_TYPE[account.type],
        logo:
          CONNECTION_SOURCES.find(
            (source) =>
              source.id ===
              connections.data.connections.find(
                (connection) => connection.id === account.id_connection
              )?.id_connector
          )?.logo ?? "default.png",
      };
    })
  );

  return details;
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

  const currentSavingRate =
    (currentMonthData.revenues - currentMonthData.expenses) /
    currentMonthData.revenues;

  const previousSavingRate =
    (previousMonthData.revenues - previousMonthData.expenses) /
    previousMonthData.revenues;

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
      current: currentSavingRate,
      evolution: (currentSavingRate - previousSavingRate) / previousSavingRate,
      isFavorable: currentSavingRate > previousSavingRate,
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
