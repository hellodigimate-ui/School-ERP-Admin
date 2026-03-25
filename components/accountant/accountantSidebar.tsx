// /* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  LayoutDashboard,
  IndianRupee,
  LogOut,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Wallet,
  BookOpenCheck,
  ArrowLeftRight,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Receipt,
  Banknote,
  Award,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  { label: "Dashboard", icon: LayoutDashboard, path: "/accountant/dashboard" },
  {
    label: "Fees Collection",
    icon: IndianRupee,
    path: "/accountant/feesCollection"
  },
  {
    label: "Fees Setup",
    icon: Receipt,
    path: "/accountant/feesSetup"
    
  },
  {
    label: "Fees Discount",
    icon: Percent,
    path: "/accountant/feesDiscount"
    
  },
  {
    label: "Scholarship",
    icon: Award,
    path: "/accountant/scholarship"
  },
  {
    label: "Expenses",
    icon: Wallet,
    path: "/accountant/expenses"
    
  },
  {
    label: "Income",
    icon: Banknote,
    path: "/accountant/income"
  
  },
  { label: "Student Ledger", icon: BookOpenCheck, path: "/accountant/studentLedger" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/accountant/transactions" },
  {
    label: "Finance Reports",
    icon: BarChart3,
    path: "/accountant/financeReports"

  },
];

export default function AccountantSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath =
    pathname + (searchParams?.toString() ? `?${searchParams}` : "");

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
    return pathname === base;
  };

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
      bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 
      text-gray-800 flex flex-col shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            <h2 className="font-bold text-lg">School Finance</h2>
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent">
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

              {hasChildren && open && !collapsed && (
                <div className="ml-10 mt-1 space-y-1">
                  {item.children!.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => router.push(child.path)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition
                        ${
                          currentPath === child.path
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
              RK
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Rajesh Kumar</p>
              <p className="text-xs opacity-80">Accountant</p>
            </div>
            <LogOut
              className="w-4 h-4 cursor-pointer hover:text-red-400"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      )}
    </aside>
  );
}