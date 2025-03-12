import { getBankAccountsOverview } from "../bank/service";
import { getEthWalletBalances } from "../crypto/services/ethereum";
import { getBinanceWalletBalances } from "../crypto/services/binance";
import { ConnectionType, SourceAccount } from "@trck-fnds/shared";
import { getBtcWalletBalances } from "../crypto/services/bitcoin";

export const SERVICE_BY_CONNECTION_TYPE: {
  [key in ConnectionType]: (userId: string) => Promise<SourceAccount[]>;
} = {
  [ConnectionType.POWENS]: getBankAccountsOverview,
  [ConnectionType.ETH_WALLET]: getEthWalletBalances,
  [ConnectionType.BTC_WALLET]: getBtcWalletBalances,
  [ConnectionType.BINANCE]: getBinanceWalletBalances,
};
