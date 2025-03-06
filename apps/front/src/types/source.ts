export interface ConnectionSource {
  id?: number;
  name: string;
  logo?: string;
  popular?: boolean;
  connectionType: ConnectionType;
}

export enum ConnectionType {
  POWENS = "POWENS",
  ETH_WALLET = "ETH_WALLET",
  BTC_WALLET = "BTC_WALLET",
  BINANCE = "BINANCE",
}
