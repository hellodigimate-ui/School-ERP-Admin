/* eslint-disable @typescript-eslint/no-unused-vars */
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
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-xl border 
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700
            text-white dark:text-gray-100 transition-colors duration-300">

          {/* Decorative Blur Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 dark:bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 dark:bg-white/20 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-white dark:text-gray-100 transition-colors duration-300">
              Receptionist Dashboard
            </h2>

            <p className="mt-2 text-white/90 dark:text-gray-200 text-sm md:text-base transition-colors duration-300">
              Welcome back! Here’s your front office overview.
            </p>

            {/* Optional Badge / Tagline */}
            <div className="mt-4 inline-block px-4 py-1 text-xs font-medium 
                bg-white/20 dark:bg-white/10 rounded-full backdrop-blur
                text-white dark:text-gray-200 transition-colors duration-300">
              Front Office Control Panel
            </div>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;

            return (
              <Card
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border-0 shadow-md 
                          hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 
                          bg-white dark:bg-gray-800"
              >
                {/* Gradient Glow Background on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300
                                bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20
                                dark:from-indigo-700/30 dark:via-purple-700/30 dark:to-pink-700/30" />

                <CardContent className="relative flex items-center gap-4 p-6">
                  
                  {/* Icon Box */}
                  <div
                    className={`p-4 rounded-xl shadow-md bg-gradient-to-br 
                                from-indigo-500 via-purple-500 to-pink-500
                                dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700
                                text-white transition-colors duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight transition-colors duration-300">
                      {s.count}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-300 font-medium transition-colors duration-300">
                      {s.label}
                    </p>
                  </div>
                </CardContent>

                {/* Bottom Accent Line */}
                <div className="h-1 w-full bg-gradient-to-r 
                                from-indigo-500 via-purple-500 to-pink-500
                                dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700
                                transition-colors duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Recent Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================= Recent Activity ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg bg-white dark:bg-gray-800 p-6">

              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                              dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 transition-colors duration-300" />

              <h3 className="font-semibold text-lg mb-5 bg-gradient-to-r from-indigo-600 to-pink-500 
                            bg-clip-text text-transparent dark:from-indigo-400 dark:to-pink-400 transition-colors duration-300">
                Recent Activity
              </h3>

              <div className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">

                      {/* Icon */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl 
                                      bg-gradient-to-br from-indigo-500 to-pink-500 dark:from-indigo-700 dark:to-pink-700 text-white shadow-md transition-colors duration-300">
                        <Clock className="h-4 w-4" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors duration-300">
                          {activity.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">
                          {activity.purpose}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status */}
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[activity.status]} transition-colors duration-300`}
                      >
                        {activity.status}
                      </Badge>

                      {/* Time */}
                      <span className="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ================= Quick Actions ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg bg-white dark:bg-gray-800 p-6">

              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                              dark:from-purple-700 dark:via-pink-700 dark:to-orange-600 transition-colors duration-300" />

              <h3 className="font-semibold text-lg mb-5 bg-gradient-to-r from-purple-600 to-pink-500 
                            bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 transition-colors duration-300">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "New Enquiry", icon: UserPlus, href: "/receptionist/addmissionEnquiry" },
                  { label: "Log Visitor", icon: BookOpen, href: "/receptionist/visitorBook" },
                  { label: "Log Call", icon: Phone, href: "/receptionist/phoneCall" },
                  { label: "New Complaint", icon: MessageSquareWarning, href: "/receptionist/complaints" },
                ].map((action, i) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="group relative flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-700 
                              border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r 
                                    from-indigo-500/20 via-purple-500/20 to-pink-500/20 
                                    dark:from-indigo-700/30 dark:via-purple-700/30 dark:to-pink-700/30" />

                    {/* Icon */}
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl 
                                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                                    dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 
                                    text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="h-5 w-5" />
                    </div>

                    {/* Label */}
                    <span className="relative text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {action.label}
                    </span>
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