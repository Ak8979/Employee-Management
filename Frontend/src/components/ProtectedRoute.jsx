import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-indigo-600 font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their own panel according to their role
    if (user.role === "ROLE_ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "ROLE_HR") {
      return <Navigate to="/hr" replace />;
    } else {
      return <Navigate to="/employee" replace />;
    }
  }

  return children;
}
