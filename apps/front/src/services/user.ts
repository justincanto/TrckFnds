import { User } from "@/types/user";
import axios from "axios";

export const getMe = async () => {
  return (
    await axios.get<User>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
      withCredentials: true,
    })
  ).data;
};
