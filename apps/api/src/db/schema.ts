import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  doublePrecision,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/express/adapters";
import { InferSelectModel } from "drizzle-orm";
import { Crypto, ConnectionType } from "@trck-fnds/shared";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isSubscribed: boolean("isSubscribed").default(false).notNull(),
  hasConnections: boolean("hasConnections").default(false).notNull(),
  customerId: text("customerId").unique(),
  planId: text("planId"),
});

export type User = InferSelectModel<typeof users>;

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const bankConnection = pgTable("bankConnection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken").notNull(),
});

export const exchangeRate = pgTable(
  "exchangeRate",
  {
    from: text("from").notNull(),
    to: text("to").notNull(),
    rate: doublePrecision("rate").notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (exchangeRate) => ({
    pk: primaryKey({
      columns: [exchangeRate.from, exchangeRate.to],
    }),
  })
);

export const BlockchainEnum = pgEnum("blockchain_enum", [
  "bitcoin",
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
]);

export const ethWalletConnection = pgTable(
  "ethWalletConnection",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    address: text("address").notNull(),
    name: text("name").notNull(),
  },
  (ethWalletConnection) => ({
    uniqueUserAddress: unique().on(
      ethWalletConnection.userId,
      ethWalletConnection.address
    ),
  })
);

export type EthWalletConnection = InferSelectModel<typeof ethWalletConnection>;

export const walletBlockchain = pgTable(
  "walletBlockchain",
  {
    walletId: text("walletId").references(() => ethWalletConnection.id),
    blockchain: BlockchainEnum().notNull(),
  },
  (walletBlockchain) => ({
    pk: primaryKey({
      columns: [walletBlockchain.walletId, walletBlockchain.blockchain],
    }),
  })
);

export const erc20Token = pgTable("erc20Token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  symbol: text("symbol").notNull(),
  cryptoId: text("cryptoId").$type<Crypto>().notNull(),
  name: text("name").notNull(),
  contractAddress: text("contractAddress").notNull(),
  decimals: integer("decimals").notNull(),
  blockchain: BlockchainEnum().notNull(),
});

export type Erc20Token = InferSelectModel<typeof erc20Token>;

export const binanceConnection = pgTable("binanceConnection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  apiKey: text("apiKey").notNull(),
  secretKey: text("secretKey").notNull(),
  name: text("name").notNull(),
});

export const btcWalletConnection = pgTable("btcWalletConnection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addresses: text("addresses").array().notNull(),
  name: text("name").notNull(),
});

export const ConnectionTypeEnum = pgEnum("connection_type_enum", [
  "POWENS",
  "ETH_WALLET",
  "BTC_WALLET",
  "BINANCE",
]);

export const userConnection = pgTable("userConnection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  connectionId: text("connectionId").notNull(),
  connectionType: ConnectionTypeEnum().$type<ConnectionType>().notNull(),
});

export const accountSnapshot = pgTable("accountSnapshot", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  accountId: text("accountId").notNull(),
  balance: doublePrecision("balance").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
