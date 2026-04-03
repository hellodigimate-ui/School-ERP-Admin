/* eslint-disable @next/next/no-img-element */
"use client";

import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ChevronRight,
  CreditCard,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Dumbbell,
  Users,
  Trophy,
  Clock,
  Medal,
  Settings,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface SubItem {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/coach/dashboard" },
  {
    label: "Sport List",
    icon: Dumbbell,
    path: "/coach/sportsList"
  },
  {
    label: "Enrollment",
    icon: Users,
    path: "/coach/enrollments"
    
  },
  {
    label: "Schedule",
    icon: Clock,
    path: "/coach/schedule"
    
  },
  {
    label: "Tournaments",
    icon: Medal,
    path: "/coach/tournaments"
  },
  {
    label: "Achievements",
    icon: Trophy,
    path: "/coach/achievements"

  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/coach/reports"

  },
  {
    label: "Setting",
    icon: Settings,
    path: "/coach/setting"

  },
];

const dummyData = {
  name: "Rajesh Kumar",
  avatar: "",
};

const getInitials = (name: string) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default function CoachSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState({
    name: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  const currentPath = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    const base = path.split("?")[0];
    return pathname.startsWith(base);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/coach/profile");

        const profile = res?.data?.data || res?.data;

        setData({
          name: profile?.name ?? dummyData.name,
          avatar: profile?.avatar ?? "",
        });
      } catch (error) {
        console.log("Profile API failed:", error);
        setData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      window.location.reload();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

// window.dispatchEvent(new Event("profileUpdated"));

  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => currentPath === child.path);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((child) => currentPath === child.path)) {
        setOpenMenus((prev) =>
          prev.includes(item.label) ? prev : [...prev, item.label]
        );
      }
    });
  }, [currentPath]);

  return (
    <aside
      className={`
      ${collapsed ? "w-[80px]" : "w-[270px]"}
      sticky top-0 h-screen
      bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 dark:from-sidebar-background dark:via-sidebar-background dark:to-sidebar-background
      text-foreground dark:text-foreground flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-900`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border dark:border-border shrink-0 dark:bg-gray-900">
        {!collapsed && (
          <div className="flex items-center gap-2 dark:text-gray-400">
            <CreditCard className="w-6 h-6 dark:text-gray-400 " />
            <h2 className="font-bold text-lg dark:text-gray-400">School Coach</h2>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/50 transition dark:text-gray-400"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent dark:bg-gray-900 dark:text-gray-400">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const open = openMenus.includes(item.label);
          const active = isActive(item.path) || isParentActive(item);

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    if (collapsed) {
                      setCollapsed(false);
                      setTimeout(() => toggleMenu(item.label), 200);
                    } else {
                      toggleMenu(item.label);
                    }
                  } else if (item.path) {
                    router.push(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground shadow-lg"
                    : "hover:bg-secondary/50 dark:hover:bg-secondary/50"
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

              {hasChildren && open && !collapsed && (
                <div className="ml-10 mt-1 space-y-1">
                  {item.children!.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => router.push(child.path)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition
                        ${
                          currentPath === child.path
                            ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground"
                            : "hover:bg-secondary/50 dark:hover:bg-secondary/50"
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
        <div className="p-4 border-t border-border dark:border-border bg-secondary/30 backdrop-blur-md dark:bg-gray-900">
          <div className="flex items-center gap-3">
            
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold">
              {loading ? (
                "..."
              ) : data.avatar ? (
                <img
                  src={data.avatar}
                  alt={data.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-white">
                  {getInitials(data.name)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {loading ? "..." : data.name}
              </p>
              <p className="text-xs opacity-80">Coach</p>
            </div>

            <LogOut
              className="w-4 h-4 cursor-pointer hover:text-red-400"
              onClick={() => {
                localStorage.clear();
                router.push("/");
              }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}