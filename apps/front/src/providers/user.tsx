"use client";

import { getMe } from "@/services/user";
import { User } from "@/types/user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: User | null;
  setUserContext: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUserContext: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getMe()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserContext: setUser }}>
      {children}
    </UserContext.Provider>
  );
};
