// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Phone,
  Mail,
  Send,
  MessageSquareWarning,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/receptionist/dashboard", icon: LayoutDashboard },
  { label: "Admission Enquiry", path: "/receptionist/addmissionEnquiry", icon: ClipboardList },
  { label: "Visitor Book", path: "/receptionist/visitorBook", icon: BookOpen },
  { label: "Phone Call Log", path: "/receptionist/phoneCall", icon: Phone },
  { label: "Postal Receive", path: "/receptionist/postalRecieve", icon: Mail },
  { label: "Postal Dispatch", path: "/receptionist/postalDispatch", icon: Send },
  { label: "Complaints", path: "/receptionist/complaints", icon: MessageSquareWarning },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function ReceptionistSidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50
      ${collapsed ? "w-[80px]" : "w-[270px]"}
      bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-gray-800 flex flex-col shadow-lg transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <h2 className="font-bold text-lg">Reception Panel</h2>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition"
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
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                active
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "hover:bg-white/20"
              }`}
            >
              <Icon className="w-5 h-5" />

              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
              RS
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Rahul Sharma</p>
              <p className="text-xs opacity-80">Receptionist</p>
            </div>

            <LogOut
              onClick={() => router.push("/")}
              className="w-4 h-4 cursor-pointer hover:text-red-300"
            />
          </div>
        </div>
      )}
    </aside>
  );
}