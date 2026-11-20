import { X, Printer, ShieldCheck, Mail, Phone, Calendar, Droplets } from "lucide-react";

export default function IdCardModal({ employee, onClose }) {
  if (!employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Official Identity Badge
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-all text-xs flex items-center gap-1"
              title="Print Badge"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable ID Card Container */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-id-card"
            className="w-72 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative flex flex-col text-center"
          >
            {/* Lanyard Slot simulation */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-300 rounded-full" />

            {/* Header Banner */}
            <div className="pt-6 pb-4 px-4 bg-linear-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-white text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                  EMS
                </div>
                <span className="text-xs font-bold tracking-wider">ENTERPRISE</span>
              </div>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest mt-0.5">
                Employee Identification
              </p>
            </div>

            {/* Photo Avatar */}
            <div className="relative -mt-8 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
                {employee.profileImageUrl ? (
                  <img
                    src={employee.profileImageUrl}
                    alt={employee.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-linear-to-tr from-indigo-100 to-indigo-50 text-indigo-700 font-bold text-2xl flex items-center justify-center">
                    {employee.firstName?.[0]}
                    {employee.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="px-4 pt-3 pb-2">
              <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                {employee.fullName || `${employee.firstName} ${employee.lastName}`}
              </h4>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                {employee.designation || "Staff Member"}
              </p>
              <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                {employee.employeeCode}
              </div>
            </div>

            {/* Details Grid */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-b border-slate-100 text-left text-[11px] space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">
                  {employee.departmentName || "General"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Joined:</span>
                <span className="font-medium text-slate-700">{employee.joiningDate || "—"}</span>
              </div>
              {employee.bloodGroup && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-bold text-rose-600">{employee.bloodGroup}</span>
                </div>
              )}
              {employee.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-700">{employee.phone}</span>
                </div>
              )}
            </div>

            {/* Barcode / Auth Footer */}
            <div className="p-3 bg-white flex flex-col items-center">
              {/* Simulated barcode */}
              <div className="flex items-center justify-center gap-0.5 h-6 w-44">
                {[4, 2, 5, 1, 3, 6, 2, 4, 3, 1, 5, 2, 4, 1, 6, 3, 2, 5, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-800"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1 tracking-widest">
                AUTH-{employee.employeeCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
