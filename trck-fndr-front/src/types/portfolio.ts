import { Blockchain } from "./crypto";

enum Currency {
  EUR = "EUR",
  USD = "USD",
}

type SourceAccount =
  | EthSourceDetails
  | BtcSourceDetails
  | BankSourceDetails
  | BinanceSourceDetails;

interface Token {
  amount: number;
  usdValue: number;
  token: string;
  blockchain: Blockchain;
}

interface EthSourceDetails {
  name: string;
  address: string;
  usdValue: number;
  tokens: Token[];
  assetCategory: AssetCategory;
  logo: string;
}

interface BtcSourceDetails {
  addresses: string[];
  amount: number;
  usdValue: number;
  name: string;
  token: string;
  assetCategory: AssetCategory;
  logo: string;
}

interface BankSourceDetails {
  name: string;
  usdValue: number;
  currency: Currency;
  amount: number;
  assetCategory: AssetCategory;
  logo: string;
}

interface BinanceSourceDetails {
  name: string;
  usdValue: number;
  assetCategory: AssetCategory;
  logo: string;
  tokens: Token[];
}

export interface Asset {
  category: AssetCategory;
  balance: number;
  accounts: SourceAccount[];
}

export enum AssetCategory {
  CRYPTO = "CRYPTO",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  BANK_PASSBOOK = "BANK_PASSBOOK",
  STOCKS = "STOCKS",
  REAL_ESTATE = "REAL_ESTATE",
}

export type PortfolioData = {
  balance: number;
  assets: Asset[];
  cashflow: {
    expenses: {
      current: number;
      evolution: number;
      isFavorable: boolean;
    };
    revenues: {
      current: number;
      evolution: number;
      isFavorable: boolean;
    };
    savingRate: {
      current: number;
      evolution: number;
      isFavorable: boolean;
    };
  };
};
