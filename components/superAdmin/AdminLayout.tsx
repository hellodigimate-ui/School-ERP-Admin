"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import TopHeader from "./TopHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col bg-background min-h-screen">

      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Right Side */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300
        ${collapsed ? "pl-[80px]" : "pl-[270px]"}`}
      >
        {/* Header */}
        <TopHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </div>
    </div>
  );
}
