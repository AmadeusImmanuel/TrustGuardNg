import { createContext, useContext, useEffect, useState } from "react";
import { auth, clearToken } from "../api/base44Client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]                         = useState(null);
  const [isLoadingAuth, setIsLoadingAuth]       = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError]               = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tg_token");
    if (!token) { setIsLoadingAuth(false); return; }
    auth.me()
      .then((u) => { setUser(u); setAuthError(null); })
      .catch(() => { clearToken(); setUser(null); })
      .finally(() => setIsLoadingAuth(false));
  }, []);

  const login = async (email, password) => {
    const u = await auth.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (email, password, full_name, phone) => {
    const u = await auth.register(email, password, full_name, phone);
    setUser(u);
    return u;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  const navigateToLogin = () => { window.location.href = "/login"; };

  return (
    <AuthContext.Provider value={{
      user,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      login,
      register,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
