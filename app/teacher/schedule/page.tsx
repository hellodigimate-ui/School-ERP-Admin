/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, AlertCircle, RotateCcw } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/apiHome/axiosInstanc";

// const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ScheduleItem {
  day: string;
  time: string;
  duration: number;
  class: string;
  subject: string;
  room: string;
  students: number;
  color: string;
  section?: string;
}

const colorMap: { [key: string]: string } = {
  "primary": "bg-primary",
  "info": "bg-info",
  "success": "bg-success",
  "warning": "bg-warning",
  "accent": "bg-accent",
  "destructive": "bg-destructive",
};

const colors = Object.values(colorMap);

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getTimeSlots = () => {
    if (scheduleData.length === 0) return [];
    const times = new Set<string>();
    scheduleData.forEach((item) => {
      times.add(item.time);
    });
    return Array.from(times).sort((a, b) => {
      const timeA = new Date(`1970-01-01 ${a}`);
      const timeB = new Date(`1970-01-01 ${b}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  const getDaysFromData = () => {
    if (scheduleData.length === 0) return [];
    const dayOrder: { [key: string]: number } = {
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6,
      "Sunday": 0,
    };
    
    const uniqueDays = Array.from(new Set(scheduleData.map((item) => item.day)));
    return uniqueDays.sort((a, b) => (dayOrder[a] || 99) - (dayOrder[b] || 99));
  };

  const formatTime = (isoTime: string): string => {
    try {
      // Parse ISO time like "1970-01-01T11:15:00.000Z"
      const date = new Date(isoTime);
      // const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      
      const hour12 = date.getUTCHours() % 12 || 12;
      const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";
      
      return `${String(hour12).padStart(2, "0")}:${minutes} ${ampm}`;
    } catch {
      return "N/A";
    }
  };

  const formatDay = (dayString: string): string => {
    if (!dayString) return "";
    return dayString.charAt(0).toUpperCase() + dayString.slice(1).toLowerCase();
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    } catch {
      return 1;
    }
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/api/v1/schedules/teacher");

      if (response.data?.data && Array.isArray(response.data.data)) {
        const transformed = response.data.data.map((schedule: any, index: number) => ({
          day: formatDay(schedule.day),
          time: formatTime(schedule.period?.startTime || ""),
          duration: calculateDuration(schedule.period?.startTime, schedule.period?.endTime),
          class: schedule.subject || "N/A",
          subject: schedule.subject || "N/A",
          room: `${schedule.section?.class?.name || ""} - Section ${schedule.section?.name || ""}`,
          students: schedule.section?.capacity || 0,
          color: colors[index % colors.length],
          section: schedule.section?.name,
        }));

        setScheduleData(transformed);
      } else {
        setError("No schedule data received");
      }
    } catch (err: any) {
      console.error("Error fetching schedule:", err);
      if (err.response?.status === 403) {
        setError("Access denied: You don't have permission to view schedules.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed: Please login again.");
      } else if (err.response?.status === 404) {
        setError("Teacher schedule not found or not assigned to any section.");
      } else {
        setError(err.response?.data?.message || "Failed to load schedule. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const timeSlots = getTimeSlots();

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const getClassForSlot = (day: string, time: string) => {
    return scheduleData.find((item) => item.day === day && item.time === time);
  };

  const todayClasses = scheduleData.filter((item) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return item.day === today;
  });

  const totalStudents = scheduleData.reduce((sum, item) => sum + item.students, 0);
  const totalHours = scheduleData.reduce((sum, item) => sum + item.duration, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background w-full">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader teacherName="Teacher" />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading schedule...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-destructive font-medium">Failed to Load Schedule</p>
                <p className="text-destructive/80 text-sm mt-1">{error}</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchSchedule} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
              <p className="text-muted-foreground">View and manage your weekly schedule</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 font-medium">{getWeekRange()}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
                Today
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Weekly Schedule */}
            <div className="lg:col-span-3 dashboard-section flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>

              {scheduleData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No schedule data available</p>
                </div>
              ) : viewMode === "grid" ? (
                // GRID VIEW
                <div className="overflow-auto flex-1">
                  <div className="min-w-[900px]">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `80px repeat(${getDaysFromData().length}, 1fr)` }}>
                      {/* Header */}
                      <div className="p-3 font-medium text-muted-foreground sticky left-0 bg-background z-10">Time</div>
                      {getDaysFromData().map((day) => (
                        <div key={day} className="p-3 font-medium text-center bg-muted/50 rounded-lg sticky top-0 z-10">
                          {day}
                        </div>
                      ))}

                      {/* Time Slots */}
                      {timeSlots.map((time) => (
                        <React.Fragment key={time}>
                          <div className="p-3 text-sm text-muted-foreground border-t border-border font-medium sticky left-0 bg-background">
                            {time}
                          </div>
                          {getDaysFromData().map((day) => {
                            const classItem = getClassForSlot(day, time);
                            return (
                              <div key={`${day}-${time}`} className="p-1 border-t border-border min-h-[70px] flex items-center">
                                {classItem && (
                                  <div className={cn("p-3 rounded-lg text-primary-foreground w-full text-center", classItem.color)}>
                                    <p className="font-bold text-sm">{classItem.subject}</p>
                                    <p className="text-xs opacity-90">Section {classItem.section}</p>
                                    <p className="text-xs opacity-75">{classItem.room.split(" - ")[0]}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // LIST VIEW - Shows all classes
                <div className="space-y-3 flex-1 overflow-auto">
                  {scheduleData.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border-2 text-white flex items-center justify-between",
                        item.color
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-bold text-lg">{item.subject}</p>
                        <p className="text-sm opacity-90">
                          {item.day} • {item.time}
                        </p>
                        <p className="text-sm opacity-90">
                          Section {item.section} • {item.room.split(" - ")[0]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">{item.students} students</p>
                        <p className="text-xs opacity-75">{item.duration.toFixed(1)}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Classes */}
            <div className="space-y-6">
              <div className="dashboard-section">
                <h2 className="text-lg font-semibold mb-4">Today`s Classes</h2>
                {todayClasses.length > 0 ? (
                  <div className="space-y-3">
                    {todayClasses.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn("w-3 h-3 rounded-full", item.color)} />
                          <span className="font-medium">{item.subject}</span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{item.room}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>{item.students} students</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No classes today</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="dashboard-section">
                <h2 className="text-lg font-semibold mb-4">This Week</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Classes</span>
                    <Badge variant="secondary">{scheduleData.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teaching Hours</span>
                    <Badge variant="secondary">{totalHours.toFixed(1)}h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <Badge variant="secondary">{totalStudents}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
