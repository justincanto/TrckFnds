export const CONNECTION_SOURCES = [
  {
    name: "American Express",
    id: 30,
  },
  {
    name: "Apivie",
    id: 36,
  },
  {
    name: "assurancevie.com",
    id: 60,
  },
  {
    name: "AXA Banque",
    id: 21,
  },
  {
    name: "Banque Accord",
    id: 34,
  },
  {
    name: "Banque BCP",
    id: 62,
  },
  {
    name: "Banque Populaire",
    id: 15,
  },
  {
    name: "Banque Transatlantique",
    id: 20,
  },
  {
    name: "BforBank",
    id: 66,
  },
  {
    name: "BNP Paribas",
    id: 3,
  },
  {
    name: "BoursoBank",
    id: 4,
    logo: "boursobank.png",
    popular: true,
  },
  {
    name: "BRED",
    id: 11,
  },
  {
    name: "Caisse d'Épargne Particuliers",
    id: 780,
  },
  {
    name: "Caisse d'Épargne Professionnels",
    id: 12,
  },
  {
    name: "Caixa Geral de Depósitos France",
    id: 480,
  },
  {
    name: "Carrefour Banque",
    id: 23,
  },
  {
    name: "CCSO",
    id: 63,
  },
  {
    name: "CIC",
    id: 10,
  },
  {
    name: "Connecteur de test",
    id: 59,
  },
  {
    name: "Crédit Agricole",
    id: 6,
    logo: "credit-agricole.png",
    popular: true,
  },
  {
    name: "Crédit Coopératif",
    id: 16,
  },
  {
    name: "Crédit Maritime",
    id: 22,
  },
  {
    name: "Crédit Mutuel",
    id: 1,
  },
  {
    name: "Crédit Mutuel de Bretagne",
    id: 14,
  },
  {
    name: "Crédit Mutuel du Sud Ouest",
    id: 19,
  },
  {
    name: "Delubac",
    id: 61,
  },
  {
    name: "Fortuneo",
    id: 13,
    logo: "fortuneo.png",
    popular: true,
  },
  {
    name: "Gan Assurances",
    id: 18,
  },
  {
    name: "Hello bank!",
    id: 33,
  },
  {
    name: "ING France",
    id: 7,
  },
  {
    name: "La Banque Postale",
    id: 5,
  },
  {
    name: "La Poste (Colissimo)",
    id: 526,
  },
  {
    name: "LCL",
    id: 8,
  },
  {
    name: "Milleis",
    id: 17,
  },
  {
    name: "Oddo - Clients CGP",
    id: 390,
  },
  {
    name: "Oney",
    id: 57,
  },
  {
    name: "Société Générale",
    id: 9,
    logo: "societe-generale.png",
  },
  {
    name: "Ethereum Wallet",
    logo: "ethereum.png",
    popular: true,
  },
  {
    name: "Bitcoin Wallet",
    logo: "bitcoin.png",
    popular: true,
  },
  {
    name: "Binance",
    logo: "binance.png",
    popular: true,
  },
];

export const TOP_CONNECTION_SOURCES = CONNECTION_SOURCES.filter(
  (source) => source.popular
);
