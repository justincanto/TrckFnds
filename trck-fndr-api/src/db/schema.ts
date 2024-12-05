import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/express/adapters";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { Blockchain, Crypto } from "../crypto/types";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

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

export const ethWalletConnection = pgTable("ethWalletConnection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  name: text("name").notNull(),
  blockchains: BlockchainEnum()
    .$type<Blockchain[]>()
    .array()
    .default(sql`'{"ethereum"}'::blockchain_enum[]`)
    .notNull(),
});

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

export const erc20TokenInWallet = pgTable("ethTokenInWallet", {
  walletId: text("walletId").references(() => ethWalletConnection.id),
  tokenId: text("tokenId").references(() => erc20Token.id),
});
