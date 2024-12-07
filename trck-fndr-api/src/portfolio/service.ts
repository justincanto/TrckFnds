import { eq } from "drizzle-orm";
import { getUserRevenuesAndExpensesByMonthWithEvolution } from "../bank/service";
import { db } from "../db";
import { userConnection } from "../db/schema";
import { SERVICE_BY_CONNECTION_TYPE } from "./constant";

export const getPortfolioOverview = async (userId: string) => {
  const userConnectionTypes = await db
    .selectDistinct({ connectionType: userConnection.connectionType })
    .from(userConnection)
    .where(eq(userConnection.userId, userId));

  const connections = await Promise.all(
    userConnectionTypes.map(async (connection) => {
      return await SERVICE_BY_CONNECTION_TYPE[connection.connectionType](
        userId
      );
    })
  );

  const cashflow = await getUserRevenuesAndExpensesByMonthWithEvolution(userId);

  return {
    balance: connections.reduce(
      (acc, connection) => acc + connection.balance,
      0
    ),
    cashflow,
  };
};

export const getPortfolioBreakdown = async (userId: string) => {};

export const getPortfolioEvolutioin = async (userId: string) => {};
