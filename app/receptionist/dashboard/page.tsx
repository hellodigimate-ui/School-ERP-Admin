"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  BookOpen,
  Phone,
  Mail,
  MessageSquareWarning,
  Send,
  Clock,
  UserPlus,
} from "lucide-react";
import { getItems } from "@/lib/storage";
import type {
  PostalRecord,
} from "@/components/receptionist/types/frontOffice";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
  { type: "Visitor", name: "Mr. Sharma", purpose: "Parent Meeting", time: "10:30 AM", status: "checked-in" },
  { type: "Enquiry", name: "Mrs. Verma", purpose: "Admission Class 5", time: "10:15 AM", status: "pending" },
  { type: "Call", name: "Transport Dept", purpose: "Bus Route Change", time: "09:45 AM", status: "completed" },
  { type: "Complaint", name: "Parent - Ravi K.", purpose: "Uniform Issue", time: "09:30 AM", status: "in-progress" },
  { type: "Postal", name: "CBSE Board", purpose: "Circular Received", time: "09:00 AM", status: "received" },
];

const statusColors: Record<string, string> = {
  "checked-in": "bg-success/10 text-success border-success/20",
  "pending": "bg-warning/10 text-warning border-warning/20",
  "completed": "bg-primary/10 text-primary border-primary/20",
  "in-progress": "bg-info/10 text-info border-info/20",
  "received": "bg-accent/10 text-accent border-accent/20",
};

const useCount = (key: string) => getItems(key).length;

export default function ReceptionistDashboardPage() {
  const stats = [
    {
      label: "Admission Enquiries",
      count: useCount("admission_enquiries"),
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "Visitors Today",
      count: useCount("visitor_book"),
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Phone Calls",
      count: useCount("phone_calls"),
      icon: Phone,
      color: "text-success",
    },
    {
      label: "Postal Received",
      count: getItems<PostalRecord>("postal_records").filter(
        (p) => p.type === "Receive"
      ).length,
      icon: Mail,
      color: "text-info",
    },
    {
      label: "Postal Dispatched",
      count: getItems<PostalRecord>("postal_records").filter(
        (p) => p.type === "Dispatch"
      ).length,
      icon: Send,
      color: "text-warning",
    },
    {
      label: "Complaints",
      count: useCount("complaints"),
      icon: MessageSquareWarning,
      color: "text-destructive",
    },
  ];


  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Receptionist Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome back! Here`s your front office overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {s.count}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5">
              <h3 className="font-display font-semibold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={statusColors[activity.status]}>
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5">
              <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Enquiry", icon: UserPlus, href: "/admission-enquiry" },
                  { label: "Log Visitor", icon: BookOpen, href: "/visitor-book" },
                  { label: "Log Call", icon: Phone, href: "/phone-call-log" },
                  { label: "New Complaint", icon: MessageSquareWarning, href: "/complaints" },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}