"use client"

import HRChart from "@/components/hrPanel/hrCharts";
import Layout from "@/components/hrPanel/layout";
import StatCard from "@/components/hrPanel/statCard";
import {
  Users,
  CalendarCheck,
  ClipboardCheck,
  Star,
  UserX,
  Building2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const attendanceData = [
  { day: "Mon", present: 42, absent: 3, late: 2 },
  { day: "Tue", present: 44, absent: 1, late: 2 },
  { day: "Wed", present: 40, absent: 4, late: 3 },
  { day: "Thu", present: 43, absent: 2, late: 2 },
  { day: "Fri", present: 41, absent: 3, late: 3 },
  { day: "Sat", present: 38, absent: 5, late: 4 },
];

const departmentData = [
  { name: "Teaching", value: 28, color: "hsl(217, 91%, 50%)" },
  { name: "Admin", value: 8, color: "hsl(262, 83%, 58%)" },
  { name: "Support", value: 6, color: "hsl(152, 69%, 45%)" },
  { name: "Lab", value: 5, color: "hsl(38, 92%, 50%)" },
];

const recentLeaves = [
  { name: "Mrs. Sharma", type: "Sick Leave", days: 2, status: "Pending", avatar: "MS" },
  { name: "Mr. Patel", type: "Casual Leave", days: 1, status: "Approved", avatar: "MP" },
  { name: "Ms. Gupta", type: "Personal Leave", days: 3, status: "Pending", avatar: "MG" },
  { name: "Mr. Singh", type: "Medical Leave", days: 5, status: "Rejected", avatar: "RS" },
  { name: "Mrs. Verma", type: "Casual Leave", days: 1, status: "Approved", avatar: "SV" },
];

const topRatedTeachers = [
  { name: "Dr. Anita Roy", subject: "Mathematics", rating: 4.9 },
  { name: "Mr. Vikram Das", subject: "Physics", rating: 4.8 },
  { name: "Mrs. Priya Nair", subject: "English", rating: 4.7 },
  { name: "Mr. Arjun Mehta", subject: "Chemistry", rating: 4.6 },
  { name: "Ms. Kavita Joshi", subject: "Biology", rating: 4.5 },
];

const upcomingEvents = [
  { date: "MAR 03", title: "Staff Meeting", location: "Conference Room" },
  { date: "MAR 10", title: "Performance Review Deadline", location: "HR Office" },
  { date: "MAR 15", title: "Training Workshop", location: "Auditorium" },
  { date: "MAR 22", title: "Payroll Processing", location: "Accounts" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Approved: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">HR Dashboard</h1>
          
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here`s your overview for today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Staff" value={47} change="+2 this month" changeType="positive" icon={Users} color="primary" />
          <StatCard title="Present Today" value={42} change="89.4% attendance" changeType="positive" icon={CalendarCheck} color="success" />
          <StatCard title="Pending Leaves" value={8} change="3 urgent" changeType="negative" icon={ClipboardCheck} color="warning" />
          <StatCard title="Avg. Rating" value="4.6" change="+0.2 from last month" changeType="positive" icon={Star} color="accent" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Weekly Staff Attendance</h2>
              <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="present" fill="hsl(152, 69%, 45%)" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Absent" />
                <Bar dataKey="late" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="stat-card">
            <h2 className="font-semibold text-foreground mb-4">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {departmentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="text-muted-foreground">{dept.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{dept.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Leaves */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Leave Requests</h2>
              <button className="text-xs text-primary font-medium hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {recentLeaves.map((leave, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    {leave.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{leave.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.type} · {leave.days} day{leave.days > 1 ? "s" : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[leave.status]}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Teachers */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Top Rated Teachers</h2>
              <Star className="w-5 h-5 text-warning" />
            </div>
            <div className="space-y-3">
              {topRatedTeachers.map((teacher, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    <span className="text-sm font-semibold text-foreground">{teacher.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Upcoming Events</h2>
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-primary leading-none">{event.date.split(" ")[0]}</span>
                    <span className="text-base font-bold text-primary leading-tight">{event.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <HRChart/>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Designations" value={12} icon={Building2} color="info" />
          <StatCard title="On Leave Today" value={5} icon={ClipboardCheck} color="warning" />
          <StatCard title="Disabled Staff" value={2} icon={UserX} color="destructive" />
          <StatCard title="Avg. Experience" value="8.5 yrs" icon={TrendingUp} color="success" />
        </div>
      </div>
    </Layout>
  );
};

export default Page;
