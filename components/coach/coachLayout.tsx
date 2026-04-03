"use client";

import { Suspense } from "react";
import CoachSidebar from "./coachSidebar";
import CoachTopBar from "./coachTopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Suspense fallback={<div className="w-[270px] bg-background"></div>}>
        <CoachSidebar />
      </Suspense>

      {/* Main Section */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <CoachTopBar />
        <main className="flex-1 p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
