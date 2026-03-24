"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const scheduleData = [
  { day: "Monday", time: "9:00 AM", duration: 2, class: "Mathematics 101", room: "Room 204", students: 32, color: "bg-primary" },
  { day: "Monday", time: "2:00 PM", duration: 2, class: "Calculus", room: "Room 315", students: 24, color: "bg-info" },
  { day: "Tuesday", time: "10:00 AM", duration: 2, class: "Algebra II", room: "Room 108", students: 28, color: "bg-success" },
  { day: "Tuesday", time: "1:00 PM", duration: 2, class: "Geometry", room: "Room 212", students: 35, color: "bg-warning" },
  { day: "Wednesday", time: "9:00 AM", duration: 2, class: "Mathematics 101", room: "Room 204", students: 32, color: "bg-primary" },
  { day: "Wednesday", time: "2:00 PM", duration: 2, class: "Calculus", room: "Room 315", students: 24, color: "bg-info" },
  { day: "Thursday", time: "10:00 AM", duration: 2, class: "Algebra II", room: "Room 108", students: 28, color: "bg-success" },
  { day: "Thursday", time: "1:00 PM", duration: 2, class: "Geometry", room: "Room 212", students: 35, color: "bg-warning" },
  { day: "Friday", time: "9:00 AM", duration: 2, class: "Mathematics 101", room: "Room 204", students: 32, color: "bg-primary" },
  { day: "Friday", time: "11:00 AM", duration: 1, class: "Statistics", room: "Room 101", students: 36, color: "bg-accent" },
];

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

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

  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
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
            <div className="lg:col-span-3 dashboard-section overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
              <div className="min-w-[800px]">
                <div className="grid grid-cols-6 gap-2">
                  {/* Header */}
                  <div className="p-3 font-medium text-muted-foreground">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-3 font-medium text-center bg-muted/50 rounded-lg">
                      {day}
                    </div>
                  ))}

                  {/* Time Slots */}
                  {timeSlots.map((time) => (
                    <>
                      <div key={time} className="p-3 text-sm text-muted-foreground border-t border-border">
                        {time}
                      </div>
                      {weekDays.map((day) => {
                        const classItem = getClassForSlot(day, time);
                        return (
                          <div key={`${day}-${time}`} className="p-1 border-t border-border min-h-[60px]">
                            {classItem && (
                              <div className={cn("p-2 rounded-lg text-primary-foreground", classItem.color)}>
                                <p className="font-medium text-sm">{classItem.class}</p>
                                <p className="text-xs opacity-90">{classItem.room}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
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
                          <span className="font-medium">{item.class}</span>
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
                    <Badge variant="secondary">{scheduleData.reduce((sum, c) => sum + c.duration, 0)}h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <Badge variant="secondary">155</Badge>
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
