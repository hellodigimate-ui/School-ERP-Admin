"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ThemeToggle from "../ThemeToggle";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface StudentHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function StudentHeader({
  onMenuClick,
  showMenuButton,
}: StudentHeaderProps) {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
  });

  // ─── Get Initials ───
  const getInitials = (name: string) => {
    if (!name) return "S";
    const words = name.split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  // ─── Fetch Profile ───
  useEffect(() => {
    axiosInstance
      .get("/api/v1/students/profile")
      .then((res) => {
        const data = res?.data?.data || res?.data;
        setProfile({
          name: data?.name || "Student",
          avatar: data?.avatar || "",
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <header
      className="
        sticky top-0 z-50 w-full md:ml-[17px] 
        bg-white/70 dark:bg-gray-900/70
        backdrop-blur-md
        border-b border-gray-200 dark:border-gray-800
      "
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 w-full">
        
        {/* LEFT */}
        <div className="flex items-center gap-3 flex-1">
          
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Search */}
          <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="
                pl-10 rounded-xl border-0
                bg-gray-100 dark:bg-gray-800
                focus:ring-2 focus:ring-indigo-400
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Notifications */}
          <button
            onClick={() => router.push("/student/notifications")}
            className="
              relative p-2 rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Profile */}
          <div
            onClick={() => router.push("/student/profile")}
            className="
              flex items-center gap-2 cursor-pointer
              hover:bg-gray-100 dark:hover:bg-gray-800
              px-2 py-1.5 rounded-xl transition
            "
          >
            <Avatar className="h-9 w-9">
              {profile.avatar && (
                <AvatarImage
                  src={profile.avatar}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <AvatarFallback className="bg-indigo-500 text-white text-sm">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:block">
              <p className="text-sm font-medium">
                {profile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Student
              </p>
            </div>
          </div>

          {/* Theme */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}