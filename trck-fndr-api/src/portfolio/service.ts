import { getBankAccountsOverview } from "../bank/service";
import { getCryptoAccountsOverview } from "../crypto/service";

export const getPortfolioOverview = async (userId: string) => {
  const bankAccountsOverview = await getBankAccountsOverview(userId);

  const cryptoAccountsOverview = await getCryptoAccountsOverview(userId);

  return {
    balance: bankAccountsOverview.balance + cryptoAccountsOverview.balance,
  };
};

export const getPortfolioBreakdown = async (userId: string) => {};

export const getPortfolioEvolutioin = async (userId: string) => {};
