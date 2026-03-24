/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  Bell,
  Settings,
  GraduationCap,
  CalendarCheck,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import {
     LogOut, PanelLeftClose, PanelLeftOpen,
    ChevronRight,
    ChevronDown
  } from "lucide-react";



interface MenuItem {
  label: string;
  path: string;
  icon: any;
  children?: MenuItem[];
}

interface StudentSidebarProps {
  collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Courses", path: "/student/courses", icon: BookOpen },
  { label: "Time Table", path: "/student/schedule", icon: Calendar },
  { label: "Attendance", path: "/student/attendance", icon: CalendarCheck },
  { label: "KYC", path: "/student/kyc", icon: ShieldCheck },
  { label: "Assignments", path: "/student/assignments", icon: ClipboardList },
  { label: "Results", path: "/student/results", icon: Trophy },
  // { label: "Fees", path: "/student/fees", icon: CreditCard },
  { label: "Notifications", path: "/student/notifications", icon: Bell },
  { label: "Settings", path:  "/student/settings", icon: Settings },
];

export default function AdminSidebar({
    collapsed,
    setCollapsed,
  }: StudentSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (label: string) => {
      setOpenMenus((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    };

    const isActive = (path: string) => pathname === path;

    const isParentActive = (item: any) =>
      item.children?.some((child: any) => pathname.startsWith(child.path));

    // Auto open parent if child route active
    useEffect(() => {
      menuItems.forEach((item) => {
        if (item.children) {
          const activeChild = item.children.some((child) =>
            pathname.startsWith(child.path)
          );
          if (activeChild) {
            setOpenMenus((prev) =>
              prev.includes(item.label) ? prev : [...prev, item.label]
            );
          }
        }
      });
    }, [pathname]);

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
              <h2 className="font-bold text-lg">Student</h2>
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

        {/* Menu Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const open = openMenus.includes(item.label);
            const active = isActive(item.path) || isParentActive(item);

            return (
              <div key={item.label}>
                {/* Parent Button */}
                <button
                  onClick={() => {
                    if (hasChildren) {
                      if (collapsed) {
                        setCollapsed(false);
                        setTimeout(() => toggleMenu(item.label), 200);
                      } else {
                        toggleMenu(item.label);
                      }
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">
                        {item.label}
                      </span>

                      {hasChildren &&
                        (open ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        ))}
                    </>
                  )}
                </button>

                {/* Dropdown Children */}
                {hasChildren && open && !collapsed && (
                  <div className="ml-10 mt-1 space-y-1 transition-all duration-300">
                    {item.children!.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => router.push(child.path)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition
                          ${
                            isActive(child.path)
                              ? "bg-white text-indigo-700"
                              : "hover:bg-white/20"
                          }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        {!collapsed && (
          <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Abhishek</p>
                <p className="text-xs opacity-80">Student</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-red-300" />
            </div>
          </div>
        )}
      </aside>
    );
  }
