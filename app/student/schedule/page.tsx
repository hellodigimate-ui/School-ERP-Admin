"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/apiHome/axiosInstanc";

/* ----------------------------------
   Constants
----------------------------------- */

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

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
  teacherName: string;
  startTime: string;
  endTime: string;
  periodName?: string;
}

interface ScheduleApiItem {
  id: string;
  day: string;
  subject: string;
  sectionId?: string;
  teacher?: {
    id: string;
    name: string;
  };
  period?: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
}

type WeekSchedule = {
  [key: string]: ClassItem[];
};

/* ----------------------------------
   Page
----------------------------------- */

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [schedules, setSchedules] = useState<ScheduleApiItem[]>([]);
  const [loading, setLoading] = useState(false);

  const dayName = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long" }),
    [],
  );

  const formatTime = (isoTime: string) => {
    try {
      const dt = new Date(isoTime);
      const hours = dt.getUTCHours();
      const minutes = dt.getUTCMinutes();
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    } catch {
      return isoTime;
    }
  };

  const scheduleByDay = useMemo(() => {
    const map: WeekSchedule = {};
    schedules.forEach((schedule) => {
      const dayKey =
        days.find((d) => d.toLowerCase() === schedule.day?.toLowerCase()) ||
        schedule.day;
      if (!dayKey || !schedule.period) return;

      map[dayKey] = map[dayKey] || [];
      map[dayKey].push({
        subject: schedule.subject || "Untitled",
        teacherName: schedule.teacher?.name || "TBD",
        startTime: formatTime(schedule.period.startTime),
        endTime: formatTime(schedule.period.endTime),
        periodName: schedule.period.name,
      });
    });
    return map;
  }, [schedules]);

  const todaySchedules = useMemo(
    () =>
      (scheduleByDay[dayName] || []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    [scheduleByDay, dayName],
  );

  const availableTimeSlots = useMemo(() => {
    const times = new Set<string>();
    schedules.forEach((schedule) => {
      if (schedule.period?.startTime) {
        times.add(formatTime(schedule.period.startTime));
      }
    });
    return Array.from(times).sort();
  }, [schedules]);

  const getClassForSlot = useCallback(
    (day: string, time: string) =>
      scheduleByDay[day]?.find((c) => c.startTime === time),
    [scheduleByDay],
  );

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/schedules");
      setSchedules(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load student schedule", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

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

          {/* <div className="flex items-center gap-2">
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
          </div> */}
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
              {loading ? (
                <div className="text-sm text-muted-foreground">
                  Loading schedule...
                </div>
              ) : todaySchedules.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No classes scheduled for today.
                </div>
              ) : (
                todaySchedules.map((c, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl border p-4 bg-muted/30 hover:shadow-md transition"
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 rounded-l-xl",
                        subjectColors[c.subject] || "bg-slate-500",
                      )}
                    />
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold text-sm">{c.subject}</p>
                      <Badge variant="secondary" className="text-xs">
                        {c.startTime} – {c.endTime}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.teacherName}
                    </p>
                  </div>
                ))
              )}
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
                      <th className="p-2 text-left text-sm text-muted-foreground">
                        Time
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className={cn(
                            "p-2 text-sm font-medium text-center",
                            day === dayName
                              ? "text-emerald-500"
                              : "text-muted-foreground",
                          )}
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(availableTimeSlots.length > 0
                      ? availableTimeSlots
                      : timeSlots
                    ).map((time) => (
                      <tr key={time} className="border-b odd:bg-muted/20">
                        <td className="p-2 text-sm text-muted-foreground">
                          {time}
                        </td>
                        {days.map((day) => {
                          const item = getClassForSlot(day, time);
                          return (
                            <td key={day} className="p-1">
                              {item && (
                                <div
                                  className={cn(
                                    "rounded-lg p-2 text-center text-white shadow-sm hover:scale-[1.03] transition",
                                    subjectColors[item.subject] ||
                                      "bg-slate-500",
                                  )}
                                >
                                  <p className="text-xs font-semibold truncate">
                                    {item.subject}
                                  </p>
                                  <p className="text-[10px] opacity-90">
                                    {item.teacherName}
                                  </p>
                                  {item.periodName && (
                                    <p className="text-[10px] opacity-80 mt-1">
                                      {item.periodName}
                                    </p>
                                  )}
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
                {
                  type: "Exam",
                  title: "Mathematics Mid-Term",
                  date: "Feb 15, 2026 • 10:00 AM",
                  location: "Room 101",
                },
                {
                  type: "Event",
                  title: "Science Exhibition",
                  date: "Feb 20, 2026 • 9:00 AM",
                  location: "Main Hall",
                },
                {
                  type: "Holiday",
                  title: "Republic Day",
                  date: "Jan 26, 2026",
                  location: "School Closed",
                },
              ].map((e) => (
                <div
                  key={e.title}
                  className="relative rounded-xl border p-5 hover:shadow-lg transition"
                >
                  <span
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
                      subjectColors[e.type],
                    )}
                  />
                  <Badge
                    className={cn("mb-3 text-white", subjectColors[e.type])}
                  >
                    {e.type}
                  </Badge>
                  <h4 className="font-semibold text-sm">{e.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{e.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {e.location}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
