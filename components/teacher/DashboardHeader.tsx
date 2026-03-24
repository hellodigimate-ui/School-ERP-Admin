"use client";

import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";


interface DashboardHeaderProps {
  teacherName?: string;
}

const recentNotifications = [
  {
    id: 1,
    title: "New Assignment Submitted",
    message: "Alex Johnson submitted Homework #5",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Attendance Alert",
    message: "David Martinez absent 3 days",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Parent Message",
    message: "Meeting request from Emma's parent",
    time: "2h ago",
    unread: false,
  },
];

export function DashboardHeader({
  teacherName = "Jane Doe",
}: DashboardHeaderProps) {
  const unreadCount = recentNotifications.filter((n) => n.unread).length;
  const router=useRouter();

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-card border-b border-border sticky top-0 z-10">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search students, classes, assignments..."
          className="pl-10 bg-background"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button onSelect={() => router.push("/teacher/notifications")} className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Notifications</h3>
              <Badge variant="secondary">{unreadCount} new</Badge>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                    notification.unread ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-primary rounded-full mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border">
              <Link href="/notifications">
                <Button variant="ghost" className="w-full">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 transition-colors">
              <Avatar className="w-9 h-9">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{teacherName}</p>
                <p className="text-xs text-muted-foreground">Teacher</p>
              </div>

              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="font-medium">{teacherName}</p>
              <p className="text-sm text-muted-foreground">
                jane.doe@school.edu
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function DashboardTitle({
  teacherName = "Jane Doe",
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {teacherName}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{today}</p>
    </div>
  );
}
