"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, FileText, Award, ClipboardList } from "lucide-react";

import { StudentLayout } from "@/components/student/StudentLayout";
import { StatCard } from "@/components/student/StatCard";
import { TodaysClasses } from "@/components/student/TodaysClasses";
import { QuickActions } from "@/components/student/QuickActions";
import { UpcomingEvents } from "@/components/student/UpcomingEvents";
import { AttendanceCard } from "@/components/student/AttendanceCard";
import { FeeStatus } from "@/components/student/FeeStatus";
import { FeeBreakdown } from "@/components/student/FeeBreakdown";
import { PaymentHistory } from "@/components/student/PaymentHistory";
import { SummaryCards } from "@/components/student/SummaryCards";
import { axiosInstance } from "@/apiHome/axiosInstanc";

/* ----------------------------------
   Page
----------------------------------- */

export default function StudentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [feeStatus, setFeeStatus] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stats
        const statsRes = await axiosInstance.get("/api/v1/students/stats");
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // Fetch schedule
        try {
          setScheduleLoading(true);
          const scheduleRes = await axiosInstance.get("/api/v1/schedules");
          if (scheduleRes.data.success) {
            setSchedule(scheduleRes.data.data || []);
          }
        } catch (scheduleError: any) {
          console.warn("Schedule fetch failed:", scheduleError.message);
        } finally {
          setScheduleLoading(false);
        }

        // Fetch fee status (optional - won't block dashboard if fails)
        try {
          const feeRes = await axiosInstance.get("/api/v1/students/fee-status");
          if (feeRes.data.success) {
            setFeeStatus(feeRes.data.data);
          }
        } catch (feeError: any) {
          console.warn("Fee status fetch failed:", feeError.message);
          // Continue without fee status data - dashboard will use stats fallback
        }

        // Fetch upcoming events
        const eventsRes = await axiosInstance.get("/api/v1/events/upcoming");
        if (eventsRes.data.success) {
          setUpcomingEvents(eventsRes.data.data || []);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          Loading dashboard...
        </div>
      </StudentLayout>
    );
  }

  if (error || !stats) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-red-600">
          {error || "No data available"}
        </div>
      </StudentLayout>
    );
  }

  const attendanceRate = stats.attendanceCount
    ? `${stats.attendanceCount}%`
    : "N/A";
  const assignmentsPending = stats.homeworkCount || 0;
  const totalFee = stats.totalFee || 0;
  const feeDueDate = stats.dueDate
    ? new Date(stats.dueDate).toLocaleDateString()
    : "N/A";
  const enrolledCourses = stats.enrolledCourses || 1; // fallback

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back,{" "}
              <span className="font-medium text-foreground">Rahul</span>
            </p>
          </div>

          <div className="text-sm text-muted-foreground">{formattedDate}</div>

          {/* Accent line */}
          <span className="absolute bottom-0 left-0 h-0.5 w-24 bg-gradient-to-r from-primary to-transparent" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Attendance"
            value={`${stats.attendanceCount || 0}`}
            subtitle="Days present"
            icon={CalendarCheck}
            color="teal"
          />
          <StatCard
            title="Upcoming Homework"
            value={`${stats.homeworkCount || 0}`}
            subtitle="Pending assignments"
            icon={ClipboardList}
            color="yellow"
          />
          <StatCard
            title="Total Fee"
            value={`₹${totalFee}`}
            subtitle={`Due date ${feeDueDate}`}
            icon={Award}
            color="green"
          />
          <StatCard
            title="Enrolled Courses"
            value={`${enrolledCourses}`}
            subtitle="Based on section"
            icon={FileText}
            color="blue"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            <TodaysClasses classes={schedule} loading={scheduleLoading} />
            <AttendanceCard
              data={{
                rate: attendanceRate,
                present: stats.attendanceCount || 0,
                absent: stats.absentCount || 0,
                onLeave: stats.onLeaveCount || 0,
              }}
            />
            <SummaryCards />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions />
            <UpcomingEvents
              events={upcomingEvents.map((event: any) => ({
                id: event.id,
                title: event.name,
                date: event.date,
                time: new Date(event.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                description: event.description,
              }))}
            />
            <FeeStatus
              totalFee={feeStatus?.totalFee || stats?.totalFee || 0}
              totalPaid={feeStatus?.totalPaid || 0}
              pendingFee={feeStatus?.pendingFee || stats?.pendingFee || 0}
              overdueFee={feeStatus?.overdueFee || stats?.overdueFee || 0}
              dueDate={feeStatus?.dueDate || stats?.dueDate}
              isOverdue={feeStatus?.isOverdue || false}
              status={feeStatus?.status || "PENDING"}
            />
            {feeStatus?.feeBreakdown && (
              <FeeBreakdown
                admissionFee={feeStatus.feeBreakdown.admissionFee}
                tutionFee={feeStatus.feeBreakdown.tutionFee}
                transportFee={feeStatus.feeBreakdown.transportFee}
                hostelFee={feeStatus.feeBreakdown.hostelFee}
                otherFee={feeStatus.feeBreakdown.otherFee}
                depositFee={feeStatus.feeBreakdown.depositFee}
                totalDiscount={feeStatus.totalDiscount}
              />
            )}
            {feeStatus?.paymentHistory &&
              feeStatus.paymentHistory.length > 0 && (
                <PaymentHistory payments={feeStatus.paymentHistory} />
              )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
