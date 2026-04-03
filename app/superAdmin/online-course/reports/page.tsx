"use client"

import { AdminLayout } from "@/components/layout/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const enrollmentData = [
  { month: "Jan", students: 20 },
  { month: "Feb", students: 35 },
  { month: "Mar", students: 28 },
  { month: "Apr", students: 45 },
  { month: "May", students: 52 },
  { month: "Jun", students: 40 },
];

const completionData = [
  { name: "Completed", value: 45, color: "hsl(160, 70%, 42%)" },
  { name: "In Progress", value: 30, color: "hsl(210, 100%, 55%)" },
  { name: "Not Started", value: 25, color: "hsl(220, 14%, 90%)" },
];

const performanceData = [
  { month: "Jan", avgScore: 72, passRate: 85 },
  { month: "Feb", avgScore: 68, passRate: 80 },
  { month: "Mar", avgScore: 75, passRate: 88 },
  { month: "Apr", avgScore: 80, passRate: 92 },
  { month: "May", avgScore: 78, passRate: 90 },
  { month: "Jun", avgScore: 82, passRate: 93 },
];

const topCourses = [
  { name: "Mathematics - Class 10", enrolled: 45, completion: 65 },
  { name: "Computer Science", enrolled: 60, completion: 55 },
  { name: "English Literature", enrolled: 52, completion: 80 },
  { name: "Science - Class 9", enrolled: 38, completion: 42 },
];

const Page = () => {
  return (
    <AdminLayout>
        <div className="space-y-8">

        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-foreground">Course Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Analytics and insights for online courses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
            { label: "Total Enrollments", value: "267", change: "+18%", gradient: "from-purple-500 to-pink-500" },
            { label: "Avg. Completion", value: "62%", change: "+5%", gradient: "from-green-400 to-green-300" },
            { label: "Avg. Score", value: "76%", change: "+3%", gradient: "from-blue-400 to-blue-300" },
            { label: "Pass Rate", value: "88%", change: "+2%", gradient: "from-yellow-400 to-yellow-300" },
            ].map(s => (
            <div key={s.label} className={`rounded-xl p-5 shadow-md bg-gradient-to-r ${s.gradient} text-white hover:scale-105 transition-transform`}>
                <p className="text-xs uppercase tracking-wide opacity-80">{s.label}</p>
                <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold">{s.value}</p>
                <span className="text-sm font-medium">{s.change}</span>
                </div>
            </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Enrollment Chart */}
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-200 transition-shadow">
            <h3 className="font-semibold text-foreground mb-4">Monthly Enrollments</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: 8, backgroundColor: "#f9fafb" }} />
                <Bar dataKey="students" fill="url(#colorEnroll)" radius={[6,6,0,0]} />
                <defs>
                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(210,100%,55%)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(210,100%,55%)" stopOpacity={0.3}/>
                    </linearGradient>
                </defs>
                </BarChart>
            </ResponsiveContainer>
            </div>

            {/* Completion Pie */}
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-200 transition-shadow">
            <h3 className="font-semibold text-foreground mb-4">Course Completion Status</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                    {completionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, backgroundColor: "#f9fafb" }} />
                <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
            </div>

            {/* Performance Line Chart */}
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-200 transition-shadow">
            <h3 className="font-semibold text-foreground mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: 8, backgroundColor: "#f9fafb" }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="hsl(210,100%,55%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="passRate" name="Pass Rate" stroke="hsl(160,70%,42%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-200 transition-shadow">
            <h3 className="font-semibold text-foreground mb-4">Top Courses</h3>
            <div className="space-y-4">
                {topCourses.map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                    <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-400">{c.enrolled} enrolled</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all" style={{ width: `${c.completion}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{c.completion}%</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

        </div>
        </div>
    </AdminLayout>
  );
};

export default Page;