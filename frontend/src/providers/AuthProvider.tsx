import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { readMyKeyApiV1ClientMeGet } from "@/client/sdk.gen";
import type { ApiMeResponse } from "@/client/types.gen";

interface AuthContextType {
  user: ApiMeResponse | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user: null, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const [user, setUser] = useState<ApiMeResponse | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("apiKey");
    if (!token) {
      setStatus("denied");
      return;
    }

    setStatus("loading");
    readMyKeyApiV1ClientMeGet().then(({ data, error }) => {
      if (error || !data) {
        localStorage.removeItem("apiKey");
        setStatus("denied");
      } else {
        setUser(data);
        setStatus("ok");
      }
    });
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground animate-pulse">Verifying access...</div>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
