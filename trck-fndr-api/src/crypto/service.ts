import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  erc20Token,
  erc20TokenInWallet,
  ethWalletConnection,
} from "../db/schema";
import { BLOCKCHAINS } from "./constants";
import { Crypto } from "./types";
import axios from "axios";

export const getCryptoAccountsOverview = async (userId: string) => {
  //get eth balances
  const ethWalletBalances = await getEthBalances(userId);
  const balance = ethWalletBalances.reduce(
    (acc, wallet) =>
      acc +
      wallet.balanceByBlochain.reduce(
        (acc, blockchain) => acc + blockchain.usdValue,
        0
      ),
    0
  );

  //get erc20 balances
  // const ethBalances = await getEthWalletBalances(userId);

  //get btc balances
  //get binance balance
  return { balance };
};

const getEthWalletBalances = async (userId: string) => {
  const ethWallets = await db
    .select()
    .from(ethWalletConnection)
    .where(eq(ethWalletConnection.userId, userId));
  // .innerJoin(
  //   erc20TokenInWallet,
  //   eq(ethWalletConnection.id, erc20TokenInWallet.walletId)
  // );
  // .innerJoin(erc20Token, eq(erc20TokenInWallet.tokenId, erc20Token.id));

  console.log("ethWallets", ethWallets);

  //get the balance for each token address - wallet address combination
  //get the balance using web3js
  const web3 = BLOCKCHAINS.arbitrum.web3Provider;
  const ethereumPrice = await getCryptoPrice(Crypto.ETH);

  const balances = await Promise.all(
    ethWallets.map(async (wallet) => {
      const balance = await web3.eth.getBalance(wallet.address);
      return Number(web3.utils.fromWei(balance, "ether")) * ethereumPrice;
    })
  );

  return balances.reduce((acc, balance) => acc + balance, 0);
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

const getCryptoPrice = async (crypto: Crypto) => {
  const price = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd&x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`
  );

  return price.data.ethereum.usd;
};
