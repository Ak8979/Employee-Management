import { useEffect, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Alert from "./ui/Alert";
import Avatar from "./ui/Avatar";

const emptyEmployee = {
  name: "",
  email: "",
  password: "",
  gender: "",
  department: "",
  role: "EMPLOYEE",
  salary: "",
  joiningDate: "",
  address: "",
};

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "IT Support",
];

function EmployeeForm({ employee = null, onSubmit, onClose, loading = false }) {
  const [form, setForm] = useState(emptyEmployee);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = Boolean(employee);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        // Never populate a password from the employee response.
        password: "",
        gender: employee.gender || "",
        department: employee.department || "",
        role: employee.role || "EMPLOYEE",
        salary: employee.salary ?? "",
        joiningDate: employee.joiningDate || "",
        address: employee.address || "",
      });
    } else {
      setForm(emptyEmployee);
    }

    setError("");
    setSuccess("");
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const address = form.address.trim();

    if (
      !name ||
      !email ||
      !form.gender ||
      !form.department ||
      !form.joiningDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isEditing && !form.password.trim()) {
      setError("Please enter an initial password for the employee.");
      return;
    }

    if (!isEditing && form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (
      form.salary === "" ||
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) < 0
    ) {
      setError("Please enter a valid, non-negative salary.");
      return;
    }

    if (new Date(form.joiningDate) > new Date()) {
      setError("Joining date cannot be in the future.");
      return;
    }

    const employeeData = {
      name,
      email,
      department: form.department,
      salary: Number(form.salary),
      gender: form.gender,
      address,
      joiningDate: form.joiningDate,
      role: form.role,
      // Send the password only when creating an employee.
      ...(!isEditing ? { password: form.password } : {}),
    };
    try {
      if (typeof onSubmit !== "function") {
        setSuccess("Form validation successful. Connect onSubmit to save.");
        return;
      }

      await onSubmit(employeeData);
    } catch (submitError) {
      setError(
        submitError?.message || "Unable to save employee. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose?.();
        }
      }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 px-6 py-6 text-white sm:px-8">
          <div className="absolute -right-8 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                {isEditing ? (
                  <Avatar name={form.name || "Employee"} size="lg" />
                ) : (
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14m-7-7h14"
                    />
                  </svg>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                  Employee management
                </p>
                <h2
                  id="employee-form-title"
                  className="text-2xl font-bold tracking-tight">
                  {isEditing ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  {isEditing
                    ? "Update employee information and details."
                    : "Add a new member to your organization."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close form"
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18 6-12 12M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable form area */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="overflow-y-auto px-6 py-6 sm:px-8">
            {error && (
              <div className="mb-5">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            {success && (
              <div className="mb-5">
                <Alert variant="success">{success}</Alert>
              </div>
            )}

            {/* Personal details */}
            <div className="mb-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 21v-2a7 7 0 0 1 14 0v2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Personal details</h3>
                  <p className="text-xs text-slate-500">
                    Basic employee information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Full name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  required
                />

                <Input
                  label="Email address *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />

                {!isEditing && (
                  <Input
                    label="Initial Password *"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter initial password (min. 8 characters)"
                    required
                  />
                )}

                <div>
                  <label
                    htmlFor="employee-gender"
                    className="mb-2 block text-sm font-semibold text-slate-700">
                    Gender *
                  </label>

                  <select
                    id="employee-gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10">
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="employee-address"
                    className="mb-2 block text-sm font-semibold text-slate-700">
                    Address
                  </label>
                  <textarea
                    id="employee-address"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter employee's address"
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="mb-7 border-t border-slate-100" />

            {/* Employment details */}
            <div className="mb-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true">
                    <rect x="3" y="7" width="18" height="14" rx="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V4h8v3M3 12h18"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    Employment details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Department, role and compensation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="employee-department"
                    className="mb-2 block text-sm font-semibold text-slate-700">
                    Department *
                  </label>
                  <select
                    id="employee-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10">
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="employee-role"
                    className="mb-2 block text-sm font-semibold text-slate-700">
                    System role
                  </label>
                  <select
                    id="employee-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10">
                    <option value="EMPLOYEE">Employee</option>
                    <option value="HR">HR</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Controls the employee's access permissions.
                  </p>
                </div>

                <Input
                  label="Monthly salary (₹) *"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  required
                />

                <Input
                  label="Joining date *"
                  name="joiningDate"
                  type="date"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Fields marked with * are required.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="hidden text-xs text-slate-500 sm:block">
              Please verify all details before saving.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="justify-center">
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="justify-center">
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Employee"}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EmployeeForm;
