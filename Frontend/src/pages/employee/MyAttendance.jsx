import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CalendarCheck, RefreshCw } from "lucide-react";

export default function MyAttendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/attendance/my-history");
      setHistory(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Attendance History
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Log of your daily check-in and check-out timestamps, shift hours, and punctuality records.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading attendance log...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No attendance history recorded yet. Check in on your dashboard to log attendance.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Check-In Time</th>
                  <th className="p-4">Check-Out Time</th>
                  <th className="p-4">Work Mode</th>
                  <th className="p-4">Remarks</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-semibold text-slate-900">{item.attendanceDate}</td>
                    <td className="p-4 font-mono font-bold text-indigo-700">
                      {item.checkInTime || "—"}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {item.checkOutTime || "Active / In Shift"}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {item.workMode}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{item.remarks || "—"}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
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
