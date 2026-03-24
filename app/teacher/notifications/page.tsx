"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialNotifications = [
  {
    id: 1,
    type: "assignment",
    title: "New Assignment Submitted",
    message: "Alex Johnson submitted Homework #5 for Math 101",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "attendance",
    title: "Attendance Alert",
    message: "David Martinez has been absent for 3 consecutive days",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    message: "Parent of Emma Wilson requested a meeting",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "grade",
    title: "Grade Update Required",
    message: "Calculus midterm grades are due tomorrow",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "system",
    title: "Schedule Change",
    message: "Room 204 will be unavailable on Friday. New room: 305",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "assignment",
    title: "Late Submission",
    message: "James Miller submitted assignment 2 days late",
    time: "1 day ago",
    read: true,
  },
  {
    id: 7,
    type: "attendance",
    title: "Perfect Attendance",
    message: "Olivia Anderson achieved 100% attendance this month",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "assignment":
        return (
          <div className={cn(iconClass, "bg-primary/10 text-primary p-2 rounded-full")}>
            📝
          </div>
        );
      case "attendance":
        return (
          <div className={cn(iconClass, "bg-warning/10 text-warning p-2 rounded-full")}>
            📋
          </div>
        );
      case "message":
        return (
          <div className={cn(iconClass, "bg-info/10 text-info p-2 rounded-full")}>
            💬
          </div>
        );
      case "grade":
        return (
          <div className={cn(iconClass, "bg-success/10 text-success p-2 rounded-full")}>
            📊
          </div>
        );
      case "system":
        return (
          <div className={cn(iconClass, "bg-muted text-muted-foreground p-2 rounded-full")}>
            ⚙️
          </div>
        );
      default:
        return <Bell className={iconClass} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">
                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="grade">Grades</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="dashboard-section">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    {getTypeIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-medium", !notification.read && "text-foreground")}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge className="bg-primary/10 text-primary text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
