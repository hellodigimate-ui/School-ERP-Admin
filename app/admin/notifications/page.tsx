/* eslint-disable react-hooks/static-components */
"use client"


import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  AlertTriangle, 
  MessageSquare, 
  Info, 
  CheckCircle2, 
  Trash2,
  MailOpen,
  Settings,
  Users,
  IndianRupeeIcon,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "alert" | "message" | "system" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Low Attendance Warning",
    description: "Class 10-A has attendance below 80% this week. Immediate attention required.",
    time: "5 minutes ago",
    read: false,
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  {
    id: "2",
    type: "message",
    title: "New Message from Parent",
    description: "Mrs. Johnson has sent a message regarding her child's absence next week.",
    time: "15 minutes ago",
    read: false,
    icon: MessageSquare,
    iconColor: "text-primary",
  },
  {
    id: "3",
    type: "system",
    title: "Fee Payment Received",
    description: "Payment of $1,250 received from Student ID: STU-2024-0156 for Q2 fees.",
    time: "1 hour ago",
    read: false,
    icon: IndianRupeeIcon,
    iconColor: "text-success",
  },
  {
    id: "4",
    type: "info",
    title: "Upcoming Parent-Teacher Meeting",
    description: "Reminder: Parent-teacher meeting scheduled for February 15th, 2026.",
    time: "2 hours ago",
    read: true,
    icon: Calendar,
    iconColor: "text-accent",
  },
  {
    id: "5",
    type: "alert",
    title: "Staff Leave Request",
    description: "Mr. David Chen has submitted a leave request for February 10-12.",
    time: "3 hours ago",
    read: true,
    icon: Users,
    iconColor: "text-warning",
  },
  {
    id: "6",
    type: "system",
    title: "System Update Completed",
    description: "The scheduled maintenance has been completed successfully.",
    time: "5 hours ago",
    read: true,
    icon: Settings,
    iconColor: "text-muted-foreground",
  },
  {
    id: "7",
    type: "message",
    title: "New Student Registration",
    description: "A new student registration form has been submitted for review.",
    time: "Yesterday",
    read: true,
    icon: Users,
    iconColor: "text-primary",
  },
  {
    id: "8",
    type: "info",
    title: "Report Generated",
    description: "Monthly attendance report for January 2026 is now available.",
    time: "Yesterday",
    read: true,
    icon: Info,
    iconColor: "text-accent",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = (items: Notification[]) => {
    const allIds = items.map((n) => n.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const markAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.includes(n.id) ? { ...n, read: true } : n))
    );
    toast.success(`${selectedIds.length} notification(s) marked as read`);
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    toast.success(`${selectedIds.length} notification(s) deleted`);
    setSelectedIds([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((n) => n.type === type);
  };

  const NotificationList = ({ items }: { items: Notification[] }) => (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No notifications to display</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Checkbox
              checked={items.length > 0 && items.every((n) => selectedIds.includes(n.id))}
              onCheckedChange={() => selectAll(items)}
            />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
          {items.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                notification.read
                  ? "bg-card border-border"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              <Checkbox
                checked={selectedIds.includes(notification.id)}
                onCheckedChange={() => toggleSelect(notification.id)}
              />
              <div className={`p-2 rounded-lg bg-muted ${notification.iconColor}`}>
                <notification.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={markAsRead} className="gap-2">
                  <MailOpen className="w-4 h-4" />
                  Mark as Read
                </Button>
                <Button variant="outline" size="sm" onClick={deleteSelected} className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.filter((n) => n.type === "alert").length}</p>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.filter((n) => n.type === "message").length}</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Info className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>View and manage your notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="alert">Alerts</TabsTrigger>
                <TabsTrigger value="message">Messages</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <NotificationList items={filterNotifications("all")} />
              </TabsContent>
              <TabsContent value="alert">
                <NotificationList items={filterNotifications("alert")} />
              </TabsContent>
              <TabsContent value="message">
                <NotificationList items={filterNotifications("message")} />
              </TabsContent>
              <TabsContent value="system">
                <NotificationList items={filterNotifications("system")} />
              </TabsContent>
              <TabsContent value="info">
                <NotificationList items={filterNotifications("info")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}