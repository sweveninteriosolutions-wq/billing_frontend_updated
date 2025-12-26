import { createContext, useContext, useState } from "react";
import * as authApi from "@/api/auth.api";
import { AuthSession, LoginResponseDTO } from "@/types/auth";
import { setAccessToken } from "@/api/client";

type AuthContextType = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res: LoginResponseDTO = await authApi.login({ email, password });

      const { auth, user } = res.data;

      // 🔑 attach token to API client
      setAccessToken(auth.access_token);

      // 🔄 normalized session
      const nextSession: AuthSession = {
        id: user.id,                 // ✅ FIX
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token,
        tokenType: auth.token_type,
        username: user.username,
        role: user.role,
      };

      setSession(nextSession);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
