"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import ThemeToggle from "../ThemeToggle";

export function ReceptionistHeader() {
  const router = useRouter();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search students, visitors, enquiries..."
          className="pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-accent"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        {/* <button
          onClick={() => router.push("/receptionist/notifications")}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button> */}

        {/* User Menu */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">Rahul Sharma</p>
                <p className="text-xs text-muted-foreground">Receptionist</p>
              </div>

              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => router.push("/receptionist/profile")}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => router.push("/receptionist/settings")}
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => router.push("/login")}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        
        {/* Notifications */}
        <button
          onClick={() => router.push("/receptionist/notifications")}
          className="relative w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* Session Badge */}
        <div className="ml-2 px-4 py-2 rounded-full border border-border text-sm font-semibold text-foreground">
          2025-26
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

    </header>
  );
}