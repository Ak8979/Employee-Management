import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CalendarCheck, Calendar, Filter, RefreshCw } from "lucide-react";

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = { date: selectedDate };
      if (selectedDept) params.departmentId = selectedDept;
      const data = await axiosClient.get("/attendance/daily", { params });
      setLogs(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await axiosClient.get("/departments");
      setDepartments(data);
    } catch (ignored) {}
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedDept]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Logs & Audit
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor daily check-in times, departure hours, work modes, and punctualities.
          </p>
        </div>
      </div>

      {/* Date & Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 font-medium"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchAttendance}
          className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No check-in records found for {selectedDate}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Check-In</th>
                  <th className="p-4">Check-Out</th>
                  <th className="p-4">Work Mode</th>
                  <th className="p-4">Remarks</th>
                  <th className="p-4 text-right">Punctuality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-semibold text-slate-900">
                      {log.employeeName}
                      <span className="block text-[10px] font-mono text-indigo-600">
                        {log.employeeCode}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{log.departmentName || "—"}</td>
                    <td className="p-4 text-slate-600">{log.attendanceDate}</td>
                    <td className="p-4 font-mono font-bold text-indigo-700">
                      {log.checkInTime || "—"}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {log.checkOutTime || "Active / In Shift"}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {log.workMode}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{log.remarks || "—"}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          log.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {log.status}
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
