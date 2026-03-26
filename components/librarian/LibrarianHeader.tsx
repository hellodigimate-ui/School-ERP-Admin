"use client";

import {
  Search,
  Bell,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";


export function LibrarianHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search books, students, staff..."
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
          <MessageSquare className="h-5 w-5" />
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
          <Calendar className="h-5 w-5" />
        </button> */}

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="ml-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">
          2025-26
        </div>

        <ThemeToggle/>
      </div>
    </header>
  );
}