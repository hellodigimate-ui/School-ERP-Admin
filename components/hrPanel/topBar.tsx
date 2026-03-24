"use client";

import { Search, Bell, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";

const Topbar = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search staff, departments, reports..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/messages"
          className="relative p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </Link>

        <Link
          href="/calendar"
          className="relative p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </Link>

        <Link
          href="/notifications"
          className="relative p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Link>

        <span className="text-sm font-medium text-muted-foreground ml-2">
          2025-26
        </span>
      </div>
    </header>
  );
};

export default Topbar;