import axios from "axios";

export const logout = async () => {
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
};
