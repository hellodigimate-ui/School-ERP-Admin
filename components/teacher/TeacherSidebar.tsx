/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  // MessageSquare,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const dummyData = {
  name: "Rahul",
  avatar: "https://pngtree.com/so/user"
};

const getInitials = (name) => {
  if (!name) return "";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
  { icon: Users, label: "My Students", path: "/teacher/students" },
  { icon: BookOpen, label: "My Classes", path: "/teacher/classes" },
  { icon: Calendar, label: "Schedule", path: "/teacher/schedule" },
  { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
  { icon: FileText, label: "Assignments", path: "/teacher/assignments" },
  // { icon: GraduationCap, label: "Grades", path: "/teacher/grades" },
  // { icon: MessageSquare, label: "Messages", path: "/teacher/messages" },
];

const bottomNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", path: "/teacher/notifications" },
  { icon: Settings, label: "Settings", path: "/teacher/settings" },
];

export function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const router=useRouter();

  const [data, setData] = useState({
    name: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);




useEffect(() => {

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/users/me");

      console.log("Full API Response:", response.data);

      const profile = response?.data?.data || response?.data;

      setData({
        name: profile?.name ?? dummyData.name,
        avatar: profile?.avatar ?? "", // 👈 add this
      });
    } catch (error) {
      console.log(
        "API failed, using dummy data:",
        error instanceof Error ? error.message : String(error)
      );
      setData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 sticky top-0",
        "bg-gradient-to-b from-sky-400 to-blue-200 dark:from-sidebar-background dark:to-sidebar-background text-foreground dark:text-foreground",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          {!collapsed && (
            <span className="font-semibold text-lg">Teacher</span>
          )}
        </div>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-medium shadow"
                  : "hover:bg-secondary/50 dark:hover:bg-secondary/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 space-y-2 mb-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-medium shadow"
                  : "hover:bg-secondary/50 dark:hover:bg-secondary/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

        {/* User Section */}
        {!collapsed && (
          <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md dark:bg-gray-900 dark:text-gray-400">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                {loading ? "..." : getInitials(data.name)}
              </div> */}

              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center font-bold">
                {loading ? (
                  "..."
                ) : data?.avatar ? (
                  <img
                    src={data.avatar}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600">
                    {getInitials(data.name)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">{loading ? "..." : data.name}</p>
                <p className="text-xs opacity-80">Teacher</p>
              </div>
              <button onClick={() => router.push("/")}>
                <LogOut className="w-4 h-4 cursor-pointer hover:text-red-300" />
              </button>
              
            </div>
          </div>
        )}
    </aside>
  );
}