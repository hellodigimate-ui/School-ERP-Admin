"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "../layout/AdminSidebar";

export function StudentLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
