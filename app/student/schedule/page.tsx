"use client";

import { useState, useMemo, useCallback } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------
   Constants
----------------------------------- */

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-emerald-500",
  Physics: "bg-blue-500",
  Chemistry: "bg-violet-500",
  English: "bg-amber-500",
  "Computer Science": "bg-indigo-500",
  History: "bg-orange-500",
  "Physical Education": "bg-pink-500",
  Exam: "bg-red-500",
  Event: "bg-sky-500",
  Holiday: "bg-green-500",
};

interface ClassItem {
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
}

type WeekSchedule = {
  [key: string]: ClassItem[];
};

/* ----------------------------------
   Mock Data
----------------------------------- */

const weekSchedule: WeekSchedule = {
  Monday: [
    { subject: "Mathematics", teacher: "Mrs. Sharma", room: "Room 101", startTime: "08:00", endTime: "09:00" },
    { subject: "Physics", teacher: "Mr. Patel", room: "Lab 2", startTime: "10:00", endTime: "11:00" },
    { subject: "English", teacher: "Mrs. Gupta", room: "Room 203", startTime: "14:00", endTime: "15:00" },
  ],
  Tuesday: [
    { subject: "Chemistry", teacher: "Dr. Singh", room: "Lab 1", startTime: "09:00", endTime: "10:00" },
    { subject: "Computer Science", teacher: "Mr. Kumar", room: "IT Lab", startTime: "11:00", endTime: "12:00" },
  ],
  Wednesday: [
    { subject: "Physics", teacher: "Mr. Patel", room: "Lab 2", startTime: "08:00", endTime: "09:00" },
    { subject: "History", teacher: "Mr. Verma", room: "Room 105", startTime: "13:00", endTime: "14:00" },
  ],
  Thursday: [
    { subject: "Chemistry", teacher: "Dr. Singh", room: "Lab 1", startTime: "08:00", endTime: "09:00" },
    { subject: "Mathematics", teacher: "Mrs. Sharma", room: "Room 101", startTime: "11:00", endTime: "12:00" },
  ],
  Friday: [
    { subject: "Computer Science", teacher: "Mr. Kumar", room: "IT Lab", startTime: "09:00", endTime: "10:00" },
    { subject: "English", teacher: "Mrs. Gupta", room: "Room 203", startTime: "14:00", endTime: "15:00" },
  ],
  Saturday: [
    { subject: "Mathematics", teacher: "Mrs. Sharma", room: "Room 101", startTime: "08:00", endTime: "09:00" },
  ],
};

const todaysClasses: ClassItem[] = [
  { subject: "Mathematics", teacher: "Mrs. Sharma", room: "Room 101", startTime: "08:00", endTime: "09:00" },
  { subject: "Physics", teacher: "Mr. Patel", room: "Lab 2", startTime: "10:00", endTime: "11:00" },
  { subject: "English", teacher: "Mrs. Gupta", room: "Room 203", startTime: "14:00", endTime: "15:00" },
];

/* ----------------------------------
   Page
----------------------------------- */

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(0);

  const dayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    []
  );

  const getClassForSlot = useCallback(
    (day: string, time: string) =>
      weekSchedule[day]?.find((c) => c.startTime === time),
    []
  );

  return (
    <StudentLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Schedule</h1>
            <p className="text-sm text-muted-foreground">
              View your class timetable
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={() => setCurrentWeek((w) => w - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {currentWeek === 0
                ? "This Week"
                : currentWeek > 0
                ? `${currentWeek} week(s) ahead`
                : `${Math.abs(currentWeek)} week(s) ago`}
            </span>
            <Button size="icon" variant="outline" onClick={() => setCurrentWeek((w) => w + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                Today’s Classes
              </CardTitle>
              <p className="text-sm text-muted-foreground">{dayName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysClasses.map((c, i) => (
                <div
                  key={i}
                  className="relative rounded-xl border p-4 bg-muted/30 hover:shadow-md transition"
                >
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-full w-1 rounded-l-xl",
                      subjectColors[c.subject]
                    )}
                  />
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold text-sm">{c.subject}</p>
                    <Badge variant="secondary" className="text-xs">
                      {c.startTime} – {c.endTime}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.teacher}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{c.room}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Timetable */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left text-sm text-muted-foreground">Time</th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className={cn(
                            "p-2 text-sm font-medium text-center",
                            day === dayName ? "text-emerald-500" : "text-muted-foreground"
                          )}
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time} className="border-b odd:bg-muted/20">
                        <td className="p-2 text-sm text-muted-foreground">{time}</td>
                        {days.map((day) => {
                          const item = getClassForSlot(day, time);
                          return (
                            <td key={day} className="p-1">
                              {item && (
                                <div
                                  className={cn(
                                    "rounded-lg p-2 text-center text-white shadow-sm hover:scale-[1.03] transition",
                                    subjectColors[item.subject]
                                  )}
                                >
                                  <p className="text-xs font-semibold truncate">{item.subject}</p>
                                  <p className="text-[10px] opacity-90">{item.room}</p>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams & Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { type: "Exam", title: "Mathematics Mid-Term", date: "Feb 15, 2026 • 10:00 AM", location: "Room 101" },
                { type: "Event", title: "Science Exhibition", date: "Feb 20, 2026 • 9:00 AM", location: "Main Hall" },
                { type: "Holiday", title: "Republic Day", date: "Jan 26, 2026", location: "School Closed" },
              ].map((e) => (
                <div
                  key={e.title}
                  className="relative rounded-xl border p-5 hover:shadow-lg transition"
                >
                  <span
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
                      subjectColors[e.type]
                    )}
                  />
                  <Badge className={cn("mb-3 text-white", subjectColors[e.type])}>
                    {e.type}
                  </Badge>
                  <h4 className="font-semibold text-sm">{e.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{e.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{e.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </StudentLayout>
  );
}
