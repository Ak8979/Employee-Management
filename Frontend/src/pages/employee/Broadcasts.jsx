import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Megaphone, RefreshCw } from "lucide-react";

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBroadcasts = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/announcements");
      setBroadcasts(data);
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Announcements & Broadcasts
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Official communications, policy updates, and executive messages from management.
          </p>
        </div>

        <button
          onClick={fetchBroadcasts}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading broadcast feed...</span>
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
            No company announcements currently posted.
          </div>
        ) : (
          broadcasts.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    b.priority === "URGENT"
                      ? "bg-rose-100 text-rose-800"
                      : b.priority === "IMPORTANT"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {b.priority}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  {new Date(b.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{b.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {b.message}
              </p>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Scope: {b.targetDepartmentName}</span>
                <span>Sent by Management</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
