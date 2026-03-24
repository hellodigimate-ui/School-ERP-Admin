"use client";

import { ReactNode } from "react";
import Topbar from "./topBar";
import Sidebar from "./sideBar";

interface HRLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: HRLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}