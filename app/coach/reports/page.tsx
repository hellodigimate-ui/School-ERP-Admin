"use client";

import { motion } from "framer-motion";
// import { useLocalStorage } from "@/hooks/useLocalStorage";
// import {
//   Sport,
//   StudentEnrollment,
//   Tournament,
//   Achievement,
//   Schedule,
//   Attendance,
// } from "@";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/components/coach/useLocalStorage";
import { Achievement, Attendance, Schedule, Sport, StudentEnrollment, Tournament } from "@/components/coach/coach";
import Layout from "@/components/coach/coachLayout";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#ec4899"];

export default function ReportsPage() {
  const [sports] = useLocalStorage<Sport[]>("coach_sports", []);
  const [enrollments] = useLocalStorage<StudentEnrollment[]>("coach_enrollments", []);
  const [tournaments] = useLocalStorage<Tournament[]>("coach_tournaments", []);
  const [achievements] = useLocalStorage<Achievement[]>("coach_achievements", []);
  const [schedules] = useLocalStorage<Schedule[]>("coach_schedules", []);
  const [attendance] = useLocalStorage<Attendance[]>("coach_attendance", []);

  const enrollmentData = sports.map((s) => ({
    name: s.name,
    count: enrollments.filter((e) => e.sportId === s.id).length,
  }));

  const attendanceData = [
    { name: "Present", value: attendance.filter((a) => a.status === "present").length },
    { name: "Absent", value: attendance.filter((a) => a.status === "absent").length },
    { name: "Late", value: attendance.filter((a) => a.status === "late").length },
    { name: "Excused", value: attendance.filter((a) => a.status === "excused").length },
  ].filter((a) => a.value > 0);

  const exportCSV = () => {
    const rows = [["Sport", "Enrolled", "Schedules", "Tournaments", "Achievements"]];

    sports.forEach((s) => {
      rows.push([
        s.name,
        String(enrollments.filter((e) => e.sportId === s.id).length),
        String(schedules.filter((sc) => sc.sportId === s.id).length),
        String(tournaments.filter((t) => t.sportId === s.id).length),
        String(achievements.filter((a) => a.sportName === s.name).length),
      ]);
    });

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "coach-report.csv";
    a.click();

    URL.revokeObjectURL(url);

    toast({ title: "Report exported!" });
  };

  const cards = [
    { label: "Total Sports", value: sports.length, color: "gradient-primary" },
    { label: "Students Enrolled", value: enrollments.length, color: "gradient-secondary" },
    { label: "Total Tournaments", value: tournaments.length, color: "gradient-accent" },
    { label: "Total Achievements", value: achievements.length, color: "gradient-info" },
    { label: "Schedules", value: schedules.length, color: "bg-success" },
    { label: "Attendance Records", value: attendance.length, color: "bg-destructive" },
  ];

  return (
    <Layout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Reports & Analytics
            </h2>
            <p className="text-sm text-muted-foreground">
                Overview of all coach panel data
            </p>
            </div>

            <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
            </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((c, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`${c.color} rounded-2xl p-4 text-center text-white shadow-lg`}
            >
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs opacity-80">{c.label}</p>
            </motion.div>
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-card rounded-2xl p-6 shadow border">
            <h3 className="font-semibold mb-4">Enrollment by Sport</h3>

            {enrollmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {enrollmentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data yet
                </div>
            )}
            </div>

            {/* Pie Chart */}
            <div className="bg-card rounded-2xl p-6 shadow border">
            <h3 className="font-semibold mb-4">Attendance Distribution</h3>

            {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    >
                    {attendanceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data yet
                </div>
            )}
            </div>
        </div>
        </div>
    </Layout>
  );
}