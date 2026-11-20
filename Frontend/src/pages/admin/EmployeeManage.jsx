import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import IdCardModal from "../../components/IdCardModal";
import {
  UserPlus,
  Search,
  Filter,
  CreditCard,
  Edit,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";

export default function EmployeeManage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [idCardEmployee, setIdCardEmployee] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Form State
  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    departmentId: "",
    designation: "",
    salary: "",
    joiningDate: new Date().toISOString().split("T")[0],
    address: "",
    emergencyContact: "",
    bloodGroup: "O+",
    role: "ROLE_EMPLOYEE",
  };
  const [createForm, setCreateForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (selectedDept) params.departmentId = selectedDept;
      if (selectedStatus) params.status = selectedStatus;

      const data = await axiosClient.get("/employees", { params });
      setEmployees(data);
    } catch (err) {
      setError(err.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await axiosClient.get("/departments");
      setDepartments(data);
      if (data.length > 0 && !createForm.departmentId) {
        setCreateForm((prev) => ({ ...prev, departmentId: data[0].id }));
      }
    } catch (ignored) {}
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery, selectedDept, selectedStatus]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...createForm,
        departmentId: Number(createForm.departmentId),
        salary: createForm.salary ? Number(createForm.salary) : 0,
      };
      const created = await axiosClient.post("/employees", payload);
      setSuccess(`Employee created successfully with ID: ${created.employeeCode}`);
      setCreateModalOpen(false);
      setCreateForm(initialForm);
      fetchEmployees();
    } catch (err) {
      setError(err.message || "Failed to create employee.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        firstName: editEmployee.firstName,
        lastName: editEmployee.lastName,
        phone: editEmployee.phone,
        designation: editEmployee.designation,
        salary: Number(editEmployee.salary),
        status: editEmployee.status,
        departmentId: editEmployee.departmentId ? Number(editEmployee.departmentId) : null,
      };
      await axiosClient.put(`/employees/${editEmployee.id}`, payload);
      setSuccess("Employee updated successfully.");
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message || "Failed to update employee.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete employee "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await axiosClient.delete(`/employees/${id}`);
      setSuccess(`Employee deleted successfully.`);
      fetchEmployees();
    } catch (err) {
      setError(err.message || "Failed to delete employee.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employee Directory & Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Administer employee accounts, issue unique credentials, view ID cards, and update status.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateModalOpen(true);
            setError("");
            setSuccess("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {success}
          </span>
          <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee code, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive (Ex-Employee)</option>
          <option value="RESTRICTED">Restricted</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading directory...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No employees found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department & Role</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Warnings</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {emp.fullName}
                          </p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                          <span className="font-mono text-[10px] text-indigo-600 font-bold">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{emp.designation}</p>
                      <p className="text-xs text-slate-500">{emp.departmentName || "Unassigned"}</p>
                    </td>
                    <td className="p-4 text-slate-600">{emp.joiningDate || "—"}</td>
                    <td className="p-4 font-mono font-medium text-slate-800">
                      ₹{Number(emp.salary || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {emp.warningCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          {emp.warningCount} Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          emp.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : emp.status === "RESTRICTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setIdCardEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Generate & View ID Card"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          title="Edit Details & Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.fullName)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ID Card Modal */}
      {idCardEmployee && (
        <IdCardModal
          employee={idCardEmployee}
          onClose={() => setIdCardEmployee(null)}
        />
      )}

      {/* Create Employee Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Employee</h3>
                <p className="text-xs text-slate-500">
                  Unique Employee ID (e.g. EMP-1003) will be automatically generated.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Initial Password (Optional, default: emp123)
                  </label>
                  <input
                    type="text"
                    placeholder="emp123"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={createForm.departmentId}
                    onChange={(e) => setCreateForm({ ...createForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
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
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={createForm.designation}
                    onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    System Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="ROLE_EMPLOYEE">Employee</option>
                    <option value="ROLE_HR">HR Manager</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="65000"
                    value={createForm.salary}
                    onChange={(e) => setCreateForm({ ...createForm, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.joiningDate}
                    onChange={(e) => setCreateForm({ ...createForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Gender *
                  </label>
                  <select
                    value={createForm.gender}
                    onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543211"
                    value={createForm.emergencyContact}
                    onChange={(e) => setCreateForm({ ...createForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={createForm.bloodGroup}
                    onChange={(e) => setCreateForm({ ...createForm, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows="2"
                  placeholder="Street, City, Pin Code"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 flex items-center gap-2"
                >
                  {formLoading ? "Creating..." : "Save & Generate ID"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit {editEmployee.fullName}
                </h3>
                <p className="text-xs font-mono text-indigo-600">{editEmployee.employeeCode}</p>
              </div>
              <button
                onClick={() => setEditEmployee(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={editEmployee.designation || ""}
                  onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={editEmployee.departmentId || ""}
                    onChange={(e) => setEditEmployee({ ...editEmployee, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
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
                    Account Status
                  </label>
                  <select
                    value={editEmployee.status || "ACTIVE"}
                    onChange={(e) => setEditEmployee({ ...editEmployee, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE (Normal)</option>
                    <option value="INACTIVE">INACTIVE (Ex-Employee)</option>
                    <option value="RESTRICTED">RESTRICTED (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={editEmployee.salary || ""}
                    onChange={(e) => setEditEmployee({ ...editEmployee, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editEmployee.phone || ""}
                    onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditEmployee(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200"
                >
                  {formLoading ? "Saving..." : "Update Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
