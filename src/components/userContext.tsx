// userContext.tsx
"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface User {
  npsn: string;
  password: string;
}

const UserContext = createContext<[User | null, (user: User | null) => void]>([null, () => {}]);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
