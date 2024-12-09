import { Router } from "express";
import { getPortfolioEvolution, getPortfolioOverview } from "./service";

const portfolioRouter = Router();

portfolioRouter.get("/overview", async (req, res) => {
  const { user } = res.locals.session;

  const portfolioOverview = await getPortfolioOverview(user.id);

  res.send(portfolioOverview);
});

portfolioRouter.get("/evolution", async (req, res) => {
  const { user } = res.locals.session;

  const portfolioEvolution = await getPortfolioEvolution(user.id);

  res.send({ portfolioEvolution });
});

export default portfolioRouter;
