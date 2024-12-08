enum Currency {
  EUR = "EUR",
  USD = "USD",
}

type SourceAccount =
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
}

interface BtcSourceDetails {
  addresses: string[];
  amount: number;
  usdValue: number;
  name: string;
  token: string;
  assetCategory: AssetCategory;
}

interface BankSourceDetails {
  name: string;
  usdValue: number;
  currency: Currency;
  amount: number;
  assetCategory: AssetCategory;
}

interface BinanceSourceDetails {
  name: string;
  usdValue: number;
  assetCategory: AssetCategory;
  tokens: object[];
}

export interface Asset {
  category: string;
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
