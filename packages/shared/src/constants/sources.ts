import { ConnectionType } from "../types/source";

export const CONNECTION_SOURCES = [
  {
    name: "American Express",
    id: 30,
    logo: "american-express.jpeg",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Apivie",
    id: 36,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "assurancevie.com",
    id: 60,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "AXA Banque",
    logo: "axa-banque.png",
    id: 21,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Banque Accord",
    id: 34,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Banque BCP",
    id: 62,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Banque Populaire",
    logo: "banque-populaire.png",
    id: 15,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Banque Transatlantique",
    id: 20,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "BforBank",
    logo: "b-for-bank.png",
    id: 66,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "BNP Paribas",
    logo: "bnp-paribas.png",
    id: 3,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "BoursoBank",
    id: 4,
    connectionType: ConnectionType.POWENS,
    logo: "boursobank.png",
    popular: true,
  },
  {
    name: "BRED",
    logo: "banque-populaire.png",
    id: 11,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Caisse d'Épargne Particuliers",
    logo: "caisse-epargne.jpg",
    id: 780,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Caisse d'Épargne Professionnels",
    logo: "caisse-epargne.jpg",
    id: 12,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Caixa Geral de Depósitos France",
    id: 480,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Carrefour Banque",
    id: 23,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "CCSO",
    id: 63,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "CIC",
    id: 10,
    logo: "cic.jpg",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Connecteur de test",
    id: 59,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Crédit Agricole",
    id: 6,
    connectionType: ConnectionType.POWENS,
    logo: "credit-agricole.png",
    popular: true,
  },
  {
    name: "Crédit Coopératif",
    id: 16,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Crédit Maritime",
    id: 22,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Crédit Mutuel",
    logo: "credit-mutuel.png",
    id: 1,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Crédit Mutuel de Bretagne",
    logo: "credit-mutuel.png",
    id: 14,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Crédit Mutuel du Sud Ouest",
    logo: "credit-mutuel.png",
    id: 19,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Delubac",
    id: 61,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Fortuneo",
    id: 13,
    connectionType: ConnectionType.POWENS,
    logo: "fortuneo.png",
    popular: true,
  },
  {
    name: "Gan Assurances",
    id: 18,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Hello bank!",
    logo: "hello-bank.png",
    id: 33,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "ING France",
    id: 7,
    logo: "ing.png",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "La Banque Postale",
    logo: "banque-postale.png",
    id: 5,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "La Poste (Colissimo)",
    id: 526,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "LCL",
    logo: "lcl.png",
    id: 8,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Milleis",
    id: 17,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Oddo - Clients CGP",
    id: 390,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Oney",
    id: 57,
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Société Générale",
    id: 9,
    connectionType: ConnectionType.POWENS,
    logo: "societe-generale.png",
  },
  {
    name: "Trade Republic",
    id: 1190,
    logo: "trade-republic.png",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Revolut",
    id: 524,
    logo: "revolut.png",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "N26",
    id: 418,
    logo: "n26.png",
    connectionType: ConnectionType.POWENS,
  },
  {
    name: "Ethereum Wallet",
    logo: "ethereum.png",
    popular: true,
    connectionType: ConnectionType.ETH_WALLET,
  },
  {
    name: "Bitcoin Wallet",
    logo: "bitcoin.png",
    popular: true,
    connectionType: ConnectionType.BTC_WALLET,
  },
  {
    name: "Binance",
    logo: "binance.png",
    popular: true,
    connectionType: ConnectionType.BINANCE,
  },
];

export const TOP_CONNECTION_SOURCES = CONNECTION_SOURCES.filter(
  (source) => source.popular
);
