import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  CheckCircle,
  LogIn,
  LogOut,
  CreditCard,
  AlertTriangle,
  Megaphone,
  CheckSquare,
  CalendarOff,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todayRes, tasksRes, annRes, warnRes] = await Promise.all([
        axiosClient.get("/attendance/today").catch(() => null),
        axiosClient.get("/tasks/my-tasks").catch(() => []),
        axiosClient.get("/announcements").catch(() => []),
        axiosClient.get("/warnings/my-warnings").catch(() => []),
      ]);
      setTodayStatus(todayRes);
      setTasks(tasksRes);
      setAnnouncements(annRes);
      setWarnings(warnRes);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (workMode = "OFFICE") => {
    setActionLoading(true);
    try {
      const res = await axiosClient.post("/attendance/check-in", {
        workMode,
        remarks: "Checked in via web portal",
      });
      setTodayStatus(res);
    } catch (err) {
      alert(err.message || "Failed to check in.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await axiosClient.post("/attendance/check-out");
      setTodayStatus(res);
    } catch (err) {
      alert(err.message || "Failed to check out.");
    } finally {
      setActionLoading(false);
    }
  };

  const activeWarnings = warnings.filter((w) => w.status === "ACTIVE");

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-indigo-100 mb-2">
              <span>Employee Portal</span> • <span>{user?.employeeCode}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-lg">
              {user?.designation} • {user?.department || "General Staff"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/employee/id-card"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-2xl text-xs sm:text-sm shadow-md transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital ID Card</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Disciplinary Warning Banner (If Any) */}
      {activeWarnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 shadow-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-rose-900">
              Notice: You have {activeWarnings.length} active disciplinary warning(s) on your profile.
            </p>
            <p className="text-rose-700 mt-0.5">
              "{activeWarnings[0].title}" — {activeWarnings[0].reason}
            </p>
          </div>
        </div>
      )}

      {/* Today's Check-In / Check-Out Widget */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Attendance Pulse
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-mono font-extrabold text-slate-900">
                {currentTime}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {todayStatus ? (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Checked In at {todayStatus.checkInTime}
                  </span>
                  {todayStatus.checkOutTime ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      Checked Out at {todayStatus.checkOutTime}
                    </span>
                  ) : (
                    <span className="text-indigo-600 font-semibold">Shift in progress</span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  You haven't checked in yet today.
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!todayStatus ? (
              <>
                <button
                  onClick={() => handleCheckIn("OFFICE")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Check In (Office)</span>
                </button>
                <button
                  onClick={() => handleCheckIn("REMOTE")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
                >
                  <span>Work from Home</span>
                </button>
              </>
            ) : !todayStatus.checkOutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Check Out & End Shift</span>
              </button>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600">
                Shift completed for today. Good job!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Broadcasts from Admin & My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcasts from Admin */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600" />
              <span>Broadcasts from Admin</span>
            </h3>
            <Link to="/employee/broadcasts" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {announcements.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No new announcements broadcasted.
            </p>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        a.priority === "URGENT"
                          ? "bg-rose-100 text-rose-800"
                          : a.priority === "IMPORTANT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {a.priority}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{a.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{a.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks Overview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Assigned Deliverables ({tasks.filter(t => t.status !== "COMPLETED").length})</span>
            </h3>
            <Link to="/employee/tasks" className="text-xs font-semibold text-indigo-600 hover:underline">
              Task Workspace
            </Link>
          </div>

          {tasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No tasks currently assigned to you.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 3).map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        t.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.status === "SUBMITTED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Due: {t.dueDate || "Flexible"}</span>
                    <span className="font-semibold text-indigo-600">{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
