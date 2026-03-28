"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { UserProfile } from "@/types";
import {
  fetchCurrentUser,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
} from "@/lib/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (nickname: string, password: string) => Promise<string | null>;
  register: (nickname: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await fetchCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (nickname: string, password: string) => {
    const result = await apiLogin(nickname, password);
    if ("error" in result) return result.error;
    setUser(result.user);
    return null;
  }, []);

  const register = useCallback(async (nickname: string, password: string) => {
    const result = await apiRegister(nickname, password);
    if ("error" in result) return result.error;
    setUser(result.user);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
