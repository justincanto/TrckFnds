import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  binanceConnection,
  btcWalletConnection,
  erc20Token,
  erc20TokenInWallet,
  ethWalletConnection,
  userConnection,
} from "../db/schema";
import {
  BLOCKCHAINS,
  ERC20_BALANCE_OF_ABI,
  SATOSHIS_PER_BITCOIN,
} from "./constants";
import { Blockchain, Crypto, EthereumToken, Layer1Token } from "./types";
import axios from "axios";
import { AssetCategory } from "../portfolio/types";
import { ConnectionType } from "../types/connection";
const { Spot } = require("@binance/connector");
const crypto = require("crypto");

export const getEthWalletBalances = async (userId: string) => {
  const ethWalletBalances = await getEthBalances(userId);

  const erc20Balances = await getErc20Balances(userId);

  erc20Balances.forEach((token) => {
    const wallet = ethWalletBalances.find(
      (wallet) => wallet.address === token.address
    );

    if (!wallet) {
      return;
    }

    wallet.usdValue += token.usdValue;
    wallet.tokens.push(...token.tokens);
  });

  return ethWalletBalances;
};

export const getBtcWalletBalances = async (userId: string) => {
  return await getBtcBalances(userId);
};

export const getBinanceWalletBalances = async (userId: string) => {
  return await getBinanceBalances(userId);
};

export const createEthereumWalletConnection = async (
  userId: string,
  name: string,
  address: string,
  blockchains: Blockchain[]
  // tokens: Crypto[]
) => {
  const [connection] = await db
    .insert(ethWalletConnection)
    .values({
      userId,
      name,
      address,
      blockchains,
    })
    .returning({ id: ethWalletConnection.id });

  // await Promise.all(
  //   tokens.map(async (token) => {
  //     const [t] = await db
  //       .select()
  //       .from(erc20Token)
  //       .where(eq(erc20Token.cryptoId, token));

  //     await db.insert(erc20TokenInWallet).values({
  //       walletId: connection.id,
  //       tokenId: t.id,
  //     });
  //   })
  // );

  return await db.insert(userConnection).values({
    userId,
    connectionId: connection.id,
    connectionType: ConnectionType.ETH_WALLET,
  });
};

export const createBitcoinWalletConnection = async (
  userId: string,
  name: string,
  addresses: string[]
) => {
  const [connection] = await db
    .insert(btcWalletConnection)
    .values({
      userId,
      name,
      addresses: addresses,
    })
    .returning({ id: ethWalletConnection.id });

  return await db.insert(userConnection).values({
    userId,
    connectionId: connection.id,
    connectionType: ConnectionType.BTC_WALLET,
  });
};

export const createBinanceWalletConnection = async (
  userId: string,
  name: string,
  apiKey: string,
  secretKey: string
) => {
  const [connection] = await db
    .insert(binanceConnection)
    .values({
      userId,
      name,
      apiKey,
      secretKey,
    })
    .returning({ id: binanceConnection.id });

  return await db.insert(userConnection).values({
    userId,
    connectionId: connection.id,
    connectionType: ConnectionType.BINANCE,
  });
};

const getEthBalances = async (userId: string) => {
  const ethWallets = await db
    .select()
    .from(ethWalletConnection)
    .where(eq(ethWalletConnection.userId, userId));

  const ethereumPrice = await getCryptoPrice(EthereumToken.ETH);

  return await Promise.all(
    ethWallets.map(async (wallet) => {
      const tokens = await Promise.all(
        wallet.blockchains.map(async (blockchain) => {
          const web3 = BLOCKCHAINS[blockchain].web3Provider;
          const balance = await web3.eth.getBalance(wallet.address);
          const amount = Number(web3.utils.fromWei(balance, "ether"));

          return {
            blockchain: blockchain as Blockchain,
            amount,
            usdValue: amount * ethereumPrice,
            token: "ETH",
          };
        })
      );

      return {
        id: wallet.id,
        address: wallet.address,
        name: wallet.name,
        usdValue: tokens.reduce((acc, balance) => acc + balance.usdValue, 0),
        assetCategory: AssetCategory.CRYPTO,
        logo: "ethereum.png",
        tokens,
      };
    })
  );
};

const getErc20Balances = async (userId: string) => {
  const ethWallets = await db
    .select()
    .from(ethWalletConnection)
    .where(eq(ethWalletConnection.userId, userId))
    .innerJoin(
      erc20TokenInWallet,
      eq(ethWalletConnection.id, erc20TokenInWallet.walletId)
    )
    .innerJoin(erc20Token, eq(erc20TokenInWallet.tokenId, erc20Token.id));

  const erc20TokenBalances = await Promise.all(
    ethWallets.map(async (wallet) => {
      const web3 = BLOCKCHAINS[wallet.erc20Token.blockchain].web3Provider;
      const contract = new web3.eth.Contract(
        ERC20_BALANCE_OF_ABI,
        wallet.erc20Token.contractAddress
      );

      const balance = await contract.methods
        .balanceOf(wallet.ethWalletConnection.address)
        .call();

      const amount = Number(balance) / 10 ** wallet.erc20Token.decimals;

      return {
        blockchain: wallet.erc20Token.blockchain,
        token: wallet.erc20Token.name,
        address: wallet.ethWalletConnection.address,
        name: wallet.ethWalletConnection.name,
        usdValue: amount * (await getCryptoPrice(wallet.erc20Token.cryptoId)),
        amount,
      };
    })
  );

  return erc20TokenBalances.reduce<
    {
      address: string;
      name: string;
      tokens: {
        amount: number;
        blockchain: Blockchain;
        token: string;
        usdValue: number;
      }[];
      usdValue: number;
    }[]
  >((acc, tokenBalance) => {
    const wallet = acc.find(
      (wallet) => wallet.address === tokenBalance.address
    );

    if (wallet) {
      wallet.usdValue += tokenBalance.usdValue;
      wallet.tokens.push({
        amount: tokenBalance.amount,
        usdValue: tokenBalance.usdValue,
        token: tokenBalance.token,
        blockchain: tokenBalance.blockchain as Blockchain,
      });
      wallet.usdValue += tokenBalance.usdValue;
    } else {
      acc.push({
        address: tokenBalance.address,
        name: tokenBalance.name,
        tokens: [
          {
            amount: tokenBalance.amount,
            usdValue: tokenBalance.usdValue,
            token: tokenBalance.token,
            blockchain: tokenBalance.blockchain as Blockchain,
          },
        ],
        usdValue: tokenBalance.usdValue,
      });
    }

    return acc;
  }, []);
};

const getBtcBalances = async (userId: string) => {
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
        token: "BTC",
        assetCategory: AssetCategory.CRYPTO,
        logo: "bitcoin.png",
      };
    })
  );
};

const getBinanceBalances = async (userId: string) => {
  const binanceConnections = await db
    .select()
    .from(binanceConnection)
    .where(eq(binanceConnection.userId, userId));

  return await Promise.all(
    binanceConnections.map(async (connection) => {
      const client = new Spot(connection.apiKey, connection.secretKey);
      const accounts = (await client.userAsset()) as {
        data: { asset: string; free: number; locked: number }[];
      };

      const assets = (
        await Promise.all(
          accounts.data.map(async (asset) => {
            return {
              token: asset.asset,
              amount: asset.free + asset.locked,
              usdValue:
                (asset.free + asset.locked) *
                (await getCryptoPrice(asset.asset as Crypto)),
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
        tokens: [
          ...assets,
          { token: "other", usdValue: otherBalance, amount: otherBalance },
        ],
      };
    })
  );
};

const getBitcoinAddressBalance = async (address: string) => {
  const balance = await axios.get(
    `https://blockchain.info/balance?active=${address}`
  );

  return Number(balance.data[address].final_balance / SATOSHIS_PER_BITCOIN);
};

const getCryptoPrice = async (crypto: Crypto) => {
  const price = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd&x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`
  );

  return price.data[crypto].usd as number;
};
