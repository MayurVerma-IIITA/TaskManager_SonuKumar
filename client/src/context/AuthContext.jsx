import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios.js";
import { getMeRequest } from "../api/auth.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "task_manager_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rehydrate = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMeRequest();
        setUser(data.user);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    rehydrate();
  }, []);

  const login = (authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      loading,
      getErrorMessage: getApiErrorMessage
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
