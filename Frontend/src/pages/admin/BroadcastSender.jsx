import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Megaphone, Plus, RefreshCw, X, Radio } from "lucide-react";

export default function BroadcastSender() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "NORMAL",
    targetDepartmentId: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchBroadcasts = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/announcements/all");
      setBroadcasts(data);
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
    fetchBroadcasts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axiosClient.post("/announcements", {
        ...form,
        targetDepartmentId: form.targetDepartmentId ? Number(form.targetDepartmentId) : null,
      });
      setCreateModal(false);
      setForm({
        title: "",
        message: "",
        priority: "NORMAL",
        targetDepartmentId: "",
      });
      fetchBroadcasts();
    } catch (err) {
      alert(err.message || "Failed to publish broadcast.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Broadcasts & Announcements
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Publish official company-wide messages or targeted department notifications.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <Megaphone className="w-4 h-4" />
          <span>Publish Broadcast</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading announcements...</span>
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No announcements broadcasted yet.
          </div>
        ) : (
          broadcasts.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      b.priority === "URGENT"
                        ? "bg-rose-100 text-rose-800"
                        : b.priority === "IMPORTANT"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {b.priority}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {b.targetDepartmentName || "All Departments"}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(b.createdAt).toLocaleString()}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 tracking-tight">{b.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {b.message}
              </p>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Broadcasted by Administrator
              </p>
            </div>
          ))
        )}
      </div>

      {/* Publish Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-600" />
                New Broadcast Announcement
              </h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Company Townhall on Friday"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Audience Scope
                  </label>
                  <select
                    value={form.targetDepartmentId}
                    onChange={(e) => setForm({ ...form, targetDepartmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="">All Departments (Company-wide)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} Only
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Announcement Body *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Type the message to be displayed on all employee dashboards..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                  {formLoading ? "Publishing..." : "Publish Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
