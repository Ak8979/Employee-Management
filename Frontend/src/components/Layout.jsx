import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { role } = useAuth();

  const getPortalTitle = () => {
    if (role === "ROLE_ADMIN") return "Admin Control Center";
    if (role === "ROLE_HR") return "Human Resources Panel";
    return "Employee Workspace";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar portalTitle={getPortalTitle()} />
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
