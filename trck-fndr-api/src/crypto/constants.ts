import { Web3 } from "web3";
import { BlockchainEnum, Blockchain } from "../db/schema";
import { RegisteredSubscription } from "web3/lib/commonjs/eth.exports";

export const BLOCKCHAINS: {
  [key in Blockchain]: {
    name: string;
    web3Provider: Web3<RegisteredSubscription>;
  };
} = {
  [BlockchainEnum.enumValues[0]]: {
    name: "Bitcoin",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [BlockchainEnum.enumValues[1]]: {
    name: "Ethereum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [BlockchainEnum.enumValues[2]]: {
    name: "Polygon",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [BlockchainEnum.enumValues[3]]: {
    name: "Arbitrum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [BlockchainEnum.enumValues[4]]: {
    name: "Optimism",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
};
