import { getAccounts, getConnectionUrl } from "./service";
import { createRouter } from "../../utils/create-router";

const bankRouter = createRouter();

bankRouter.get("/connection-url", async (req, res) => {
  const { user } = res.locals.session;

  const connectionUrl = await getConnectionUrl(user.id);

  res.send({ connectionUrl });
});

bankRouter.get("/accounts", async (req, res) => {
  const { user } = res.locals.session;

  const accounts = await getAccounts(user.id);

  res.send({ accounts });
});

export default bankRouter;
