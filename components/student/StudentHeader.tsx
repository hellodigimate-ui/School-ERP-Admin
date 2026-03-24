"use client";

import { Bell, Search, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface StudentHeaderProps {
  studentName: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function StudentHeader({
  studentName,
  onMenuClick,
  showMenuButton,
}: StudentHeaderProps) {
  const router = useRouter();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    axiosInstance.get("/api/v1/students/profile").then((response)=>{
      console.log(response.data);
    }).catch((error)=>{
      console.log(error);
    })
  }, [])
  

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-card border-b border-border gap-3">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Search Bar */}
        <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <button
          onClick={() => router.push("/student/notifications")}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-secondary rounded-lg p-1.5 md:p-2 transition-colors">
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">
                  {studentName}
                </p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>

              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <DropdownMenuItem
              onClick={() => router.push("/student/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/student/settings")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/login")}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
