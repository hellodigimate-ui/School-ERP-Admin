/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface ScheduleItem {
  time: string;
  subject: string;
  class: string;
  room: string;
  status: "completed" | "ongoing" | "upcoming";
}

export function TodaySchedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaySchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get("/api/v1/schedules/teacher");

        if (response.data?.data && Array.isArray(response.data.data)) {
          // Get today's day
          const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
          
          // Filter today's classes from the API response
          const todaySchedule = response.data.data
            .filter((schedule: any) => {
              const scheduleDay = schedule.day?.charAt(0).toUpperCase() + schedule.day?.slice(1).toLowerCase();
              return scheduleDay === today;
            })
            .map((schedule: any) => {
              // Format time from ISO format
              const startTime = formatTime(schedule.period?.startTime || "");
              const endTime = formatTime(schedule.period?.endTime || "");
              
              // Determine status based on current time
              const now = new Date();
              const scheduleStartTime = new Date(schedule.period?.startTime || "");
              const scheduleEndTime = new Date(schedule.period?.endTime || "");
              
              let status: "completed" | "ongoing" | "upcoming" = "upcoming";
              if (now < scheduleStartTime) {
                status = "upcoming";
              } else if (now >= scheduleStartTime && now <= scheduleEndTime) {
                status = "ongoing";
              } else if (now > scheduleEndTime) {
                status = "completed";
              }

              return {
                time: `${startTime} - ${endTime}`,
                subject: schedule.subject || "N/A",
                class: `${schedule.section?.class?.name || ""} - Section ${schedule.section?.name || ""}`,
                room: `Room ${schedule.room || "N/A"}`,
                status: status,
              };
            })
            .sort((a: ScheduleItem, b: ScheduleItem) => {
              // Sort by time
              const aTime = new Date(`1970-01-01 ${a.time.split(" - ")[0]}`);
              const bTime = new Date(`1970-01-01 ${b.time.split(" - ")[0]}`);
              return aTime.getTime() - bTime.getTime();
            });

          setScheduleItems(todaySchedule);
        }
      } catch (err: any) {
        console.error("Error fetching today's schedule:", err);
        setError("Failed to load today's schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchTodaySchedule();
  }, []);

  const formatTime = (isoTime: string): string => {
    try {
      const date = new Date(isoTime);
      const hour12 = date.getUTCHours() % 12 || 12;
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";
      return `${String(hour12).padStart(2, "0")}:${minutes} ${ampm}`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Today’s Schedule
            </h2>
            <p className="text-xs text-muted-foreground">
              Your classes for today
            </p>
          </div>

          <a
            href="/teacher/schedule"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            View All →
          </a>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            Loading schedule...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-medium">
            {error}
          </div>
        ) : scheduleItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            🎉 No classes today — enjoy your free time!
          </div>
        ) : (
          <div className="space-y-4">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border group
                
                ${
                  item.status === "ongoing"
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md"
                    : item.status === "completed"
                    ? "bg-gray-100 border-gray-200 opacity-80"
                    : "bg-white/70 hover:bg-indigo-50 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {/* LEFT TIME BADGE */}
                <div className="flex flex-col items-center justify-center w-20 text-center">
                  <Clock className="w-4 h-4 mb-1 text-muted-foreground" />
                  <span className="text-xs font-semibold">
                    {item.time}
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="w-[2px] h-10 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full opacity-40" />

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-indigo-600 transition">
                    {item.subject}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.class} • {item.room}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  {item.status === "ongoing" && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white shadow">
                      🔥 Live
                    </span>
                  )}

                  {item.status === "completed" && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-400 text-white">
                      ✔ Done
                    </span>
                  )}

                  {item.status === "upcoming" && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white shadow">
                      ⏳ Upcoming
                    </span>
                  )}
                </div>

                {/* HOVER GLOW */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-indigo-500/5 to-pink-500/5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
