import { CronJob } from "cron";
import { db } from "../db";
import { bankConnection, bankTransaction, users } from "../db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { PowensTransaction } from "./types";
import dayjs from "dayjs";

export const storeDailyTransactions = async () => {
  const subscribedUsers = await db
    .select()
    .from(users)
    .where(eq(users.isSubscribed, true));

  const bankConnections = (
    await Promise.all(
      subscribedUsers.map(async (user) => {
        const [userBankConnection] = await db
          .select()
          .from(bankConnection)
          .where(eq(bankConnection.userId, user.id));

        return userBankConnection;
      })
    )
  ).filter(Boolean);

  const yesterday = dayjs().subtract(1, "day");

  const bankTransactionsByUser = await Promise.all(
    bankConnections.map(async (userBankConnection) => {
      const { data } = (await axios.get(
        `${
          process.env.POWENS_BASE_URL
        }/users/me/transactions?limit=1000&min_date=${yesterday
          .startOf("day")
          .format("YYYY-MM-DD")}&max_date=${yesterday
          .endOf("day")
          .format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${userBankConnection.accessToken}`,
          },
        }
      )) as { data: { transactions: PowensTransaction[] } };

      return {
        userId: userBankConnection.userId,
        transactions: data.transactions,
      };
    })
  );

  //TODO - categorize transactions

  await Promise.all(
    bankTransactionsByUser.map(
      async (userTransactions) =>
        await db.insert(bankTransaction).values(
          userTransactions.transactions.map((transaction) => ({
            amount: transaction.value,
            label: transaction.wording,
            powensId: transaction.id,
            userId: userTransactions.userId,
            timestamp: new Date(transaction.date),
          }))
        )
    )
  );
};

const job = new CronJob(
  "30 00 * * *",
  storeDailyTransactions,
  null,
  true,
  "Europe/Paris"
);
