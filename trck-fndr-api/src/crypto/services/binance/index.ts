import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { binanceConnection, User, userConnection } from "../../../db/schema";
import { AssetCategory } from "../../../portfolio/types";
import { ConnectionType } from "../../../types/connection";
import { Crypto, EthereumToken, Layer1Token } from "../../types";
import axios from "axios";
import { getCryptoPrice } from "../../utils";
import { setUserHasConnections } from "../../../user/service";
const { Spot } = require("@binance/connector");
const crypto = require("crypto");

export const getBinanceWalletBalances = async (userId: string) => {
  const binanceConnections = await db
    .select()
    .from(binanceConnection)
    .where(eq(binanceConnection.userId, userId));

  return await Promise.all(
    binanceConnections.map(async (connection) => {
      const client = new Spot(connection.apiKey, connection.secretKey);
      const accounts = (await client.userAsset()) as {
        data: { asset: Crypto; free: number; locked: number }[];
      };

      const assets = (
        await Promise.all(
          accounts.data.map(async (asset) => {
            const crypto = [
              ...Object.entries(Layer1Token),
              ...Object.entries(EthereumToken),
            ].find((c) => c[0] === asset.asset);

            return {
              token: asset.asset,
              amount: asset.free + asset.locked,
              usdValue: crypto
                ? (asset.free + asset.locked) *
                  (await getCryptoPrice(crypto[1]))
                : 0,
            };
          })
        )
      ).filter((asset) => asset.usdValue > 0);

      const signature = crypto
        .createHmac("sha256", connection.secretKey)
        .update("timestamp=" + Date.now())
        .digest("hex");

      const res = await axios.get(
        `https://api.binance.com/sapi/v1/asset/wallet/balance?timestamp=${Date.now()}&signature=${encodeURIComponent(
          signature
        )}`,
        {
          headers: {
            "X-MBX-APIKEY": connection.apiKey,
          },
        }
      );

      const otherBalance =
        res.data.reduce(
          (acc: number, asset: { balance: string }) =>
            acc + Number(asset.balance),
          0
        ) *
          (await getCryptoPrice(Layer1Token.BTC)) -
        assets.reduce((acc, asset) => acc + asset.usdValue, 0);

      return {
        id: connection.id,
        name: connection.name,
        assetCategory: AssetCategory.CRYPTO,
        usdValue:
          assets.reduce((acc, asset) => acc + asset.usdValue, 0) + otherBalance,
        logo: "binance.png",
        connectionType: ConnectionType.BINANCE,
        tokens: [
          ...assets,
          {
            token: "other" as Crypto,
            usdValue: otherBalance,
            amount: otherBalance,
          },
        ],
      };
    })
  );
};

export const createBinanceWalletConnection = async (
  user: User,
  name: string,
  apiKey: string,
  secretKey: string
) => {
  const [connection] = await db
    .insert(binanceConnection)
    .values({
      userId: user.id,
      name,
      apiKey,
      secretKey,
    })
    .returning({ id: binanceConnection.id });

  if (!user.hasConnections) {
    await setUserHasConnections(user.id, true);
  }

  return await db.insert(userConnection).values({
    userId: user.id,
    connectionId: connection.id,
    connectionType: ConnectionType.BINANCE,
  });
};
