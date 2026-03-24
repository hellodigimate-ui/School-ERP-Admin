"use client";

import { AttendanceSummary } from "@/components/parents/dashboard/attandanceSummary";
import { ChildrenOverview } from "@/components/parents/dashboard/childrenOverview";
import { FeesSummary } from "@/components/parents/dashboard/feeSummary";
import { QuickActions } from "@/components/parents/dashboard/quickAction";
import { RecentActivity } from "@/components/parents/dashboard/recentActivity";
import { StatCard } from "@/components/parents/dashboard/statCard";
import { UpcomingEvents } from "@/components/parents/dashboard/upcominEvents";
import ParentLayout from "@/components/parents/layout/parentLayout";
import {
  ClipboardCheck,
  Trophy,
  CreditCard,
  MessageSquare,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

const mockChildren = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    class: "Class 10-A",
    attendance: 92,
    cgpa: 8.5,
    pendingFees: 15000,
  },
  {
    id: "2",
    name: "Ananya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    class: "Class 7-B",
    attendance: 96,
    cgpa: 9.2,
    pendingFees: 0,
  },
];

const mockActivities = [
  {
    id: "1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
    avatarFallback: "MS",
    title: "Mrs. Sharma posted new assignment for",
    highlight: "Mathematics",
    time: "10 min ago",
  },
  {
    id: "2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2",
    avatarFallback: "MP",
    title: "Mr. Patel updated grades for",
    highlight: "Physics 101",
    time: "1 hour ago",
  },
  {
    id: "3",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3",
    avatarFallback: "MG",
    title: "Mrs. Gupta scheduled test for",
    highlight: "English Literature",
    time: "2 hours ago",
  },
  {
    id: "4",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    avatarFallback: "A",
    title: "Admin sent fee reminder for",
    highlight: "Term 2 Fees",
    time: "3 hours ago",
  },
  {
    id: "5",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher4",
    avatarFallback: "MK",
    title: "Mr. Kumar uploaded study material for",
    highlight: "Chemistry",
    time: "5 hours ago",
  },
];

const mockEvents = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    date: "Feb 10, 2026",
    time: "10:00 AM",
    color: "primary" as const,
  },
  {
    id: "2",
    title: "Annual Sports Day",
    date: "Feb 15, 2026",
    time: "9:00 AM",
    color: "success" as const,
  },
  {
    id: "3",
    title: "Mid-Term Exams Begin",
    date: "Feb 20, 2026",
    time: "8:00 AM",
    color: "warning" as const,
  },
  {
    id: "4",
    title: "Fee Payment Deadline",
    date: "Feb 28, 2026",
    time: "5:00 PM",
    color: "destructive" as const,
  },
];

export default function ParentDashboard() {
  const router = useRouter();

  const quickActions = [
    {
      id: "1",
      title: "View Results",
      description: "Check grades",
      icon: Trophy,
      onClick: () => router.push("/results"),
    },
    {
      id: "2",
      title: "Pay Fees",
      description: "Make payment",
      icon: CreditCard,
      onClick: () => router.push("/fees"),
    },
    {
      id: "3",
      title: "Time Table",
      description: "View schedule",
      icon: Calendar,
      onClick: () => router.push("/timetable"),
    },
    {
      id: "4",
      title: "Message Teacher",
      description: "Get in touch",
      icon: MessageSquare,
      onClick: () => router.push("/messages"),
    },
  ];

  return (
    <ParentLayout>
      <div className="space-y-8">

        {/* --- Header --- */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="text-primary font-medium">Priya</span>!
          </p>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Attendance"
            value="94%"
            subtitle="Both children"
            icon={ClipboardCheck}
            iconBgColor="bg-success/20"
            iconColor="text-success"
          />
          <StatCard
            title="Pending Assignments"
            value="3"
            subtitle="2 due this week"
            icon={BookOpen}
            iconBgColor="bg-warning/20"
            iconColor="text-warning"
          />
          <StatCard
            title="Average CGPA"
            value="8.85"
            subtitle="Top 20% of class"
            icon={Trophy}
            iconBgColor="bg-primary/20"
            iconColor="text-primary"
          />
          <StatCard
            title="Pending Fees"
            value="₹15,000"
            subtitle="1 child pending"
            icon={CreditCard}
            iconBgColor="bg-destructive/20"
            iconColor="text-destructive"
          />
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Children & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Children Overview */}
            <ChildrenOverview data={mockChildren} />

            {/* Recent Activity */}
            <RecentActivity activities={mockActivities} />

            {/* Attendance & Fees Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceSummary
                data={{
                  rate: 94,
                  present: 22,
                  absent: 1,
                  leave: 1,
                  childName: "Rahul Sharma - This Month",
                }}
              />
              <FeesSummary
                data={{
                  collectionRate: 75,
                  collected: 45000,
                  pending: 15000,
                  overdue: 0,
                }}
              />
            </div>
          </div>

          {/* Right Column - Quick Actions & Events */}
          <div className="space-y-6">
            <QuickActions actions={quickActions} />
            <UpcomingEvents events={mockEvents} />
          </div>

        </div>
      </div>
    </ParentLayout>
  );
}