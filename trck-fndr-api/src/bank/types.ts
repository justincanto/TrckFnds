import { Currency } from "../types/currency";

export type PowensBankAccounts = {
  balances: Partial<{ [key in Currency]: number }>;
};
