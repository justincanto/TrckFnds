import { getAccounts, getConnectionUrl } from "./service";
import { createRouter } from "../../utils/create-router";
import { User } from "../db/schema";

const bankRouter = createRouter();

bankRouter.get("/connection-url", async (req, res) => {
  const { query } = req;
  const user = req.user!;

  const connectionUrl = await getConnectionUrl(user, Number(query.connectorId));

  res.send({ connectionUrl });
});

bankRouter.get("/accounts", async (req, res) => {
  const user = req.user!;

  const accounts = await getAccounts(user.id);

  res.send({ accounts });
});

export default bankRouter;
