import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import IdCardModal from "../../components/IdCardModal";
import { Search, CreditCard, Edit, RefreshCw, X, CheckCircle2 } from "lucide-react";

export default function HrEmployees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [idCardEmployee, setIdCardEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/employees", { params: { query: searchQuery } });
      setEmployees(data);
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
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axiosClient.put(`/employees/${editEmployee.id}`, {
        firstName: editEmployee.firstName,
        lastName: editEmployee.lastName,
        phone: editEmployee.phone,
        designation: editEmployee.designation,
        departmentId: editEmployee.departmentId ? Number(editEmployee.departmentId) : null,
      });
      setMsg("Employee details updated.");
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.message || "Failed to update employee.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Staff Directory & Records
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            View employee profiles, generate official ID badges, and update department info.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {msg}
          </span>
          <button onClick={() => setMsg("")} className="text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, code or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
            <span>Loading staff list...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department & Title</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {emp.fullName}
                          </p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                          <span className="font-mono text-[10px] text-purple-600 font-bold">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{emp.designation}</p>
                      <p className="text-xs text-slate-500">{emp.departmentName || "General"}</p>
                    </td>
                    <td className="p-4 text-slate-600">{emp.joiningDate || "—"}</td>
                    <td className="p-4 text-slate-600">{emp.phone || "—"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setIdCardEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                          title="View Identity Badge"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                          title="Edit Basic Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {idCardEmployee && (
        <IdCardModal
          employee={idCardEmployee}
          onClose={() => setIdCardEmployee(null)}
        />
      )}

      {editEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit {editEmployee.fullName}</h3>
              <button onClick={() => setEditEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={editEmployee.designation || ""}
                  onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Department
                </label>
                <select
                  value={editEmployee.departmentId || ""}
                  onChange={(e) => setEditEmployee({ ...editEmployee, departmentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={editEmployee.phone || ""}
                  onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditEmployee(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
