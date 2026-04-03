/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface AttendanceStat {
  label: string;
  value: number;
  color: string;
}

export function AttendanceOverview() {
  const [stats, setStats] = useState<AttendanceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch today's attendance data
        const response = await axiosInstance.get("/api/v1/attendance");

        if (response.data?.data) {
          const attendanceData = response.data.data;

          // Calculate statistics
          const totalStudents = attendanceData.total || 0;
          const presentCount = attendanceData.present || 0;
          const absentCount = attendanceData.absent || 0;
          const onLeaveCount = attendanceData.onLeave || 0;

          const attendanceRate = totalStudents > 0 
            ? Math.round((presentCount / totalStudents) * 100)
            : 0;

          const calculatedStats: AttendanceStat[] = [
            { label: "Rate", value: attendanceRate, color: "text-foreground" },
            { label: "Present", value: presentCount, color: "text-success" },
            { label: "Absent", value: absentCount, color: "text-destructive" },
            { label: "On Leave", value: onLeaveCount, color: "text-warning" },
          ];

          setStats(calculatedStats);
        }
      } catch (err: any) {
        console.error("Error fetching today's attendance:", err);
        // Set default stats if API fails
        setStats([
          { label: "Rate", value: 0, color: "text-foreground" },
          { label: "Present", value: 0, color: "text-success" },
          { label: "Absent", value: 0, color: "text-destructive" },
          { label: "On Leave", value: 0, color: "text-warning" },
        ]);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Today’s Attendance
            </h2>
            <p className="text-xs text-muted-foreground">
              Overview of today’s student attendance
            </p>
          </div>

          <a
            href="/teacher/attendance"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            View Details →
          </a>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            Loading attendance...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-medium">
            {error}
          </div>
        ) : (
          <div className="space-y-6">

            {/* MAIN RATE CARD */}
            {stats.find((s) => s.label === "Rate") && (
              <div className="rounded-xl p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Attendance Rate</p>
                  <p className="text-4xl font-bold">
                    {stats.find((s) => s.label === "Rate")?.value}%
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  📊
                </div>
              </div>
            )}

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats
                .filter((s) => s.label !== "Rate")
                .map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-xl p-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center text-center">

                      {/* VALUE */}
                      <p
                        className={`text-3xl font-bold ${
                          stat.label === "Present"
                            ? "text-green-500"
                            : stat.label === "Absent"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {stat.value}
                      </p>

                      {/* LABEL */}
                      <p className="text-sm text-muted-foreground mt-2 font-medium">
                        {stat.label}
                      </p>
                    </div>

                    {/* HOVER GLOW */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-indigo-500/5 to-pink-500/5" />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
