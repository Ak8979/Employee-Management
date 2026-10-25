import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EmployeeForm from "./component/EmployeeForm";

import { AUTH_URL, EMPLOYEE_URL, apiRequest } from "./services/api";

const PROFILE_URL = "http://localhost:8080/api/profile";

function getRole(token, responseData) {
  if (responseData?.role) {
    return responseData.role.replace("ROLE_", "");
  }

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(normalized));
    const roles = claims.roles || claims.authorities || [];
    const list = Array.isArray(roles) ? roles : [roles];

    return (
      list
        .map((item) => String(item).replace("ROLE_", ""))
        .find((item) => ["ADMIN", "HR", "EMPLOYEE"].includes(item)) ||
      "EMPLOYEE"
    );
  } catch {
    return "EMPLOYEE";
  }
}

function readSavedSession() {
  return {
    token: localStorage.getItem("employeeToken") || "",
    role: localStorage.getItem("employeeRole") || "EMPLOYEE",
    email: localStorage.getItem("employeeEmail") || "",
  };
}

function ProtectedRoute({ token, children }) {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(readSavedSession);
  const [user, setUser] = useState(() => ({
    name: "",
    email: localStorage.getItem("employeeEmail") || "",
    role: localStorage.getItem("employeeRole") || "EMPLOYEE",
    department: "",
    address: "",
    joiningDate: "",
  }));

  const [employees, setEmployees] = useState([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const isAdmin = session.role === "ADMIN";
  const isHR = session.role === "HR";
  const canViewEmployees = isAdmin || isHR;

  const logout = useCallback(() => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeRole");
    localStorage.removeItem("employeeEmail");

    setSession({ token: "", role: "EMPLOYEE", email: "" });
    setUser({
      name: "",
      email: "",
      role: "EMPLOYEE",
      department: "",
      address: "",
      joiningDate: "",
    });
    setEmployees([]);
    setEmployeeFormOpen(false);
    setSelectedEmployee(null);
    setPageError("");

    navigate("/login", { replace: true });
  }, [navigate]);

  // Handle expired sessions reported by api.js.
  useEffect(() => {
    const handleSessionExpired = () => logout();

    window.addEventListener("employee-session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "employee-session-expired",
        handleSessionExpired,
      );
    };
  }, [logout]);

  // Keep the current route consistent with authentication state.
  useEffect(() => {
    if (session.token && location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }

    if (
      !session.token &&
      ["/dashboard", "/profile"].includes(location.pathname)
    ) {
      navigate("/login", { replace: true });
    }
  }, [session.token, location.pathname, navigate]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setPageError("");

    try {
      const result = await apiRequest(`${AUTH_URL}/login`, {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      if (!result?.accessToken) {
        throw new Error("Login response did not contain an access token.");
      }

      const role = getRole(result.accessToken, result);
      const email = credentials.email.trim();

      localStorage.setItem("employeeToken", result.accessToken);
      localStorage.setItem("employeeRole", role);
      localStorage.setItem("employeeEmail", email);

      setSession({
        token: result.accessToken,
        role,
        email,
      });

      setUser((previous) => ({
        ...previous,
        email,
        role,
      }));

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setPageError(error.message || "Login failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setPageError("");

    try {
      await apiRequest(`${AUTH_URL}/register`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          address: formData.address || "",
          joiningDate: formData.joiningDate,
          department: formData.department,
          salary: Number(formData.salary),
        }),
      });

      navigate("/login", {
        replace: true,
        state: { registrationSuccess: true },
      });
    } catch (error) {
      setPageError(error.message || "Registration failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = useCallback(async () => {
    if (!session.token) return;

    const result = await apiRequest(PROFILE_URL, {}, session.token);

    setUser({
      ...result,
      email: result.email || session.email,
      role: result.role || session.role,
    });
  }, [session.token, session.email, session.role]);

  const loadEmployees = useCallback(async () => {
    if (!session.token || !canViewEmployees) return;

    setLoading(true);
    setPageError("");

    try {
      const result = await apiRequest(EMPLOYEE_URL, {}, session.token);

      setEmployees(Array.isArray(result) ? result : result?.content || []);
    } catch (error) {
      setPageError(error.message || "Could not load employees.");
    } finally {
      setLoading(false);
    }
  }, [session.token, canViewEmployees]);

  useEffect(() => {
    if (
      session.token &&
      location.pathname === "/dashboard" &&
      canViewEmployees
    ) {
      loadEmployees();
    }
  }, [session.token, location.pathname, canViewEmployees, loadEmployees]);

  useEffect(() => {
    if (session.token && location.pathname === "/profile") {
      loadProfile().catch((error) => {
        setPageError(error.message || "Could not load profile.");
      });
    }
  }, [session.token, location.pathname, loadProfile]);

  const openAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeFormOpen(true);
  };

  const openEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeFormOpen(true);
  };

  const saveEmployee = async (employeeData) => {
    if (!isAdmin) {
      throw new Error("Only an administrator can modify employee records.");
    }

    setLoading(true);
    setPageError("");

    try {
      const editing = Boolean(selectedEmployee?.id);

      const payload = {
        name: employeeData.name.trim(),
        email: employeeData.email.trim().toLowerCase(),
        gender: employeeData.gender,
        address: employeeData.address || "",
        department: employeeData.department,
        joiningDate: employeeData.joiningDate,
        salary: Number(employeeData.salary),
      };

    
      

      if (!editing) {
        if (!employeeData.password) {
          throw new Error(
            "An initial password field is required to create an employee account.",
          );
        }

        payload.password = employeeData.password;
      }

      const url = editing
        ? `${EMPLOYEE_URL}/${selectedEmployee.id}`
        : EMPLOYEE_URL;

      await apiRequest(
        url,
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
        session.token,
      );

      setEmployeeFormOpen(false);
      setSelectedEmployee(null);
      await loadEmployees();
    } catch (error) {
      setPageError(error.message || "Could not save employee.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData) => {
    const result = await apiRequest(
      PROFILE_URL,
      {
        method: "PUT",
        body: JSON.stringify({
          name: profileData.name,
          address: profileData.address,
        }),
      },
      session.token,
    );

    setUser((previous) => ({ ...previous, ...result }));
  };

  const changePassword = async (passwordData) => {
    await apiRequest(
      `${PROFILE_URL}/password`,
      {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      },
      session.token,
    );
  };

  return (
    <>
      {pageError && (
        <div className="fixed right-4 top-4 z-[100] max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          {pageError}
          <button
            type="button"
            className="ml-3 font-bold"
            onClick={() => setPageError("")}
            aria-label="Dismiss error">
            ✕
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={session.token ? "/dashboard" : "/login"} replace />
          }
        />

        <Route
          path="/login"
          element={
            session.token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onLogin={handleLogin}
                onRegister={handleRegister}
                loading={loading}
                error={pageError}
              />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={session.token}>
              <Dashboard
                user={user}
                employees={employees}
                onLogout={logout}
                onOpenProfile={() => navigate("/profile")}
                onAddEmployee={openAddEmployee}
                onEditEmployee={openEditEmployee}
                onRefresh={loadEmployees}
                loading={loading}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute token={session.token}>
              <Profile
                user={user}
                onBack={() => navigate("/dashboard")}
                onSaveProfile={saveProfile}
                onChangePassword={changePassword}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={session.token ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>

      {employeeFormOpen && isAdmin && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={saveEmployee}
          onClose={() => {
            if (!loading) {
              setEmployeeFormOpen(false);
              setSelectedEmployee(null);
            }
          }}
          loading={loading}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
