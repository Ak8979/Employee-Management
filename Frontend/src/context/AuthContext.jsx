import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ems_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ems_token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ems_token");
    const savedUser = localStorage.getItem("ems_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await axiosClient.post("/auth/login", { email, password });
    const userData = {
      userId: data.userId,
      employeeId: data.employeeId,
      employeeCode: data.employeeCode,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      designation: data.designation,
      status: data.status,
    };

    localStorage.setItem("ems_token", data.token);
    localStorage.setItem("ems_user", JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setToken("");
    setUser(null);
  };

  const updateUserProfile = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem("ems_user", JSON.stringify(updated));
      return updated;
    });
  };

  const role = user?.role || "";
  const isAdmin = role === "ROLE_ADMIN";
  const isHr = role === "ROLE_HR";
  const isEmployee = role === "ROLE_EMPLOYEE";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUserProfile,
        isAdmin,
        isHr,
        isEmployee,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
