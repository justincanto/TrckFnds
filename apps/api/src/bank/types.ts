import { Currency } from "@trck-fnds/shared";

export interface PowensTransaction {
  value: number;
  date: string;
  wording: string;
  id: string;
  id_category: number;
  id_account: number;
}

export enum PowensAccountType {
  ARTICLE_83 = "article83",
  CAPITALISATION = "capitalisation",
  CARD = "card",
  CHECKING = "checking",
  CROWDLENDING = "crowdlending",
  DEPOSIT = "deposit",
  JOINT = "joint",
  LDDS = "ldds",
  LIFE_INSURANCE = "lifeinsurance",
  LOAN = "loan",
  MADELIN = "madelin",
  MARKET = "market",
  PEA = "pea",
  PEE = "pee",
  PER = "per",
  PERCO = "perco",
  PERP = "perp",
  REAL_ESTATE = "real_estate",
  RSP = "rsp",
  SAVINGS = "savings",
  UNKNOWN = "unknown",
}

interface ICurrency {
  id: Currency; // Example: "EUR"
  symbol: string; // Example: "€"
  prefix: boolean; // Whether the symbol is prefixed or suffixed
  crypto: boolean; // Whether it's a cryptocurrency
  precision: number; // Decimal precision
  marketcap: number | null; // Market capitalization if applicable
  datetime: string | null; // Date of last update if applicable
  name: string; // Name of the currency, e.g., "Euro"
}

interface AccountInformation {
  [key: string]: any; // Assuming this can hold dynamic key-value pairs
}

interface Account {
  id: number;
  id_connection: number;
  id_user: number;
  id_source: number;
  id_parent: number | null;
  number: string;
  webid: string;
  original_name: string;
  balance: number;
  coming: number;
  display: boolean;
  last_update: string; // ISO datetime string, e.g., "2024-12-06 01:09:36"
  deleted: string | null; // ISO datetime string or null
  disabled: string | null; // ISO datetime string or null
  iban: string; // IBAN format
  currency: ICurrency;
  id_type: number;
  bookmarked: number; // 0 or 1
  name: string;
  error: string | null;
  usage: string; // Example: "PRIV"
  ownership: string; // Example: "owner"
  company_name: string | null;
  opening_date: string | null; // ISO date string or null
  bic: string; // BIC format
  coming_balance: number;
  formatted_balance: string; // Example: "426,08 €"
  type: PowensAccountType; // Example: "checking"
  information: AccountInformation;
  loan: any | null; // Replace `any` with a more specific type if known
}

export type PowensBankAccounts = {
  balances: Partial<{ [key in Currency]: number }>;
  accounts: Account[];
};
