import { eq, inArray } from "drizzle-orm";
import { db } from "../../../db";
import {
  erc20Token,
  erc20TokenInWallet,
  ethWalletConnection,
  User,
  userConnection,
} from "../../../db/schema";
import { BLOCKCHAINS, ERC20_BALANCE_OF_ABI } from "../../constants";
import { Blockchain, EthereumToken } from "../../types";
import { AssetCategory } from "../../../portfolio/types";
import { ConnectionType } from "../../../types/connection";
import { setUserHasConnections } from "../../../user/service";
import { getCryptoPrice } from "../../utils";

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

export const createEthereumWalletConnection = async (
  user: User,
  name: string,
  address: string,
  blockchains: Blockchain[]
) => {
  const [connection] = await db
    .insert(ethWalletConnection)
    .values({
      userId: user.id,
      name,
      address,
      blockchains,
    })
    .returning({ id: ethWalletConnection.id });

  const tokens = await db
    .select()
    .from(erc20Token)
    .where(inArray(erc20Token.blockchain, blockchains));

  await db.insert(erc20TokenInWallet).values(
    tokens.map((token) => ({
      walletId: connection.id,
      tokenId: token.id,
    }))
  );

  if (!user.hasConnections) {
    await setUserHasConnections(user.id, true);
  }

  return await db.insert(userConnection).values({
    userId: user.id,
    connectionId: connection.id,
    connectionType: ConnectionType.ETH_WALLET,
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
            token: EthereumToken.ETH,
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
        connectionType: ConnectionType.ETH_WALLET,
        tokens: tokens.filter((token) => token.usdValue > 0),
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
        token: EthereumToken;
        usdValue: number;
      }[];
      usdValue: number;
    }[]
  >((acc, tokenBalance) => {
    if (tokenBalance.usdValue === 0) {
      return acc;
    }

    const wallet = acc.find(
      (wallet) => wallet.address === tokenBalance.address
    );

    if (wallet) {
      wallet.usdValue += tokenBalance.usdValue;
      wallet.tokens.push({
        amount: tokenBalance.amount,
        usdValue: tokenBalance.usdValue,
        token: tokenBalance.token as EthereumToken,
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
            token: tokenBalance.token as EthereumToken,
            blockchain: tokenBalance.blockchain as Blockchain,
          },
        ],
        usdValue: tokenBalance.usdValue,
      });
    }

    return acc;
  }, []);
};
