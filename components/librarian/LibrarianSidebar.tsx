/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  UserPlus,
  UserCog,
  Library,
  LogOut,
  BarChart3,
  Settings,
  FileText,
  BookMarked,
  ClipboardList,
  AlertTriangle,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type MenuSection = {
  label: string;
  items: { title: string; icon: React.ComponentType<any>; path: string }[];
};

const menuSections: MenuSection[] = [
  {
    label: "",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/librarian/dashboard" },
      { title: "Book List", icon: BookOpen, path: "/librarian/bookList" },
      { title: "Issue / Return", icon: ArrowLeftRight, path: "/librarian/issueReturn" },
    ],
  },
  {
    label: "Members",
    items: [
      { title: "Add Student", icon: UserPlus, path: "/librarian/addStudent" },
      { title: "Add Staff Member", icon: UserCog, path: "/librarian/addStaff" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { title: "Book Categories", icon: BookMarked, path: "/librarian/bookCategories" },
      { title: "New Arrivals", icon: ClipboardList, path: "/librarian/newArrivals" },
    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Overdue Books", icon: AlertTriangle, path: "/librarian/overDueBooks" },
      { title: "Transaction Log", icon: History, path: "/librarian/transactionLogs" },
      { title: "Library Reports", icon: BarChart3, path: "/librarian/reports" },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Fine Rules", icon: FileText, path: "/librarian/fineRules" },
      { title: "Settings", icon: Settings, path: "/librarian/settings" },
    ],
  },
];

export default function LibrarianSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside
      className={`
      ${collapsed ? "w-[80px]" : "w-[270px]"}
      sticky top-0 h-screen
      bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200
      text-gray-800 flex flex-col shadow-lg transition-all duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Library className="w-6 h-6" />
            <h2 className="font-bold text-lg">Library Panel</h2>
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent">
        {menuSections.map((section) => (
          <div key={section.label}>
            {!collapsed && section.label && (
              <p className="text-xs font-semibold text-gray-600 px-2 mb-1 uppercase tracking-wide">
                {section.label}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
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
                    <span className="flex-1 text-left">
                      {item.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
              LB
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">Librarian</p>
              <p className="text-xs opacity-80">librarian@school.edu</p>
            </div>

            <LogOut
              className="w-4 h-4 cursor-pointer hover:text-red-400"
              onClick={() => router.push("/login")}
            />
          </div>
        </div>
      )}
    </aside>
  );
}