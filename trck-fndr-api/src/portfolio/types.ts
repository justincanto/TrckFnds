import { Currency } from "../types/currency";

export type SourceAccount =
  | EthSourceDetails
  | BtcSourceDetails
  | BankSourceDetails
  | BinanceSourceDetails;

interface EthSourceDetails {
  id: string;
  name: string;
  address: string;
  usdValue: number;
  tokens: object[];
  assetCategory: AssetCategory;
  logo: string | undefined;
}

interface BtcSourceDetails {
  id: string;
  addresses: string[];
  amount: number;
  usdValue: number;
  name: string;
  token: string;
  assetCategory: AssetCategory;
  logo: string | undefined;
}

export interface BankSourceDetails {
  id: string;
  name: string;
  usdValue: number;
  currency: Currency;
  amount: number;
  assetCategory: AssetCategory;
  logo: string | undefined;
}

interface BinanceSourceDetails {
  id: string;
  name: string;
  usdValue: number;
  assetCategory: AssetCategory;
  logo: string | undefined;
  tokens: object[];
}

export enum AssetCategory {
  CRYPTO = "CRYPTO",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  BANK_PASSBOOK = "BANK_PASSBOOK",
  STOCKS = "STOCKS",
  REAL_ESTATE = "REAL_ESTATE",
}
