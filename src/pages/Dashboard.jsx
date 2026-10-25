import { useMemo, useState } from "react";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import Avatar from "../component/ui/Avatar";

const initialEmployees = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@peoplehub.com",
    department: "Engineering",
    role: "ADMIN",
    status: "Active",
    joiningDate: "2025-02-12",
    salary: 85000,
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya@peoplehub.com",
    department: "Human Resources",
    role: "HR",
    status: "Active",
    joiningDate: "2025-04-08",
    salary: 65000,
  },
  {
    id: 3,
    name: "Rohan Gupta",
    email: "rohan@peoplehub.com",
    department: "Engineering",
    role: "EMPLOYEE",
    status: "Active",
    joiningDate: "2025-06-17",
    salary: 72000,
  },
  {
    id: 4,
    name: "Ananya Singh",
    email: "ananya@peoplehub.com",
    department: "Marketing",
    role: "EMPLOYEE",
    status: "On leave",
    joiningDate: "2025-08-21",
    salary: 58000,
  },
  {
    id: 5,
    name: "Kabir Mehta",
    email: "kabir@peoplehub.com",
    department: "Finance",
    role: "EMPLOYEE",
    status: "Active",
    joiningDate: "2025-09-03",
    salary: 61000,
  },
];

const navigation = [
  { label: "Dashboard", icon: "▦" },
  { label: "Employees", icon: "♙" },
  { label: "Departments", icon: "▤" },
  { label: "Reports", icon: "▥" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Dashboard({
  user = {
    name: "Aarav Sharma",
    email: "aarav@peoplehub.com",
    role: "ADMIN",
  },
  onLogout = () => {},
  onOpenProfile = () => {},
  onAddEmployee = () => {},
  onEditEmployee = () => {},
  employees: employeeData,
}) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const employees = employeeData ?? initialEmployees;

  const isAdmin = user.role === "ADMIN";
  const isHR = user.role === "HR";
  const canViewDirectory = isAdmin || isHR;

  const departments = useMemo(
    () => [
      ...new Set(
        employees.map((employee) => employee.department).filter(Boolean),
      ),
    ],
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.name,
        employee.email,
        employee.department,
        employee.role,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );

      const matchesDepartment =
        department === "All departments" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const totalSalary = employees.reduce(
    (sum, employee) => sum + Number(employee.salary || 0),
    0,
  );

  const stats = [
    {
      label: "Total employees",
      value: employees.length.toLocaleString("en-IN"),
      icon: "♙",
      color: "bg-indigo-50 text-indigo-600",
      note: "Registered employee records",
    },
    {
      label: "Departments",
      value: departments.length.toLocaleString("en-IN"),
      icon: "▤",
      color: "bg-sky-50 text-sky-600",
      note: "Across the organization",
    },
    {
      label: "Active employees",
      value: employees
        .filter((employee) => employee.status === "Active")
        .length.toLocaleString("en-IN"),
      icon: "✓",
      color: "bg-emerald-50 text-emerald-600",
      note: "Currently marked active",
    },
    {
      label: "Listed payroll",
      value: formatCurrency(totalSalary),
      icon: "₹",
      color: "bg-amber-50 text-amber-600",
      note: "Sum of sample salary records",
    },
  ];

  function handleNavigation(label) {
    setActivePage(label);
    setMobileMenuOpen(false);

    if (label === "Employees") {
      document
        .getElementById("employee-directory")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
            P
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              People<span className="text-indigo-600">Hub</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400">
              PEOPLE MANAGEMENT
            </p>
          </div>

          <button
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-400">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation
              .filter((item) => {
                if (!canViewDirectory) {
                  return item.label === "Dashboard";
                }

                return item.label !== "Reports" || isAdmin;
              })
              .map((item) => {
                const active = activePage === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}>
                    <span className="flex h-6 w-6 items-center justify-center text-lg">
                      {item.icon}
                    </span>
                    {item.label}
                    {item.label === "Employees" && (
                      <span
                        className={`ml-auto rounded-md px-2 py-0.5 text-xs ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                        {employees.length}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              ✦
            </div>
            <p className="text-sm font-bold text-slate-800">People first</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Keep your team's information organized in one workspace.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {initials(user.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>

            <button
              title="Sign out"
              aria-label="Sign out"
              onClick={onLogout}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation">
              ☰
            </button>

            <div>
              <p className="hidden text-[10px] font-bold tracking-[0.2em] text-slate-400 sm:block">
                PEOPLEHUB / WORKSPACE
              </p>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:inline-flex">
              {user.role}
            </span>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:border-indigo-200 hover:bg-indigo-50">
              <span>⚙</span>
              <span className="hidden sm:inline">My Profile</span>
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
              {initials(user.name)}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
          {/* Welcome section */}
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {isAdmin
                  ? "Good to see you, Admin 👋"
                  : isHR
                    ? "Your people, all in one place 👋"
                    : `Welcome back, ${user.name.split(" ")[0]} 👋`}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {canViewDirectory
                  ? "Here's what's happening across your organization."
                  : "Your personal workspace is ready."}
              </p>
            </div>

            {isAdmin && (
              <Button
                variant="primary"
                onClick={onAddEmployee}
                className="shrink-0">
                + Add employee
              </Button>
            )}
          </section>

          {/* Stats */}
          {canViewDirectory && (
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </p>
                      <h3 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-slate-900">
                        {stat.value}
                      </h3>
                    </div>

                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${stat.color}`}>
                      {stat.icon}
                    </span>
                  </div>

                  <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    {stat.note}
                  </p>
                </article>
              ))}
            </section>
          )}

          {/* Directory */}
          {canViewDirectory ? (
            <section
              id="employee-directory"
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6 sm:py-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Employee directory
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage and review your workforce information.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}>
                  ↻ Refresh
                </Button>
              </div>

              {/* Search and filters */}
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="w-full sm:max-w-md">
                  <Input
                    name="employeeSearch"
                    aria-label="Search employees"
                    placeholder="Search name, email, department..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  aria-label="Filter by department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                  <option>All departments</option>
                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-slate-400 sm:ml-auto">
                  {filteredEmployees.length} result
                  {filteredEmployees.length === 1 ? "" : "s"}
                </p>
              </div>

              {/* Responsive table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-bold tracking-widest text-slate-400">
                      <th className="px-6 py-4">EMPLOYEE</th>
                      <th className="px-5 py-4">DEPARTMENT</th>
                      <th className="px-5 py-4">JOINED</th>
                      <th className="px-5 py-4">SALARY</th>
                      <th className="px-5 py-4">ROLE</th>
                      <th className="px-5 py-4">STATUS</th>
                      {isAdmin && (
                        <th className="px-6 py-4 text-right">ACTION</th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={employee.name} size="md" />

                            <div>
                              <p className="whitespace-nowrap text-sm font-bold text-slate-800">
                                {employee.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {employee.department}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                          {employee.joiningDate || "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">
                          {formatCurrency(Number(employee.salary || 0))}
                        </td>

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                            {employee.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                              employee.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                employee.status === "Active"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {employee.status || "Active"}
                          </span>
                        </td>

                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <button
                              aria-label={`Edit ${employee.name}`}
                              onClick={() => onEditEmployee(employee)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}

                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td
                          colSpan={isAdmin ? 7 : 6}
                          className="px-6 py-16 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                            ⌕
                          </div>
                          <p className="font-semibold text-slate-700">
                            No employees found
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Try another name or change the department filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p>
                  Showing {filteredEmployees.length} of {employees.length}{" "}
                  employees
                </p>
                <p>PeopleHub Workforce Management</p>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
                ✓
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Your workspace is ready
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                You are signed in as an employee. Open your profile to review
                your account information or contact HR for assistance.
              </p>
              <Button
                variant="primary"
                onClick={onOpenProfile}
                className="mt-5">
                View my profile
              </Button>
            </section>
          )}

          <footer className="mt-8 flex flex-col justify-between gap-2 pb-4 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} PeopleHub</p>
            <p>Built for better teamwork.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
