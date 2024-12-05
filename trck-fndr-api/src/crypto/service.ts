import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  erc20Token,
  erc20TokenInWallet,
  ethWalletConnection,
} from "../db/schema";
import { BLOCKCHAINS, ERC20_BALANCE_OF_ABI } from "./constants";
import { Crypto } from "./types";
import axios from "axios";

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

  //get btc balances
  //get binance balance
  return { balance: ethTotalBalance + erc20TotalBalance };
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

  return price.data[crypto].usd;
};
