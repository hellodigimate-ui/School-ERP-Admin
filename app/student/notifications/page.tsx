"use client";

import { useEffect, useState } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import {
  Bell,
  BookOpen,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Check,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type:
    | "assignment"
    | "grade"
    | "attendance"
    | "announcement"
    | "event"
    | string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: "high" | "medium" | "low";
}

const API_NOTIFICATION_TYPES = [
  "assignment",
  "grade",
  "attendance",
  "announcement",
  "event",
];

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "assignment":
      return <BookOpen className="h-5 w-5" />;
    case "grade":
      return <FileText className="h-5 w-5" />;
    case "attendance":
      return <AlertCircle className="h-5 w-5" />;
    case "announcement":
      return <Bell className="h-5 w-5" />;
    case "event":
      return <Calendar className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "assignment":
      return "bg-blue-500/10 text-blue-500";
    case "grade":
      return "bg-green-500/10 text-green-500";
    case "attendance":
      return "bg-orange-500/10 text-orange-500";
    case "announcement":
      return "bg-purple-500/10 text-purple-500";
    case "event":
      return "bg-stat-teal/10 text-stat-teal";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/api/v1/message/user", {
          params: { page, perPage },
        });

        const messages = response.data?.data || [];
        const pagination = response.data?.pagination || {};

        setTotalPages(pagination.totalPages || 1);
        setTotalRecords(pagination.totalRecords || messages.length);

        const mapped = messages.map((message: any) => {
          const type = API_NOTIFICATION_TYPES.includes(message.type)
            ? message.type
            : "announcement";

          return {
            id: message.id,
            type,
            title: message.title || "Notification",
            message: message.content || message.message || "",
            time: formatTimeAgo(message.createdAt),
            read: false,
            priority: message.priority || undefined,
          } as Notification;
        });

        setNotifications(mapped);
      } catch (fetchError: any) {
        console.error("Error fetching notifications:", fetchError);
        setError(fetchError?.message || "Unable to load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [page, perPage]);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(current + 1, totalPages));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === type);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
            {error ? (
              <p className="text-sm text-destructive mt-2">{error}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelected}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="assignment">Assignments</TabsTrigger>
              <TabsTrigger value="grade">Grades</TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
            </TabsList>
          </div>

          {["all", "unread", "assignment", "grade", "announcement"].map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="space-y-2">
                {/* Select All */}
                <div className="flex items-center gap-2 px-2 py-1">
                  <Checkbox
                    checked={
                      selectedIds.length === notifications.length &&
                      notifications.length > 0
                    }
                    onCheckedChange={selectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all
                  </span>
                </div>

                {isLoading ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
                      <p className="text-lg font-medium text-foreground">
                        Loading notifications...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please wait while your messages load.
                      </p>
                    </CardContent>
                  </Card>
                ) : filterNotifications(tab).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-foreground">
                        No notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You`re all caught up!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {filterNotifications(tab).map((notification) => (
                      <Card
                        key={notification.id}
                        className={`transition-colors ${!notification.read ? "bg-accent/50 border-primary/20" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={selectedIds.includes(notification.id)}
                              onCheckedChange={() =>
                                toggleSelect(notification.id)
                              }
                            />
                            <div
                              className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}
                            >
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                                    >
                                      {notification.title}
                                    </h3>
                                    {notification.priority === "high" && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        Urgent
                                      </Badge>
                                    )}
                                    {!notification.read && (
                                      <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {notification.time}
                                    </span>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteNotification(notification.id)
                                      }
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ),
          )}
        </Tabs>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} • {totalRecords} notifications
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
