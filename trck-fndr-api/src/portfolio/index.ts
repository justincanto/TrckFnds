import { Router } from "express";
import { getPortfolioOverview } from "./service";

const portfolioRouter = Router();

portfolioRouter.get("/overview", async (req, res) => {
  const { user } = res.locals.session;

  const portfolioOverview = await getPortfolioOverview(user.id);

  res.send(portfolioOverview);
});

export default portfolioRouter;
