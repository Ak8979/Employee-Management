import { useAuth } from "../context/AuthContext";
import { LogOut, User as UserIcon, Shield, Briefcase, Award } from "lucide-react";

export default function Navbar({ portalTitle }) {
  const { user, logout, role } = useAuth();

  const getRoleBadge = () => {
    if (role === "ROLE_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
          <Shield className="w-3 h-3" /> ADMIN
        </span>
      );
    }
    if (role === "ROLE_HR") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
          <Award className="w-3 h-3" /> HR MANAGER
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <Briefcase className="w-3 h-3" /> EMPLOYEE
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Portal Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            EMS
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Employee Management System
            </h1>
            <p className="text-xs text-indigo-600 font-medium">{portalTitle}</p>
          </div>
        </div>

        {/* User Details & Action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || user?.email}
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              {user?.employeeCode && (
                <span className="text-xs font-mono text-slate-500">
                  {user.employeeCode}
                </span>
              )}
              {getRoleBadge()}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
