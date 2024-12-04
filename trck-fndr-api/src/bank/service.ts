import axios from "axios";
import { db } from "../db";
import { bankConnection } from "../db/schema";
import { eq } from "drizzle-orm";

export const getConnectionUrl = async (userId: string) => {
  //find the user's access token if it exists or create and store it
  const userBankConnection = await db
    .select()
    .from(bankConnection)
    .where(eq(bankConnection.userId, userId));

  const accessToken =
    userBankConnection[0]?.accessToken ||
    (await createAndStoreUserAccessToken(userId));

  //then get the temporary code
  const {
    data: { code },
  } = await axios.get(`${process.env.POWENS_BASE_URL}/auth/token/code`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  //and return the webview url
  return `https://webview.powens.com/connect?domain=trckfnds-sandbox.biapi.pro&client_id=${process.env.POWENS_CLIENT_ID}&redirect_uri=http://localhost:3000/bank-connection/success&code=${code}`;
};

export const getAccounts = async (userId: string) => {
  const userBankConnection = await db
    .select()
    .from(bankConnection)
    .where(eq(bankConnection.userId, userId));

  const accounts = await axios.get(
    `${process.env.POWENS_BASE_URL}/users/me/accounts`,
    {
      headers: {
        Authorization: `Bearer ${userBankConnection[0].accessToken}`,
      },
    }
  );

  return accounts.data;
};

const createAndStoreUserAccessToken = async (userId: string) => {
  const {
    data: { auth_token },
  } = await axios.post(`${process.env.POWENS_BASE_URL}/auth/init`, {
    client_id: process.env.POWENS_CLIENT_ID,
    client_secret: process.env.POWENS_CLIENT_SECRET,
  });

  await db.insert(bankConnection).values({ accessToken: auth_token, userId });

  return auth_token;
};
