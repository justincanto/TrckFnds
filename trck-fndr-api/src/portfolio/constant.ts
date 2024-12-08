import { getBankAccountsOverview } from "../bank/service";
import {
  getBinanceWalletBalances,
  getBtcWalletBalances,
  getEthWalletBalances,
} from "../crypto/service";
import { ConnectionType } from "../types/connection";
import { SourceAccount } from "./types";

export const SERVICE_BY_CONNECTION_TYPE: {
  [key in ConnectionType]: (userId: string) => Promise<SourceAccount[]>;
} = {
  [ConnectionType.POWENS]: getBankAccountsOverview,
  [ConnectionType.ETH_WALLET]: getEthWalletBalances,
  [ConnectionType.BTC_WALLET]: getBtcWalletBalances,
  [ConnectionType.BINANCE]: getBinanceWalletBalances,
};
