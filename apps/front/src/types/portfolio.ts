import { Blockchain, EthereumBlockchain } from "./crypto";
import { ConnectionType } from "./source";

enum Currency {
  EUR = "EUR",
  USD = "USD",
}

export type SourceAccount =
  | EthSourceDetails
  | BtcSourceDetails
  | BankSourceDetails
  | BinanceSourceDetails;

interface Token {
  amount: number;
  usdValue: number;
  name: string;
}

export interface EthereumToken extends Token {
  blockchain: EthereumBlockchain;
  token: Crypto;
}

export interface EthSourceDetails {
  id: string;
  name: string;
  address: string;
  usdValue: number;
  tokens: EthereumToken[];
  assetCategory: AssetCategory;
  logo: string | undefined;
  connectionType: ConnectionType;
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
  connectionType: ConnectionType;
}

export interface BankSourceDetails {
  id: string;
  name: string;
  usdValue: number;
  currency: Currency;
  amount: number;
  assetCategory: AssetCategory;
  logo: string | undefined;
  connectionType: ConnectionType;
}

export interface BinanceSourceDetails {
  id: string;
  name: string;
  usdValue: number;
  assetCategory: AssetCategory;
  logo: string | undefined;
  tokens: Token[];
  connectionType: ConnectionType;
}

export enum AssetCategory {
  CRYPTO = "CRYPTO",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  BANK_PASSBOOK = "BANK_PASSBOOK",
  STOCKS = "STOCKS",
  REAL_ESTATE = "REAL_ESTATE",
}

export interface Asset {
  category: AssetCategory;
  balance: number;
  accounts: SourceAccount[];
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
