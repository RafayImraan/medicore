import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setUserRole(userData.role);
    setPoints(userData.points || 0);
    setToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUserRole(null);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        return newToken;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  const getAuthHeaders = async () => {
    let currentToken = token;
    // Add token refresh logic here if needed
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${currentToken}`,
    };
  };

  return (
    <AuthContext.Provider value={{
      userRole,
      user,
      token,
      points,
      setPoints,
      login,
      logout,
      refreshAccessToken,
      getAuthHeaders,
      setUserRole,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
