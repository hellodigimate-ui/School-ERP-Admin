"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  Trophy,
  CreditCard,
  Bell,
  MessageSquare,
  Settings,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ParentSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { title: "Dashboard", url: "/parents/dashboard", icon: LayoutDashboard },
  { title: "My Children", url: "/parents/mychildren", icon: Users },
  { title: "Attendance", url: "/parents/attendance", icon: ClipboardCheck },
  { title: "Time Table", url: "/parents/timetable", icon: Calendar },
  { title: "Results", url: "/parents/result", icon: Trophy },
  { title: "Fees", url: "/parents/fees", icon: CreditCard },
  { title: "Messages", url: "/parents/messages", icon: MessageSquare },
  { title: "Notifications", url: "/parents/notification", icon: Bell },
  { title: "Settings", url: "/parents/settings", icon: Settings },
];

export function ParentSidebar({
  collapsed,
  setCollapsed,
}: ParentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col shadow-lg transition-all duration-300",
        "bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-gray-800",
        collapsed ? "w-[80px]" : "w-[270px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            <h2 className="font-bold text-lg">School Parent</h2>
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.url);
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.url}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-indigo-700 shadow-lg"
                    : "hover:bg-white/20"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />

                {!collapsed && (
                  <span className="flex-1 truncate">
                    {item.title}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white/40">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=parent" />
              <AvatarFallback className="bg-white text-indigo-600 font-semibold">
                PS
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                Priya Sharma
              </p>
              <p className="text-xs opacity-80">
                Parent
              </p>
            </div>

            <LogOut onClick={() => router.push("/")} className="w-4 h-4 cursor-pointer hover:text-red-400" />
          </div>
        </div>
      )}
    </aside>
  );
}