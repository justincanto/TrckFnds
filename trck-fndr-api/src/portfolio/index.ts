import { getPortfolioEvolution, getPortfolioOverview } from "./service";
import { createRouter } from "../../utils/create-router";
import {
  createEthereumWalletConnection,
  createBitcoinWalletConnection,
  createBinanceWalletConnection,
} from "../crypto/service";
import { User } from "../db/schema";

const portfolioRouter = createRouter();

portfolioRouter.get("/overview", async (req, res) => {
  const user = res.locals.session.user as User;

  const portfolioOverview = await getPortfolioOverview(user.id);

  res.send(portfolioOverview);
});

portfolioRouter.get("/evolution", async (req, res) => {
  const { user } = res.locals.session;

  const portfolioEvolution = await getPortfolioEvolution(user.id);

  res.send({ portfolioEvolution });
});

portfolioRouter.post("/connect/ethereum-wallet", async (req, res) => {
  const user = res.locals.session.user as User;

  const { name, address, blockchains } = req.body;

  const connection = await createEthereumWalletConnection(
    user,
    name,
    address,
    blockchains
    // tokens
  );

  res.send(connection);
});

portfolioRouter.post("/connect/bitcoin-wallet", async (req, res) => {
  const user = res.locals.session.user as User;

  const { name, addresses } = req.body;

  const connection = await createBitcoinWalletConnection(user, name, addresses);

  res.send(connection);
});

portfolioRouter.post("/connect/binance", async (req, res) => {
  const user = res.locals.session.user as User;

  const { name, apiKey, secretKey } = req.body;

  const connection = await createBinanceWalletConnection(
    user,
    name,
    apiKey,
    secretKey
  );

  res.send(connection);
});

export default portfolioRouter;
