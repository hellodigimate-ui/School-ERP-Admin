"use client";

import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  Wallet,
  ShieldCheck,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Bell
} from "lucide-react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/canteen/dashboard" },
  { label: "Item Management", icon: UtensilsCrossed, path: "/canteen/items" },
  { label: "Stock Management", icon: Package, path: "/canteen/stock" },
  { label: "Billing & Sales", icon: ShoppingCart, path: "/canteen/billing" },
  { label: "Student Wallet", icon: Wallet, path: "/canteen/wallet" },
  { label: "Parent Control", icon: ShieldCheck, path: "/canteen/parentControl" },
  { label: "Daily Sales Report", icon: BarChart3, path: "/canteen/reports" },
];

export default function CanteenSidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`
        ${collapsed ? "w-[80px]" : "w-[270px]"}
        sticky top-0 h-screen
        bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200
        text-gray-800 flex flex-col shadow-lg transition-all duration-300
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6" />
              <h2 className="font-bold text-lg">Canteen Manager</h2>
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
          {navItems.map((item) => {
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
                CM
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Canteen Admin</p>
                <p className="text-xs opacity-80">Manager</p>
              </div>

              <LogOut
                className="w-4 h-4 cursor-pointer hover:text-red-400"
                onClick={() => router.push("/login")}
              />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          <h2 className="text-lg font-semibold">
            {navItems.find((n) => pathname.startsWith(n.path))?.label ||
              "Dashboard"}
          </h2>

          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}