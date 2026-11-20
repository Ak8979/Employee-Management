import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { AlertTriangle, Plus, CheckCircle2, RefreshCw, X, ShieldAlert } from "lucide-react";

export default function WarningManagement() {
  const [warnings, setWarnings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    title: "",
    reason: "",
    severity: "MEDIUM",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchWarnings = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/warnings/all");
      setWarnings(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await axiosClient.get("/employees");
      setEmployees(data);
      if (data.length > 0 && !form.employeeId) {
        setForm((prev) => ({ ...prev, employeeId: data[0].id }));
      }
    } catch (ignored) {}
  };

  useEffect(() => {
    fetchEmployees();
    fetchWarnings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axiosClient.post("/warnings", {
        ...form,
        employeeId: Number(form.employeeId),
      });
      setCreateModal(false);
      setForm({
        employeeId: employees[0]?.id || "",
        title: "",
        reason: "",
        severity: "MEDIUM",
      });
      fetchWarnings();
    } catch (err) {
      alert(err.message || "Failed to issue warning.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axiosClient.patch(`/warnings/${id}/resolve`);
      fetchWarnings();
    } catch (err) {
      alert(err.message || "Failed to resolve warning.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Disciplinary Warnings & Performance Tracking
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Log official warnings for poor performance, attendance violations, or policy infractions.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Issue Warning Notice</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
            <span>Loading warning history...</span>
          </div>
        ) : warnings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No disciplinary notices recorded. The workforce is compliant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Notice Title</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Reason / Notes</th>
                  <th className="p-4">Issued By</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warnings.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900">{w.employeeName}</span>
                      <span className="block text-[10px] font-mono text-rose-600 font-bold">
                        {w.employeeCode}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{w.title}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          w.severity === "CRITICAL"
                            ? "bg-rose-200 text-rose-900 border border-rose-300"
                            : w.severity === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : w.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {w.severity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-sm">{w.reason}</td>
                    <td className="p-4 text-slate-500 text-xs">{w.issuedByName}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          w.status === "ACTIVE"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {w.status === "ACTIVE" && (
                        <button
                          onClick={() => handleResolve(w.id)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Warning Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Issue Formal Warning
              </h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Employee *
                </label>
                <select
                  required
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeCode}) — {emp.departmentName || "General"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Warning Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Repeated Absenteeism"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:bg-white font-semibold"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Reason & Disciplinary Notes *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain why this notice is being issued and what improvement is required..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {formLoading ? "Recording..." : "Issue Warning"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
