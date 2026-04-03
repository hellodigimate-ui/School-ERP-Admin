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
  // DashboardTitle,
} from "@/components/teacher/DashboardHeader";

import { StatsCard } from "@/components/teacher/StatsCard";
import { TodaySchedule } from "@/components/teacher/TodaySchedule";
import { RecentActivity } from "@/components/teacher/RecentActivity";
import { QuickActions } from "@/components/teacher/QuickActions";
import { UpcomingEvents } from "@/components/teacher/UpcomingEvents";
import { ClassPerformance } from "@/components/teacher/ClassPerformance";
import { AttendanceOverview } from "@/components/teacher/AttendanceOverview";
import { TopStudents } from "@/components/teacher/TopStudents";
import TeacherWelcomeBanner from "@/components/teacher/TeacherWelcomeBanner";

export default function TeacherDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5 w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">          {/* Welcome Banner */}
          <div className="mb-8">
            <TeacherWelcomeBanner />
          </div>

          {/* Stats Cards - Enhanced */}
          <div className="relative mb-10">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-indigo-500/5 to-purple-500/5 blur-2xl rounded-3xl" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="animate-fade-in-up delay-100">
                <StatsCard
                  title="My Students"
                  value="155"
                  subtitle="Across all classes"
                  icon={<Users className="w-6 h-6 text-primary" />}
                  iconBgColor="bg-gradient-to-br from-blue-500/20 to-primary/10"
                />
              </div>

              <div className="animate-fade-in-up delay-200">
                <StatsCard
                  title="My Classes"
                  value="5"
                  subtitle="Active this semester"
                  icon={<BookOpen className="w-6 h-6 text-emerald-500" />}
                  iconBgColor="bg-gradient-to-br from-emerald-500/20 to-green-400/10"
                />
              </div>

              <div className="animate-fade-in-up delay-300">
                <StatsCard
                  title="Today's Classes"
                  value="4"
                  subtitle="2 completed, 1 ongoing"
                  icon={<CalendarCheck className="w-6 h-6 text-amber-500" />}
                  iconBgColor="bg-gradient-to-br from-yellow-400/20 to-orange-400/10"
                />
              </div>

              <div className="animate-fade-in-up delay-400">
                <StatsCard
                  title="Pending Tasks"
                  value="8"
                  subtitle="3 assignments to grade"
                  icon={<ClipboardList className="w-6 h-6 text-sky-500" />}
                  iconBgColor="bg-gradient-to-br from-sky-400/20 to-cyan-400/10"
                />
              </div>

            </div>
          </div>

          {/* Main Content Grid - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <TodaySchedule />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <RecentActivity />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <AttendanceOverview />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <QuickActions />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <UpcomingEvents />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <ClassPerformance />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <TopStudents />
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
          <p className="font-medium">
            Powered by <span className="text-primary">School Management System</span>
          </p>
          <p className="text-xs mt-1">All your teaching tools in one place</p>
        </footer>
      </div>
    </div>
  );
}
