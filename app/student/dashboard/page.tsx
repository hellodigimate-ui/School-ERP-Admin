"use client";

import { useMemo } from "react";
import {
  CalendarCheck,
  FileText,
  Award,
  ClipboardList,
} from "lucide-react";

import { StudentLayout } from "@/components/student/StudentLayout";
import { StatCard } from "@/components/student/StatCard";
import { ActivityFeed } from "@/components/student/ActivityFeed";
import { QuickActions } from "@/components/student/QuickActions";
import { UpcomingEvents } from "@/components/student/UpcomingEvents";
import { AttendanceCard } from "@/components/student/AttendanceCard";
import { CourseProgress } from "@/components/student/CourseProgress";
import { FeeStatus } from "@/components/student/FeeStatus";
import { SummaryCards } from "@/components/student/SummaryCards";

/* ----------------------------------
   Page
----------------------------------- */

export default function StudentDashboard() {
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <StudentLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">Rahul</span>
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>

          {/* Accent line */}
          <span className="absolute bottom-0 left-0 h-0.5 w-24 bg-gradient-to-r from-primary to-transparent" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Attendance Rate"
            value="92%"
            subtitle="This semester"
            icon={CalendarCheck}
            color="teal"
          />
          <StatCard
            title="Assignments"
            value="5"
            subtitle="3 pending due"
            icon={ClipboardList}
            color="yellow"
          />
          <StatCard
            title="Current CGPA"
            value="8.5"
            subtitle="Top 15% of class"
            icon={Award}
            color="green"
          />
          <StatCard
            title="Enrolled Courses"
            value="6"
            subtitle="All active"
            icon={FileText}
            color="blue"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            <ActivityFeed />
            <AttendanceCard
              data={{
                rate: "92%",
                present: 45,
                absent: 3,
                onLeave: 2,
              }}
            />
            <SummaryCards />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions />
            <UpcomingEvents />
            <FeeStatus
              collected="₹25,000"
              pending="₹15,000"
              overdue="₹0"
            />
            <CourseProgress />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
