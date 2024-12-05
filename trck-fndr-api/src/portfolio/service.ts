import { getBankAccountsOverview } from "../bank/service";

export const getPortfolioOverview = async (userId: string) => {
  //aggregate all the user's assets
  //bank accounts
  const bankAccountsOverview = await getBankAccountsOverview(userId);

  //crypto accounts

  //

  return bankAccountsOverview;
};

export const getPortfolioBreakdown = async (userId: string) => {};

export const getPortfolioEvolutioin = async (userId: string) => {};
