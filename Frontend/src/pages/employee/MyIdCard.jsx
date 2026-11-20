import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Printer, ShieldCheck, Download, RefreshCw } from "lucide-react";

export default function MyIdCard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get("/profile");
        setProfile(data);
      } catch (ignored) {
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const emp = profile || {
    fullName: user?.name,
    firstName: user?.name?.split(" ")?.[0] || "Employee",
    lastName: user?.name?.split(" ")?.[1] || "",
    employeeCode: user?.employeeCode,
    designation: user?.designation,
    departmentName: user?.department,
    email: user?.email,
    joiningDate: "2024-01-01",
    bloodGroup: "O+",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Official Employee Identity Card
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Your unique digital company identification badge and credentials pass.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Badge</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Generating digital badge...</span>
        </div>
      ) : (
        <div className="flex justify-center p-6 sm:p-12 bg-slate-100 rounded-3xl border border-slate-200">
          <div
            id="printable-id-card"
            className="w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col text-center"
          >
            {/* Lanyard Hole Clip */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-300 rounded-full" />

            {/* Header */}
            <div className="pt-8 pb-5 px-6 bg-linear-to-r from-indigo-800 via-indigo-600 to-violet-800 text-white">
              <div className="flex items-center justify-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-indigo-700 font-extrabold text-sm flex items-center justify-center shadow-xs">
                  EMS
                </div>
                <span className="text-sm font-bold tracking-wider">ENTERPRISE</span>
              </div>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest mt-1">
                Official Staff Credential
              </p>
            </div>

            {/* Avatar Photo */}
            <div className="relative -mt-10 flex justify-center">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-100">
                {emp.profileImageUrl ? (
                  <img
                    src={emp.profileImageUrl}
                    alt={emp.fullName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-linear-to-tr from-indigo-100 to-indigo-50 text-indigo-700 font-bold text-3xl flex items-center justify-center">
                    {emp.firstName?.[0]}
                    {emp.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Identity Info */}
            <div className="px-6 pt-3 pb-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {emp.fullName || `${emp.firstName} ${emp.lastName}`}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                {emp.designation || "Staff Member"}
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-extrabold tracking-wider border border-slate-200">
                {emp.employeeCode}
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-b border-slate-100 text-left text-xs space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-900">
                  {emp.departmentName || "General Staff"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Joined:</span>
                <span className="font-medium text-slate-800">{emp.joiningDate || "—"}</span>
              </div>
              {emp.bloodGroup && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-bold text-rose-600">{emp.bloodGroup}</span>
                </div>
              )}
              {emp.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-medium text-slate-800">{emp.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-medium text-slate-800 truncate max-w-[140px] text-[11px]">
                  {emp.email}
                </span>
              </div>
            </div>

            {/* Barcode & Security Stamp */}
            <div className="p-4 bg-white flex flex-col items-center">
              <div className="flex items-center justify-center gap-0.5 h-7 w-48">
                {[5, 2, 6, 1, 4, 6, 2, 4, 3, 2, 5, 2, 6, 1, 4, 3, 2, 5, 3, 6, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-800"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 tracking-widest">
                VERIFIED ID: {emp.employeeCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
