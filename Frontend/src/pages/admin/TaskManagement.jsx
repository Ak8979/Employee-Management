import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CheckSquare, Plus, RefreshCw, X, AlertCircle } from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [viewReportModal, setViewReportModal] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedToEmployeeId: "",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/tasks/all");
      setTasks(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await axiosClient.get("/employees");
      setEmployees(data);
      if (data.length > 0 && !form.assignedToEmployeeId) {
        setForm((prev) => ({ ...prev, assignedToEmployeeId: data[0].id }));
      }
    } catch (ignored) {}
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axiosClient.post("/tasks", {
        ...form,
        assignedToEmployeeId: Number(form.assignedToEmployeeId),
      });
      setCreateModal(false);
      setForm({
        title: "",
        description: "",
        assignedToEmployeeId: employees[0]?.id || "",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      });
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to create task.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Task Delegation & Work Tracking
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Assign deliverables to staff members, set deadlines, and inspect submission reports.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading task board...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No tasks assigned yet. Click "Assign New Task" to delegate work.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Task Deliverable</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Submission Report</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 leading-tight">{t.title}</p>
                      {t.description && (
                        <p className="text-xs text-slate-500 mt-0.5 max-w-sm line-clamp-2">
                          {t.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-800">{t.assignedToName}</span>
                      <span className="block text-[10px] font-mono text-indigo-600">
                        {t.assignedToCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          t.priority === "URGENT"
                            ? "bg-rose-100 text-rose-800"
                            : t.priority === "HIGH"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{t.dueDate || "—"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "SUBMITTED"
                            ? "bg-purple-100 text-purple-800"
                            : t.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      {t.submissionReport ? (
                        <button
                          onClick={() => setViewReportModal(t)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold"
                        >
                          View Report
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not submitted</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {t.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleStatusChange(t.id, "COMPLETED")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Mark Complete
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

      {/* Assign Task Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Delegate New Task</h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Payment Gateway Architecture"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Assign To Employee *
                </label>
                <select
                  required
                  value={form.assignedToEmployeeId}
                  onChange={(e) => setForm({ ...form, assignedToEmployeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
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
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Detailed Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Outline expected deliverables, references, and acceptance criteria..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {formLoading ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Report Viewer Modal */}
      {viewReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Task Submission Report</h3>
                <p className="text-xs text-slate-500">
                  {viewReportModal.title} — Submitted by {viewReportModal.assignedToName}
                </p>
              </div>
              <button onClick={() => setViewReportModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
              {viewReportModal.submissionReport}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setViewReportModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              {viewReportModal.status !== "COMPLETED" && (
                <button
                  onClick={() => {
                    handleStatusChange(viewReportModal.id, "COMPLETED");
                    setViewReportModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Approve & Complete Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
