import { Crypto, EthereumBlockchain } from "../crypto/types";
import { ConnectionType } from "../types/connection";
import { Currency } from "../types/currency";

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

export type EthereumTokenObject = IEthereumToken;

interface IEthereumToken extends Token {
  blockchain: EthereumBlockchain;
  token: Crypto;
}

export interface EthSourceDetails {
  id: string;
  name: string;
  address: string;
  usdValue: number;
  tokens: IEthereumToken[];
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

interface BinanceSourceDetails {
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
