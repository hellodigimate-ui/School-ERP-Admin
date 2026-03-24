import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Calendar, CreditCard, BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ParentLayout from "@/components/parents/layout/parentLayout";

const notifications = [
  {
    id: "1",
    type: "assignment",
    title: "New Assignment Posted",
    description: "Mrs. Sharma posted a new Mathematics assignment for Class 10-A",
    time: "10 minutes ago",
    read: false,
    icon: BookOpen,
  },
  {
    id: "2",
    type: "fee",
    title: "Fee Payment Reminder",
    description: "Term 2 tuition fee of ₹25,000 is pending. Due date: Feb 28, 2026",
    time: "2 hours ago",
    read: false,
    icon: CreditCard,
  },
  {
    id: "3",
    type: "event",
    title: "Parent-Teacher Meeting Scheduled",
    description: "PTM scheduled for Feb 10, 2026 at 10:00 AM. Please confirm attendance.",
    time: "5 hours ago",
    read: false,
    icon: Calendar,
  },
  {
    id: "4",
    type: "alert",
    title: "Attendance Alert",
    description: "Rahul was marked absent today. Please contact the school if this is incorrect.",
    time: "1 day ago",
    read: true,
    icon: AlertCircle,
  },
  {
    id: "5",
    type: "general",
    title: "School Holiday Notice",
    description: "School will remain closed on Feb 12, 2026 for Republic Day celebrations.",
    time: "2 days ago",
    read: true,
    icon: Bell,
  },
  {
    id: "6",
    type: "assignment",
    title: "Grade Updated",
    description: "Mr. Patel updated Physics grades for Term 1 examination.",
    time: "3 days ago",
    read: true,
    icon: BookOpen,
  },
];

const typeColors = {
  assignment: "bg-primary/10 text-primary",
  fee: "bg-warning/10 text-warning",
  event: "bg-success/10 text-success",
  alert: "bg-destructive/10 text-destructive",
  general: "bg-muted text-muted-foreground",
};

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ParentLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
            <Check className="w-4 h-4" />
            Mark all as read
            </Button>
        </div>

        {/* Notifications List */}
        <Card>
            <CardContent className="p-0 divide-y divide-border">
            {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                <div
                    key={notification.id}
                    className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                    )}
                >
                    <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        typeColors[notification.type as keyof typeof typeColors]
                    )}
                    >
                    <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.read && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            New
                        </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                        {notification.time}
                    </span>
                    </div>
                </div>
                );
            })}
            </CardContent>
        </Card>
        </div>
    </ParentLayout>
  );
}
