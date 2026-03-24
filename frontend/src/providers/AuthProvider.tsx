import { useEffect, useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { readMyKeyApiV1ClientMeGet } from "@/client/sdk.gen";
import type { ApiMeResponse } from "@/client/types.gen";

interface AuthContextType {
  user: ApiMeResponse | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("apiKey");
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("apiKey");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await readMyKeyApiV1ClientMeGet();
      if (error || !data) {
        logout();
      } else {
        setUser(data);
      }
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refreshUser }}>
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
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground animate-pulse">Verifying access...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
