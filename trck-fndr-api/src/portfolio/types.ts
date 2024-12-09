import { Currency } from "../types/currency";

export type SourceAccount =
  | EthSourceDetails
  | BtcSourceDetails
  | BankSourceDetails
  | BinanceSourceDetails;

interface EthSourceDetails {
  name: string;
  address: string;
  usdValue: number;
  tokens: object[];
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

export interface BankSourceDetails {
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
  tokens: object[];
}

export enum AssetCategory {
  CRYPTO = "CRYPTO",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  BANK_PASSBOOK = "BANK_PASSBOOK",
  STOCKS = "STOCKS",
  REAL_ESTATE = "REAL_ESTATE",
}
