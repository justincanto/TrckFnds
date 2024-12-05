import { Web3 } from "web3";
import { RegisteredSubscription } from "web3/lib/commonjs/eth.exports";
import { Blockchain } from "./types";

export const BLOCKCHAINS: {
  [key in Blockchain]: {
    name: string;
    web3Provider: Web3<RegisteredSubscription>;
  };
} = {
  [Blockchain.BITCOIN]: {
    name: "Bitcoin",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [Blockchain.ETHEREUM]: {
    name: "Ethereum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [Blockchain.POLYGON]: {
    name: "Polygon",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [Blockchain.ARBITRUM]: {
    name: "Arbitrum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [Blockchain.OPTIMISM]: {
    name: "Optimism",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
};

export const ERC20_BALANCE_OF_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const SATOSHIS_PER_BITCOIN = 100000000;
