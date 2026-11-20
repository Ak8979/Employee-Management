import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { CheckCircle2, XCircle, Clock, CalendarOff, RefreshCw } from "lucide-react";

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewComment, setReviewComment] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let data;
      if (filter === "PENDING") {
        data = await axiosClient.get("/leaves/pending");
      } else {
        data = await axiosClient.get("/leaves/all");
      }
      setLeaves(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const handleDecision = async (status) => {
    if (!reviewModal) return;
    setActionLoading(true);
    try {
      await axiosClient.put(`/leaves/${reviewModal.id}/review`, {
        status,
        reviewComment: reviewComment.trim(),
      });
      setReviewModal(null);
      setReviewComment("");
      fetchLeaves();
    } catch (err) {
      alert(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave Approvals & Scheduling
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review submitted leave applications, approve scheduled time-off, or reject requests with feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === "PENDING"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All History
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading requests...</span>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No leave requests found in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Total Days</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-semibold text-slate-900">
                      {l.employeeName}
                      <span className="block text-[10px] font-mono text-indigo-600">
                        {l.employeeCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {l.startDate} <span className="text-slate-400">to</span> {l.endDate}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {l.totalDays} {l.totalDays === 1 ? "day" : "days"}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs">{l.reason}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          l.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : l.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {l.status}
                      </span>
                      {l.reviewComment && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          "{l.reviewComment}"
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {l.status === "PENDING" ? (
                        <button
                          onClick={() => setReviewModal(l)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900">Review Leave Request</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {reviewModal.employeeName} ({reviewModal.employeeCode}) — {reviewModal.totalDays} day(s)
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
              <span className="font-semibold text-slate-900">Reason:</span> {reviewModal.reason}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Reviewer Remark / Note (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Approved, enjoy your leave / Project deadline pending"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision("REJECTED")}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDecision("APPROVED")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Approve Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
