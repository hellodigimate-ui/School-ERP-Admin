"use client";

import {
  Users,
  BookOpen,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import {
  DashboardHeader,
  DashboardTitle,
} from "@/components/teacher/DashboardHeader";

import { StatsCard } from "@/components/teacher/StatsCard";
import { TodaySchedule } from "@/components/teacher/TodaySchedule";
import { RecentActivity } from "@/components/teacher/RecentActivity";
import { QuickActions } from "@/components/teacher/QuickActions";
import { UpcomingEvents } from "@/components/teacher/UpcomingEvents";
import { ClassPerformance } from "@/components/teacher/ClassPerformance";
import { AttendanceOverview } from "@/components/teacher/AttendanceOverview";
import { TopStudents } from "@/components/teacher/TopStudents";

export default function TeacherDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
          <DashboardTitle teacherName="Jane" />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="My Students"
              value="155"
              subtitle="Across all classes"
              icon={<Users className="w-6 h-6 text-primary" />}
              iconBgColor="bg-primary/10"
            />
            <StatsCard
              title="My Classes"
              value="5"
              subtitle="Active this semester"
              icon={<BookOpen className="w-6 h-6 text-success" />}
              iconBgColor="bg-success/10"
            />
            <StatsCard
              title="Today's Classes"
              value="4"
              subtitle="2 completed, 1 ongoing"
              icon={<CalendarCheck className="w-6 h-6 text-warning" />}
              iconBgColor="bg-warning/10"
            />
            <StatsCard
              title="Pending Tasks"
              value="8"
              subtitle="3 assignments to grade"
              icon={<ClipboardList className="w-6 h-6 text-info" />}
              iconBgColor="bg-info/10"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <TodaySchedule />
              <RecentActivity />
              <AttendanceOverview />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <QuickActions />
              <UpcomingEvents />
              <ClassPerformance />
              <TopStudents />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
          Powered by School Management System
        </footer>
      </div>
    </div>
  );
}
