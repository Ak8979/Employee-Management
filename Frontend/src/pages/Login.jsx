import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ShieldAlert, ArrowRight, Shield, Award, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "ROLE_ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "ROLE_HR") {
        navigate("/hr", { replace: true });
      } else {
        navigate("/employee", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 bg-linear-to-b from-indigo-50/70 to-transparent border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md shadow-indigo-200">
            EMS
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to EMS Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter your employee credentials to access your designated workspace.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("admin@ems.com", "admin123")}
                className="p-2 text-center rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-medium text-slate-700 flex flex-col items-center gap-1"
              >
                <Shield className="w-4 h-4 text-rose-500" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("hr@ems.com", "hr123")}
                className="p-2 text-center rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-medium text-slate-700 flex flex-col items-center gap-1"
              >
                <Award className="w-4 h-4 text-purple-500" />
                <span>HR Manager</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("rohit@ems.com", "emp123")}
                className="p-2 text-center rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-medium text-slate-700 flex flex-col items-center gap-1"
              >
                <User className="w-4 h-4 text-emerald-500" />
                <span>Employee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
