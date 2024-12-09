import { eq } from "drizzle-orm";
import { getUserRevenuesAndExpensesByMonthWithEvolution } from "../bank/service";
import { db } from "../db";
import { userConnection } from "../db/schema";
import { SERVICE_BY_CONNECTION_TYPE } from "./constant";
import { SourceAccount } from "./types";

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

export const getPortfolioBreakdown = async (userId: string) => {};

export const getPortfolioEvolutioin = async (userId: string) => {};
