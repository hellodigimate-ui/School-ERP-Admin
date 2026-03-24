"use client"


import { useState } from "react";
import { BarChart3, TrendingUp, BookOpen, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import LibrarianLayout from "../shell/page";

const monthlyData = [
  { month: "Sep", issued: 320, returned: 290 },
  { month: "Oct", issued: 410, returned: 380 },
  { month: "Nov", issued: 380, returned: 350 },
  { month: "Dec", issued: 280, returned: 260 },
  { month: "Jan", issued: 450, returned: 420 },
  { month: "Feb", issued: 340, returned: 310 },
];

const categoryData = [
  { name: "Science", value: 1240 },
  { name: "Mathematics", value: 980 },
  { name: "Literature", value: 760 },
  { name: "History", value: 540 },
  { name: "Computer", value: 420 },
  { name: "Others", value: 630 },
];

const memberTrend = [
  { month: "Sep", students: 1600, staff: 120 },
  { month: "Oct", students: 1680, staff: 125 },
  { month: "Nov", students: 1720, staff: 128 },
  { month: "Dec", students: 1750, staff: 130 },
  { month: "Jan", students: 1850, staff: 135 },
  { month: "Feb", students: 1920, staff: 140 },
];

const COLORS = ["hsl(262, 83%, 58%)", "hsl(210, 92%, 55%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(330, 80%, 60%)", "hsl(180, 70%, 50%)"];

const topBooks = [
  { title: "Physics Vol. 2", issues: 85 },
  { title: "Mathematics NCERT", issues: 72 },
  { title: "English Literature", issues: 65 },
  { title: "Computer Science", issues: 58 },
  { title: "Biology Textbook", issues: 52 },
];

export default function LibraryReports() {
  const [period, setPeriod] = useState("This Month");

  return (
   <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Library Reports</h1>
            <p className="text-sm text-muted-foreground">Analytics and insights for your library</p>
          </div>
          <div className="flex gap-2">
            <select value={period} onChange={e => setPeriod(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30">
              <option>This Month</option><option>Last 3 Months</option><option>Last 6 Months</option><option>This Year</option>
            </select>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="stat-card stat-card-gradient"><BookOpen className="h-5 w-5 text-accent mb-2" /><p className="text-2xl font-bold font-display text-accent">12,450</p><p className="text-sm text-muted-foreground">Total Books</p></div>
          <div className="stat-card stat-card-gradient"><TrendingUp className="h-5 w-5 text-info mb-2" /><p className="text-2xl font-bold font-display text-info">2,180</p><p className="text-sm text-muted-foreground">Issues This Year</p></div>
          <div className="stat-card stat-card-gradient"><Users className="h-5 w-5 text-success mb-2" /><p className="text-2xl font-bold font-display text-success">2,060</p><p className="text-sm text-muted-foreground">Active Members</p></div>
          <div className="stat-card stat-card-gradient"><BarChart3 className="h-5 w-5 text-warning mb-2" /><p className="text-2xl font-bold font-display text-warning">₹4,850</p><p className="text-sm text-muted-foreground">Fines Collected</p></div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue vs Return */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold font-display mb-4">Issue vs Return (Monthly)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="issued" fill="hsl(210, 92%, 55%)" radius={[4, 4, 0, 0]} name="Issued" />
                <Bar dataKey="returned" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Returned" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold font-display mb-4">Books by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Trend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold font-display mb-4">Active Members Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memberTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="hsl(262, 83%, 58%)" strokeWidth={2} name="Students" />
                <Line type="monotone" dataKey="staff" stroke="hsl(38, 92%, 50%)" strokeWidth={2} name="Staff" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Books */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold font-display mb-4">Most Issued Books</h3>
            <div className="space-y-3">
              {topBooks.map((b, i) => (
                <div key={b.title} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.title}</p>
                    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${(b.issues / topBooks[0].issues) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent">{b.issues}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   </LibrarianLayout>
  );
}