import { createContext, useContext, useState, useEffect } from "react";
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

// ─── Token helpers ────────────────────────────────────────────────
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function decodeTokenPayload(token: string): { sub?: string; role?: string } {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// ─── Provider ────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on mount — bootstrapping

  // ── Bootstrap: restore session from localStorage on app load ──
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = localStorage.getItem("access_token");
        const storedRefresh = localStorage.getItem("refresh_token");

        if (!stored || !storedRefresh) return;

        // If access token is still valid, restore session from it
        if (!isTokenExpired(stored)) {
          const payload = decodeTokenPayload(stored);
          if (payload.sub) {
            setAccessToken(stored);
            setSession({
              id: 0,  // Will be 0 until next login, acceptable for session restore
              accessToken: stored,
              refreshToken: storedRefresh,
              tokenType: "bearer",
              username: payload.sub,
              role: (payload as any).role ?? "unknown",
            });
            return;
          }
        }

        // Access token expired — attempt silent refresh
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: storedRefresh }),
          }
        );

        if (!res.ok) {
          // Refresh failed — clear tokens, user must re-login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return;
        }

        const data = await res.json();
        const newAccess: string = data.access_token;
        const newRefresh: string = data.refresh_token;

        setAccessToken(newAccess);
        localStorage.setItem("refresh_token", newRefresh);

        const payload = decodeTokenPayload(newAccess);
        setSession({
          id: 0,
          accessToken: newAccess,
          refreshToken: newRefresh,
          tokenType: "bearer",
          username: payload.sub ?? "",
          role: data.role ?? (payload as any).role ?? "unknown",
        });
      } catch {
        // Network error during bootstrap — fail gracefully
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  // ── Login ────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res: LoginResponseDTO = await authApi.login({ email, password });
      const { auth, user } = res.data;

      setAccessToken(auth.access_token);
      localStorage.setItem("refresh_token", auth.refresh_token);

      setSession({
        id: user.id,
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token,
        tokenType: auth.token_type,
        username: user.username,
        role: user.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ───────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      localStorage.removeItem("refresh_token");
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
