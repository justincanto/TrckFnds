import {
  getPortfolioEvolution,
  getPortfolioOverview,
  getRevenueAndExpensesByMonth,
} from "./service";
import { createRouter } from "../../utils/create-router";
import { createEthereumWalletConnection } from "../crypto/services/ethereum";
import { User } from "../db/schema";
import { createBinanceWalletConnection } from "../crypto/services/binance";
import { createBitcoinWalletConnection } from "../crypto/services/bitcoin";
import { TimeRange } from "@trckfnds/shared";

const portfolioRouter = createRouter();

portfolioRouter.get("/overview", async (req, res) => {
  const user = req.user!;

  const portfolioOverview = await getPortfolioOverview(user.id);

  res.send(portfolioOverview);
});

portfolioRouter.get("/evolution", async (req, res) => {
  const user = req.user!;
  const timeRange = (req.query.timeRange as TimeRange) || TimeRange.MONTH;

  const portfolioEvolution = await getPortfolioEvolution(user.id, timeRange);

  res.send({ portfolioEvolution });
});

portfolioRouter.post("/connect/ethereum-wallet", async (req, res) => {
  const user = req.user!;

  const { name, address, blockchains } = req.body;

  const connection = await createEthereumWalletConnection(
    user,
    name,
    address,
    blockchains
  );

  res.send(connection);
});

portfolioRouter.post("/connect/bitcoin-wallet", async (req, res) => {
  const user = req.user!;

  const { name, addresses } = req.body;

  const connection = await createBitcoinWalletConnection(user, name, addresses);

  res.send(connection);
});

portfolioRouter.post("/connect/binance", async (req, res) => {
  const user = req.user!;

  const { name, apiKey, secretKey } = req.body;

  const connection = await createBinanceWalletConnection(
    user,
    name,
    apiKey,
    secretKey
  );

  res.send(connection);
});

portfolioRouter.get("/revenues-expenses/evolution", async (req, res) => {
  const user = req.user!;

  const revenuesAndExpensesByMonth = await getRevenueAndExpensesByMonth(
    user.id
  );

  res.send(revenuesAndExpensesByMonth);
});

export default portfolioRouter;
