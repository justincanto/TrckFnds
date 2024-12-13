export type Crypto = EthereumToken | Layer1Token;

export type Blockchain = Layer1Blockchain | EthereumBlockchain;

export enum Layer1Token {
  ETH = "ethereum",
  BTC = "bitcoin",
  EGLD = "elrond-erd-2",
  SOL = "solana",
  BNB = "binancecoin",
  AR = "arweave",
  AVAX = "avalanche-2",
  DOT = "polkadot",
}

export enum EthereumToken {
  ETH = "ethereum",
  USDC = "usd-coin",
  USDT = "tether",
  DAI = "dai",
  POL = "polygon-ecosystem-token",
  AAVE = "aave",
  LINK = "chainlink",
  GRT = "the-graph",
  FET = "fetch-ai",
  RENDER = "render-token",
}

export enum Layer1Blockchain {
  BITCOIN = "bitcoin",
  ETHEREUM = "ethereum",
}

export enum EthereumBlockchain {
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
}
