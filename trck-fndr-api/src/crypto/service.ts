import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  binanceConnection,
  btcWalletConnection,
  erc20Token,
  erc20TokenInWallet,
  ethWalletConnection,
} from "../db/schema";
import {
  BLOCKCHAINS,
  ERC20_BALANCE_OF_ABI,
  SATOSHIS_PER_BITCOIN,
} from "./constants";
import { Blockchain, Crypto } from "./types";
import axios from "axios";
const { Spot } = require("@binance/connector");
const crypto = require("crypto");

export const getCryptoAccountsOverview = async (userId: string) => {
  const ethWalletBalances = await getEthBalances(userId);
  const ethTotalBalance = ethWalletBalances.reduce(
    (acc, wallet) =>
      acc +
      wallet.balanceByBlochain.reduce(
        (acc, blockchain) => acc + blockchain.usdValue,
        0
      ),
    0
  );

  const erc20Balances = await getErc20Balances(userId);
  const erc20TotalBalance = erc20Balances.reduce(
    (acc, token) => acc + token.usdValue,
    0
  );

  const btcBalances = await getBtcBalances(userId);
  const btcBalance = btcBalances.reduce(
    (acc, wallet) => acc + wallet.usdValue,
    0
  );

  const binanceBalances = await getBinanceBalances(userId);
  const binanceBalance = binanceBalances.reduce(
    (acc, asset) => acc + asset.reduce((acc, asset) => acc + asset.usdValue, 0),
    0
  );

  return {
    balance: ethTotalBalance + erc20TotalBalance + btcBalance + binanceBalance,
  };
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

  return await Promise.all(
    ethWallets.map(async (wallet) => {
      const web3 = BLOCKCHAINS[wallet.erc20Token.blockchain].web3Provider;
      const contract = new web3.eth.Contract(
        ERC20_BALANCE_OF_ABI,
        wallet.erc20Token.contractAddress
      );

      const balance = await contract.methods
        .balanceOf(wallet.ethWalletConnection.address)
        .call();

      return {
        blockchain: wallet.erc20Token.blockchain,
        token: wallet.erc20Token.name,
        address: wallet.ethWalletConnection.address,
        name: wallet.ethWalletConnection.name,
        usdValue:
          (Number(balance) / 10 ** wallet.erc20Token.decimals) *
          (await getCryptoPrice(wallet.erc20Token.cryptoId)),
      };
    })
  );
};

const getEthBalances = async (userId: string) => {
  const ethWallets = await db
    .select()
    .from(ethWalletConnection)
    .where(eq(ethWalletConnection.userId, userId));

  const ethereumPrice = await getCryptoPrice(Crypto.ETH);

  return await Promise.all(
    ethWallets.map(async (wallet) => {
      return {
        address: wallet.address,
        balanceByBlochain: await Promise.all(
          wallet.blockchains.map(async (blockchain) => {
            const web3 = BLOCKCHAINS[blockchain].web3Provider;
            const balance = await web3.eth.getBalance(wallet.address);
            return {
              blockchain,
              name: wallet.name,
              amount: Number(web3.utils.fromWei(balance, "ether")),
              usdValue:
                Number(web3.utils.fromWei(balance, "ether")) * ethereumPrice,
            };
          })
        ),
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
      const accounts = await client.userAsset();

      const assets = (
        await Promise.all(
          accounts.data.map(
            async (asset: { asset: string; free: number; locked: number }) => {
              return {
                asset: asset.asset,
                amount: asset.free + asset.locked,
                usdValue:
                  (asset.free + asset.locked) *
                  (Crypto?.[asset.asset as keyof typeof Crypto]
                    ? await getCryptoPrice(
                        Crypto?.[asset.asset as keyof typeof Crypto]
                      )
                    : 0),
              };
            }
          )
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
          (await getCryptoPrice(Crypto.BTC)) -
        assets.reduce((acc, asset) => acc + asset.usdValue, 0);

      return [
        ...assets,
        { asset: "other", usdValue: otherBalance, amount: otherBalance },
      ];
    })
  );
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
        name: wallet.name,
        addresses: wallet.addresses,
        amount: balance,
        blockchain: Blockchain.BITCOIN,
        usdValue: balance * (await getCryptoPrice(Crypto.BTC)),
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

  return price.data[crypto].usd;
};
