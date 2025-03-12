import { AssetCategory, SourceAccount } from "@trckfnds/shared";

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
