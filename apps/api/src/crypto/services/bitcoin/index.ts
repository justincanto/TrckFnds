import axios from "axios";
import { btcWalletConnection, User, userConnection } from "../../../db/schema";
import { setUserHasConnections } from "../../../user/service";
import { db } from "../../../db";
import { AssetCategory, Layer1Token, ConnectionType } from "@trck-fnds/shared";
import { getCryptoPrice } from "../../utils";
import { eq } from "drizzle-orm";
import { SATOSHIS_PER_BITCOIN } from "../../constants";

export const getBtcWalletBalances = async (userId: string) => {
  const btcWallets = await db
    .select()
    .from(btcWalletConnection)
    .where(eq(btcWalletConnection.userId, userId));

  return await Promise.all(
    btcWallets.map(async (wallet) => {
      const balance = (
        await Promise.all(
          wallet.addresses.map(async (address) => {
            return await getBitcoinAddressBalance(address);
          })
        )
      ).reduce((acc, balance) => acc + balance, 0);

      return {
        id: wallet.id,
        name: wallet.name,
        addresses: wallet.addresses,
        amount: balance,
        usdValue: balance * (await getCryptoPrice(Layer1Token.BTC)),
        token: Layer1Token.BTC,
        assetCategory: AssetCategory.CRYPTO,
        logo: "bitcoin.png",
        connectionType: ConnectionType.BTC_WALLET,
      };
    })
  );
};

export const createBitcoinWalletConnection = async (
  user: User,
  name: string,
  addresses: string[]
) => {
  const [connection] = await db
    .insert(btcWalletConnection)
    .values({
      userId: user.id,
      name,
      addresses: addresses,
    })
    .returning({ id: btcWalletConnection.id });

  if (!user.hasConnections) {
    await setUserHasConnections(user.id, true);
  }

  return await db.insert(userConnection).values({
    userId: user.id,
    connectionId: connection.id,
    connectionType: ConnectionType.BTC_WALLET,
  });
};

const getBitcoinAddressBalance = async (address: string) => {
  const balance = await axios.get(
    `https://blockchain.info/balance?active=${address}`
  );

  return Number(balance.data[address].final_balance / SATOSHIS_PER_BITCOIN);
};
