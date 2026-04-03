"use client";

import { Achievement, Schedule, Sport, StudentEnrollment, Tournament } from "@/components/coach/coach";
import Layout from "@/components/coach/coachLayout";
import StatsCard from "@/components/coach/statCard";
import { useLocalStorage } from "@/components/coach/useLocalStorage";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Users,
  Trophy,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";



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
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#ec4899",
];

export default function CoachDashboard() {
  const [sports] = useLocalStorage<Sport[]>("coach_sports", []);
  const [enrollments] = useLocalStorage<StudentEnrollment[]>("coach_enrollments", []);
  const [tournaments] = useLocalStorage<Tournament[]>("coach_tournaments", []);
  const [achievements] = useLocalStorage<Achievement[]>("coach_achievements", []);
  const [schedules] = useLocalStorage<Schedule[]>("coach_schedules", []);

  // ✅ Derived Data
  const enrollmentBySport = sports.map((s) => ({
    name: s.name,
    students: enrollments.filter((e) => e.sportId === s.id).length,
  }));

  const tournamentByStatus = [
    {
      name: "Upcoming",
      value: tournaments.filter((t) => t.status === "upcoming").length,
    },
    {
      name: "Ongoing",
      value: tournaments.filter((t) => t.status === "ongoing").length,
    },
    {
      name: "Completed",
      value: tournaments.filter((t) => t.status === "completed").length,
    },
  ].filter((t) => t.value > 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const monthlyData = [
    { month: "Jan", students: 12, events: 2 },
    { month: "Feb", students: 18, events: 3 },
    { month: "Mar", students: 24, events: 4 },
    { month: "Apr", students: 30, events: 3 },
    { month: "May", students: 28, events: 5 },
    { month: "Jun", students: 35, events: 4 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold">
            Welcome back, Coach! 🏆
          </h1>
          <p className="text-muted-foreground mt-1">
            Here`s your sports management overview
          </p>
        </motion.div>

        {/* Stats Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sports"
            value={sports.length}
            icon={Dumbbell}
            gradient="from-violet-500 to-purple-600"
            subtitle="Active programs"
          />

          <StatsCard
            title="Enrolled Students"
            value={enrollments.filter((e) => e.status === "active").length}
            icon={Users}
            gradient="from-emerald-500 to-teal-600"
            subtitle="Active enrollments"
          />

          <StatsCard
            title="Tournaments"
            value={tournaments.length}
            icon={Trophy}
            gradient="from-amber-500 to-orange-600"
            subtitle={`${tournaments.filter((t) => t.status === "upcoming").length} upcoming`}
          />

          <StatsCard
            title="Achievements"
            value={achievements.length}
            icon={Award}
            gradient="from-rose-500 to-pink-600"
            subtitle="Total awards"
          />
        </div>

        {/* Stats Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Sessions"
            value={schedules.filter((s) => s.day === today).length}
            icon={Calendar}
            gradient="from-cyan-500 to-blue-600"
          />

          <StatsCard
            title="Active Sports"
            value={sports.filter((s) => s.status === "active").length}
            icon={Target}
            gradient="from-indigo-500 to-violet-600"
          />

          <StatsCard
            title="Schedules"
            value={schedules.length}
            icon={Clock}
            gradient="from-pink-500 to-rose-600"
          />

          <StatsCard
            title="Win Rate"
            value="--"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-600"
            subtitle="Track in tournaments"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow border"
          >
            <h3 className="text-lg font-semibold mb-4">
              Students per Sport
            </h3>

            {enrollmentBySport.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={enrollmentBySport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                    {enrollmentBySport.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Add sports & enroll students to see chart
              </div>
            )}
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow border"
          >
            <h3 className="text-lg font-semibold mb-4">
              Tournament Status
            </h3>

            {tournamentByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tournamentByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {tournamentByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Add tournaments to see chart
              </div>
            )}
          </motion.div>
        </div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow border"
        >
          <h3 className="text-lg font-semibold mb-4">
            Monthly Trends
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#06b6d4"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </Layout>
  );
}