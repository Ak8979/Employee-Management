import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CalendarOff, Plus, RefreshCw, X } from "lucide-react";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/leaves/my-leaves");
      setLeaves(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axiosClient.post("/leaves/apply", form);
      setModalOpen(false);
      setForm({
        leaveType: "CASUAL",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      alert(err.message || "Failed to submit leave request.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave Applications & Time-Off
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit time-off requests, track approval status, and view manager feedback.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading leave history...</span>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            You haven't submitted any leave requests yet. Click "Apply for Leave" above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Days</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Manager Feedback</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                        {item.leaveType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {item.startDate} <span className="text-slate-400">to</span> {item.endDate}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {item.totalDays} {item.totalDays === 1 ? "day" : "days"}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs">{item.reason}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      {item.reviewComment ? `"${item.reviewComment}"` : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
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

      {/* Apply Leave Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Apply for Time-Off</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Leave Category *
                </label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="SICK">Sick Leave (Medical)</option>
                  <option value="PAID">Earned / Paid Leave (PL)</option>
                  <option value="UNPAID">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide brief context for management..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {formLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
