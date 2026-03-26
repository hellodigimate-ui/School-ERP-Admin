"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Award,
  Star,
  DollarSign,
  UserX,
  Building2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";


interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems :NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/hrPanel/dashboard" },
  { label: "Staff Directory", icon: Users, path: "/hrPanel/staffDirectory" },
  { label: "Staff Attendance", icon: CalendarCheck, path: "/hrPanel/staffAttendance" },
  { label: "Leave Management", icon: ClipboardCheck, path: "/hrPanel/leaveApproval" },
  { label: "Designations", icon: Building2, path: "/hrPanel/designations" },
  { label: "Departments", icon: FileText, path: "/hrPanel/department" },
  { label: "Teacher Ratings", icon: Star, path: "/hrPanel/teacherRating" },
  { label: "Disabled Staff", icon: UserX, path: "/hrPanel/disabledStaff" },
  { label: "Payroll", icon: DollarSign, path: "/hrPanel/payroll" },
  { label: "Awards & Recognition", icon: Award, path: "/hrPanel/awards" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname.startsWith(path);

  return (
    <aside
      className={`sticky top-0 left-0 h-screen z-50
      ${collapsed ? "w-[80px]" : "w-[270px]"}
      bg-sidebar
      text-sidebar-foreground flex flex-col shadow-lg
      transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <h2 className="font-bold text-lg">HR Panel</h2>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent/30 transition"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg border-l-4 border-sidebar-primary"
                  : "hover:bg-sidebar-accent/30"
              }`}
            >
              <Icon className="w-5 h-5" />

              {!collapsed && (
                <span className="flex-1">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
              HR
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">HR Manager</p>
              <p className="text-xs opacity-80">hr@school.edu</p>
            </div>
            <LogOut onClick={handleLogout} className="w-4 h-4 cursor-pointer hover:text-red-500" />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;