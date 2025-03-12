import { eq, sum } from "drizzle-orm";
import { getUserRevenuesAndExpensesByMonthWithEvolution } from "../bank/service";
import { db } from "../db";
import { accountSnapshot, userConnection, users } from "../db/schema";
import { SERVICE_BY_CONNECTION_TYPE } from "./constant";
import { SourceAccount } from "@trckfnds/shared";
import { TimeRange, getTimeRangeStartDate } from "@trckfnds/shared";
import dayjs from "dayjs";

export const getPortfolioOverview = async (userId: string) => {
  const assets = await getAllUserAccounts(userId);

  const assetsByCategory = assets.reduce((acc, asset) => {
    const assetCategory = acc.find(
      (category) => category.category === asset.assetCategory
    );

    if (!assetCategory) {
      acc.push({
        category: asset.assetCategory,
        balance: asset.usdValue,
        accounts: [asset],
      });
    } else {
      assetCategory.balance += asset.usdValue;
      assetCategory.accounts.push(asset);
    }

    return acc;
  }, [] as { category: string; balance: number; accounts: SourceAccount[] }[]);

  const cashflow = await getUserRevenuesAndExpensesByMonthWithEvolution(userId);

  return {
    balance: assetsByCategory.reduce(
      (acc, category) => acc + category.balance,
      0
    ),
    cashflow,
    assets: assetsByCategory,
  };
};

export const getAllUserAccounts = async (userId: string) => {
  const userConnectionTypes = await db
    .selectDistinct({ connectionType: userConnection.connectionType })
    .from(userConnection)
    .where(eq(userConnection.userId, userId));

  return (
    await Promise.all(
      userConnectionTypes.map(async (connection) => {
        return await SERVICE_BY_CONNECTION_TYPE[connection.connectionType](
          userId
        );
      })
    )
  ).flat();
};

export const getPortfolioEvolution = async (
  userId: string,
  timeRange: TimeRange = TimeRange.MONTH
) => {
  const today = dayjs();
  const startDate = getTimeRangeStartDate(timeRange);

  const snapshotsPerDay = await db
    .select({
      balance: sum(accountSnapshot.balance),
      date: accountSnapshot.timestamp,
    })
    .from(accountSnapshot)
    .where(eq(accountSnapshot.userId, userId))
    .groupBy(accountSnapshot.timestamp);

  const formattedSnapshots = snapshotsPerDay.map((snapshot) => ({
    balance: snapshot.balance ? parseFloat(snapshot.balance) : 0,
    date: dayjs(snapshot.date).format("DD/MM"),
  }));

  const daysToShow = today.diff(startDate, "day");
  const pastDays = Array.from({ length: daysToShow }, (_, i) =>
    today.subtract(i, "day").format("DD/MM")
  ).reverse();

  const snapshotsWithPastDates = pastDays.map((date) => {
    const snapshot = formattedSnapshots.find((s) => s.date === date);
    return snapshot || { date, balance: 0 };
  });

  return snapshotsWithPastDates;
};
