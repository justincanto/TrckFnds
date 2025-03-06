import { Web3 } from "web3";
import { RegisteredSubscription } from "web3/lib/commonjs/eth.exports";
import { Blockchain, EthereumBlockchain, Layer1Blockchain } from "./types";

export const BLOCKCHAINS: {
  [key in Blockchain]: {
    name: string;
    web3Provider: Web3<RegisteredSubscription>;
  };
} = {
  [Layer1Blockchain.BITCOIN]: {
    name: "Bitcoin",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [EthereumBlockchain.ETHEREUM]: {
    name: "Ethereum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [EthereumBlockchain.POLYGON]: {
    name: "Polygon",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [EthereumBlockchain.ARBITRUM]: {
    name: "Arbitrum",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
  [EthereumBlockchain.OPTIMISM]: {
    name: "Optimism",
    web3Provider: new Web3(
      new Web3.providers.HttpProvider(
        `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      )
    ),
  },
};

export const SATOSHIS_PER_BITCOIN = 100000000;

export const MULTI_CALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const MULTI_CALL_ABI = [
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "callData", type: "bytes" },
        ],
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      { name: "blockNumber", type: "uint256" },
      { name: "returnData", type: "bytes[]" },
    ],
    type: "function",
  },
];
