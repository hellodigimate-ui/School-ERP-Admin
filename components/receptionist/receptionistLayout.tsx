"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import ReceptionistSidebar from "./receptionistSidebar";
import { ReceptionistHeader } from "./receptionHeader";

interface ReceptionistLayoutProps {
  children: ReactNode;
}

export function ReceptionistLayout({ children }: ReceptionistLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-background min-h-screen flex">

      {/* Sidebar */}
      <ReceptionistSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Right Section */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${collapsed ? "ml-[80px]" : "ml-[270px]"}`}
      >
        {/* Header */}
        <ReceptionistHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}