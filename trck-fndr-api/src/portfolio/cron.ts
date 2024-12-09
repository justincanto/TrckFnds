import { CronJob } from "cron";
import { db } from "../db";
import { accountSnapshot, users } from "../db/schema";
import { getAllUserAccounts } from "./service";

const computePortfolioDailySnapshots = async () => {
  const activeUsers = await db.select().from(users);
  const portfolioSnapshots = await Promise.all(
    activeUsers.map(async (user) => ({
      userId: user.id,
      accounts: await getAllUserAccounts(user.id),
    }))
  );

  portfolioSnapshots.forEach(async (snapshot) => {
    snapshot.accounts.forEach(async (account) => {
      await db.insert(accountSnapshot).values({
        userId: snapshot.userId,
        balance: account.usdValue,
        timestamp: new Date(),
        accountId: account.id,
      });
    });
  });
};

const job = new CronJob(
  "30 23 * * *",
  computePortfolioDailySnapshots,
  null,
  true,
  "Europe/Paris"
);
