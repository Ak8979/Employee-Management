import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Users, CalendarCheck, CalendarOff, CheckSquare, RefreshCw, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function HrDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/dashboard/stats");
      setStats(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-purple-800 via-purple-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-purple-100 mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>HR Operations Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome, {user?.name}!
        </h2>
        <p className="text-sm text-purple-100 mt-1">
          Review employee attendance, approve leave requests, and manage day-to-day staff assignments.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Workforce
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats?.totalEmployees ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Checked-In Today
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">
            {stats?.checkedInToday ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Leaves
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">
            {stats?.pendingLeaves ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Tasks
          </span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-600">
            {stats?.openTasks ?? 0}
          </div>
        </div>
      </div>

      {/* Today's Check-ins Feed */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Today's Staff Check-In Log</span>
          </h3>
          <Link to="/hr/attendance" className="text-xs font-semibold text-purple-600 hover:underline">
            View Full Log
          </Link>
        </div>

        {stats?.todayCheckIns?.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No check-ins recorded yet today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Check-In</th>
                  <th className="pb-3">Check-Out</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.todayCheckIns?.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 font-medium text-slate-900">
                      {item.employeeName}
                      <span className="block text-[10px] font-mono text-slate-400">
                        {item.employeeCode}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{item.departmentName || "—"}</td>
                    <td className="py-2.5 font-mono font-semibold text-purple-700">
                      {item.checkInTime || "—"}
                    </td>
                    <td className="py-2.5 font-mono text-slate-500">
                      {item.checkOutTime || "Active"}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
