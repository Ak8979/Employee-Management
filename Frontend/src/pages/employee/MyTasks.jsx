import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CheckSquare, Send, RefreshCw, X, Play } from "lucide-react";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null);
  const [submissionReport, setSubmissionReport] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/tasks/my-tasks");
      setTasks(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await axiosClient.put(`/tasks/${taskId}/submit`, {
        status: "IN_PROGRESS",
        submissionReport: "Task started by employee.",
      });
      fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to start task.");
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!submitModal || !submissionReport.trim()) return;
    setSubmitting(true);
    try {
      await axiosClient.put(`/tasks/${submitModal.id}/submit`, {
        status: "SUBMITTED",
        submissionReport: submissionReport.trim(),
      });
      setSubmitModal(null);
      setSubmissionReport("");
      fetchTasks();
    } catch (err) {
      alert(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Assigned Tasks & Deliverables
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            View delegated work, update development progress, and submit deliverables for managerial review.
          </p>
        </div>

        <button
          onClick={fetchTasks}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Tasks</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading task deliverables...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
            No active deliverables currently assigned to your profile.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-100 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      task.priority === "URGENT"
                        ? "bg-rose-100 text-rose-800"
                        : task.priority === "HIGH"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "SUBMITTED"
                        ? "bg-purple-100 text-purple-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-500">
                  Due: <strong className="text-slate-800">{task.dueDate || "Flexible"}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                {task.description && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {task.submissionReport && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Your Submission Report:</span>
                  <p className="text-slate-600 italic whitespace-pre-wrap">{task.submissionReport}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Assigned by Management
                </span>

                <div className="flex items-center gap-2">
                  {task.status === "PENDING" && (
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-all"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Working</span>
                    </button>
                  )}

                  {task.status !== "COMPLETED" && (
                    <button
                      onClick={() => {
                        setSubmitModal(task);
                        setSubmissionReport(task.submissionReport || "");
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>{task.status === "SUBMITTED" ? "Update Report" : "Submit Report"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Work Deliverable</h3>
                <p className="text-xs text-slate-500 mt-0.5">{submitModal.title}</p>
              </div>
              <button onClick={() => setSubmitModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Deliverable Summary / Work Report *
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="Detail the work completed, links to repositories, PRs, documents, or testing results..."
                  value={submissionReport}
                  onChange={(e) => setSubmissionReport(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {submitting ? "Submitting..." : "Send to Manager"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
