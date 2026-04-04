"use client";


import { Bell, Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 flex items-center gap-4 border-b border-border bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students, fees, reports..."
                  className="pl-9 bg-secondary border-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>

              <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                2025-26
              </span>

              <button
                onClick={toggleDark}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>

          {/* Footer */}
          <footer className="powered-by border-t border-border py-3 text-center text-sm text-muted-foreground">
            Powered by Digimate
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}