import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  CalendarCheck,
  CalendarX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await axiosClient.get("/dashboard/stats");
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
        <span>Loading live statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time workforce monitoring, daily check-in attendance, and operations overview.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Primary Workforce Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Employees
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.totalEmployees ?? 0}
            </span>
            <span className="text-xs text-slate-400">Headcount</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {stats?.activeEmployees ?? 0}
            </span>
            <span className="text-xs text-emerald-700 font-medium">On Payroll</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ex-Employees (Old)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-700">
              {stats?.inactiveEmployees ?? 0}
            </span>
            <span className="text-xs text-slate-400">Archived/Left</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Restricted / Blocked
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">
              {stats?.restrictedEmployees ?? 0}
            </span>
            <span className="text-xs text-rose-500 font-medium">Restricted</span>
          </div>
        </div>
      </div>

      {/* Today's Daily Attendance Pulse */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Today's Real-Time Attendance Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {stats?.checkedInToday ?? 0}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Checked-In Today
              </p>
              <p className="text-xs text-emerald-600">Present at work / online</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {stats?.notCheckedInToday ?? 0}
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                Not Checked-In (Absent)
              </p>
              <p className="text-xs text-rose-600">Pending or missing check-in</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {stats?.onLeaveToday ?? 0}
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">
                On Approved Leave
              </p>
              <p className="text-xs text-indigo-600">Scheduled leave today</p>
            </div>
          </div>
        </div>

        {/* Operational Attention Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-600">Pending Leave Approvals</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {stats?.pendingLeaves ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-600">Active Warnings Issued</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {stats?.activeWarnings ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-600">Open Ongoing Tasks</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {stats?.openTasks ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Check-ins Feed + Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Check-in Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Today's Check-In Feed & Timestamps</span>
            </h3>
            <span className="text-xs text-slate-400">
              {stats?.todayCheckIns?.length || 0} entries recorded
            </span>
          </div>

          {stats?.todayCheckIns?.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
              No employees have checked in yet today.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Check-In Time</th>
                    <th className="pb-3">Check-Out</th>
                    <th className="pb-3">Mode</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.todayCheckIns?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-medium text-slate-900">
                        {item.employeeName}
                        <span className="block text-[10px] font-mono text-slate-400">
                          {item.employeeCode}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{item.departmentName || "—"}</td>
                      <td className="py-3 font-mono font-semibold text-indigo-600">
                        {item.checkInTime || "—"}
                      </td>
                      <td className="py-3 font-mono text-slate-500">
                        {item.checkOutTime || "Still working"}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {item.workMode}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === "PRESENT"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "LATE"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
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

        {/* Department Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Department Headcount</span>
          </h3>

          <div className="space-y-3">
            {stats?.departmentCounts &&
              Object.entries(stats.departmentCounts).map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-xs font-semibold text-slate-700">{name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-indigo-700 border border-slate-200 shadow-2xs">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
