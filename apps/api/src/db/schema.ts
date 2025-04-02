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
import { InferSelectModel } from "drizzle-orm";
import { Crypto, ConnectionType } from "@trckfnds/shared";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  googleId: text("googleId").unique(),
  image: text("image"),
  isSubscribed: boolean("isSubscribed").default(false).notNull(),
  hasConnections: boolean("hasConnections").default(false).notNull(),
  customerId: text("customerId").unique(),
  planId: text("planId"),
});

export type User = InferSelectModel<typeof users>;

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

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
    walletId: text("walletId")
      .notNull()
      .references(() => ethWalletConnection.id),
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

export const bankTransaction = pgTable("bankTransaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  powensId: text("powensId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: doublePrecision("amount").notNull(),
  label: text("label").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});
