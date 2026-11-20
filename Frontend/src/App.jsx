import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManage from "./pages/admin/EmployeeManage";
import AttendanceLogs from "./pages/admin/AttendanceLogs";
import LeaveApprovals from "./pages/admin/LeaveApprovals";
import TaskManagement from "./pages/admin/TaskManagement";
import WarningManagement from "./pages/admin/WarningManagement";
import BroadcastSender from "./pages/admin/BroadcastSender";

// HR Pages
import HrDashboard from "./pages/hr/HrDashboard";
import HrEmployees from "./pages/hr/HrEmployees";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyIdCard from "./pages/employee/MyIdCard";
import MyAttendance from "./pages/employee/MyAttendance";
import MyLeaves from "./pages/employee/MyLeaves";
import MyTasks from "./pages/employee/MyTasks";
import Broadcasts from "./pages/employee/Broadcasts";
import MyProfile from "./pages/employee/MyProfile";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ROLE_ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "ROLE_HR") return <Navigate to="/hr" replace />;
  return <Navigate to="/employee" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route (No Public Register) */}
          <Route path="/login" element={<Login />} />

          {/* Root dynamic redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* ============================================================
              1. ADMIN PORTAL (Strictly Restricted to ROLE_ADMIN)
             ============================================================ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManage />} />
            <Route path="attendance" element={<AttendanceLogs />} />
            <Route path="leaves" element={<LeaveApprovals />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="warnings" element={<WarningManagement />} />
            <Route path="broadcasts" element={<BroadcastSender />} />
          </Route>

          {/* ============================================================
              2. HR MANAGER PORTAL (ROLE_HR and ROLE_ADMIN)
             ============================================================ */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["ROLE_HR", "ROLE_ADMIN"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HrDashboard />} />
            <Route path="employees" element={<HrEmployees />} />
            <Route path="attendance" element={<AttendanceLogs />} />
            <Route path="leaves" element={<LeaveApprovals />} />
            <Route path="tasks" element={<TaskManagement />} />
          </Route>

          {/* ============================================================
              3. EMPLOYEE WORKSPACE (ROLE_EMPLOYEE, ROLE_HR, ROLE_ADMIN)
             ============================================================ */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_HR", "ROLE_ADMIN"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="id-card" element={<MyIdCard />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="leaves" element={<MyLeaves />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="broadcasts" element={<Broadcasts />} />
            <Route path="profile" element={<MyProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
