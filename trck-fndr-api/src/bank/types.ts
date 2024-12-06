import { Currency } from "../types/currency";

export type PowensBankAccounts = {
  balances: Partial<{ [key in Currency]: number }>;
};

export interface PowensTransaction {
  value: number;
  date: string;
  wording: string;
  id: string;
  id_category: number;
  id_account: number;
}
