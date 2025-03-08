import { eq } from "drizzle-orm";
import { db } from "../../../db";
import {
  Erc20Token,
  erc20Token,
  EthWalletConnection,
  ethWalletConnection,
  User,
  userConnection,
  walletBlockchain,
} from "../../../db/schema";
import {
  BLOCKCHAINS,
  MULTI_CALL_ABI,
  MULTI_CALL_ADDRESS,
} from "../../constants";
import {
  AssetCategory,
  Blockchain,
  EthereumBlockchain,
  ConnectionType,
  IEthereumToken,
  EthSourceDetails,
} from "@trck-fnds/shared";
import { setUserHasConnections } from "../../../user/service";
import { getCryptoPrice } from "../../utils";

export const getEthWalletBalances = async (userId: string) => {
  const ethWallets = await getEthereumWalletBalances(userId);

  return ethWallets;
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
    })
    .returning({ id: ethWalletConnection.id });

  await db.insert(walletBlockchain).values(
    blockchains.map((blockchain) => ({
      walletId: connection.id,
      blockchain,
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

const getEthereumWalletBalances = async (userId: string) => {
  const ethWalletTokens = await db
    .select()
    .from(ethWalletConnection)
    .where(eq(ethWalletConnection.userId, userId))
    .innerJoin(
      walletBlockchain,
      eq(ethWalletConnection.id, walletBlockchain.walletId)
    )
    .innerJoin(
      erc20Token,
      eq(erc20Token.blockchain, walletBlockchain.blockchain)
    );

  const multicallPayloads = createMulticallPayloads(ethWalletTokens);

  const walletsBalancesByChains = await getWalletsBalancesByChains(
    multicallPayloads
  );

  const ethereumWalletBalances = getWalletBalances(walletsBalancesByChains);

  return ethereumWalletBalances;
};

const createMulticallPayloads = (
  ethWalletTokens: {
    ethWalletConnection: EthWalletConnection;
    erc20Token: Erc20Token;
  }[]
) => {
  return ethWalletTokens.reduce<
    {
      blockchain: EthereumBlockchain;
      wallets: EthWalletConnection[];
      tokens: Erc20Token[];
      calls: [{ target: string; callData: string }];
    }[]
  >((acc, walletToken) => {
    const { ethWalletConnection, erc20Token } = walletToken;
    const existingPayload = acc.find(
      (payload) => payload.blockchain === erc20Token.blockchain
    );

    const isETH = erc20Token.symbol === "ETH";

    const callToAdd = {
      target: isETH ? MULTI_CALL_ADDRESS : erc20Token.contractAddress,
      callData: BLOCKCHAINS[
        erc20Token.blockchain
      ].web3Provider.eth.abi.encodeFunctionCall(
        isETH
          ? {
              name: "getEthBalance",
              type: "function",
              inputs: [{ name: "addr", type: "address" }],
            }
          : {
              name: "balanceOf",
              type: "function",
              inputs: [{ name: "account", type: "address" }],
            },
        [ethWalletConnection.address]
      ),
    };

    if (existingPayload) {
      existingPayload.tokens.push(erc20Token);
      existingPayload.calls.push(callToAdd);
      existingPayload.wallets.push(ethWalletConnection);
    } else {
      acc.push({
        blockchain: erc20Token.blockchain as EthereumBlockchain,
        tokens: [erc20Token],
        wallets: [ethWalletConnection],
        calls: [callToAdd],
      });
    }

    return acc;
  }, []);
};

const getWalletsBalancesByChains = async (
  multicallPayloads: {
    blockchain: EthereumBlockchain;
    wallets: EthWalletConnection[];
    tokens: Erc20Token[];
    calls: [{ target: string; callData: string }];
  }[]
) => {
  return await Promise.all(
    multicallPayloads.map(async (multicallPayload) => {
      const multicallContract = new BLOCKCHAINS[
        multicallPayload.blockchain
      ].web3Provider.eth.Contract(MULTI_CALL_ABI, MULTI_CALL_ADDRESS);

      const { returnData } = (await multicallContract.methods
        .aggregate(multicallPayload.calls)
        .call()) as { returnData: string[] };

      return {
        wallets: multicallPayload.wallets,
        tokens: await Promise.all(
          returnData.map(async (data, i) => {
            const token = multicallPayload.tokens[i];
            const amount = Number(data) / 10 ** token.decimals;
            return {
              usdValue: amount * (await getCryptoPrice(token.cryptoId)),
              amount,
              blockchain: token.blockchain as EthereumBlockchain,
              name: token.name,
              token: token.cryptoId,
            };
          })
        ),
      };
    })
  );
};

const getWalletBalances = (
  walletsBalancesByChains: {
    wallets: EthWalletConnection[];
    tokens: IEthereumToken[];
  }[]
) => {
  return walletsBalancesByChains.reduce<EthSourceDetails[]>(
    (acc, chainBalances) => {
      chainBalances.wallets.forEach((wallet, i) => {
        const existingWallet = acc.find(
          (accWallet) => wallet.address === accWallet.address
        );

        if (existingWallet) {
          existingWallet.usdValue += chainBalances.tokens[i].usdValue;
          existingWallet.tokens.push(chainBalances.tokens[i]);
        } else {
          acc.push({
            id: wallet.id,
            address: wallet.address,
            name: wallet.name,
            usdValue: chainBalances.tokens[i].usdValue,
            tokens: [chainBalances.tokens[i]],
            assetCategory: AssetCategory.CRYPTO,
            logo: "ethereum.png",
            connectionType: ConnectionType.ETH_WALLET,
          });
        }
      });
      return acc;
    },
    []
  );
};
