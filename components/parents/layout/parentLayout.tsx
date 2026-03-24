"use client"

import { ReactNode, useState } from "react";
import { ParentSidebar } from "./parentSidebar";
import { ParentHeader } from "./parentHeader";;

interface ParentLayoutProps {
  children: ReactNode;
}

export default function ParentLayout({ children }: ParentLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen flex w-full bg-background">
      <ParentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex-1 flex  flex-col transition-all duration-300 min-w-0">
        <ParentHeader />
        <main className=" flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}