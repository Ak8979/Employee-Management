import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  CheckSquare,
  AlertTriangle,
  Megaphone,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/employees", label: "Employees", icon: Users },
    { to: "/admin/attendance", label: "Attendance Logs", icon: CalendarCheck },
    { to: "/admin/leaves", label: "Leave Approvals", icon: CalendarOff },
    { to: "/admin/tasks", label: "Task Delegation", icon: CheckSquare },
    { to: "/admin/warnings", label: "Disciplinary Warnings", icon: AlertTriangle },
    { to: "/admin/broadcasts", label: "Announcements", icon: Megaphone },
  ];

  const hrLinks = [
    { to: "/hr", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/hr/employees", label: "Employees", icon: Users },
    { to: "/hr/attendance", label: "Attendance Logs", icon: CalendarCheck },
    { to: "/hr/leaves", label: "Leave Approvals", icon: CalendarOff },
    { to: "/hr/tasks", label: "Task Assignments", icon: CheckSquare },
  ];

  const employeeLinks = [
    { to: "/employee", label: "Dashboard & Check-In", icon: LayoutDashboard, end: true },
    { to: "/employee/id-card", label: "Digital ID Card", icon: CreditCard },
    { to: "/employee/attendance", label: "Attendance History", icon: CalendarCheck },
    { to: "/employee/leaves", label: "Leave Requests", icon: CalendarOff },
    { to: "/employee/tasks", label: "Assigned Tasks", icon: CheckSquare },
    { to: "/employee/broadcasts", label: "Announcements", icon: Megaphone },
    { to: "/employee/profile", label: "My Profile", icon: UserCheck },
  ];

  let links = employeeLinks;
  if (role === "ROLE_ADMIN") links = adminLinks;
  if (role === "ROLE_HR") links = hrLinks;

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0">
      <div className="p-4 lg:p-6 space-y-1 overflow-x-auto lg:overflow-visible flex lg:flex-col gap-1 lg:gap-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
