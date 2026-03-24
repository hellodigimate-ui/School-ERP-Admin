"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, GraduationCap, CreditCard, ClipboardList, Download, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";

const attendanceData = [
  { month: "Aug", present: 92, absent: 8 },
  { month: "Sep", present: 89, absent: 11 },
  { month: "Oct", present: 94, absent: 6 },
  { month: "Nov", present: 88, absent: 12 },
  { month: "Dec", present: 91, absent: 9 },
  { month: "Jan", present: 93, absent: 7 },
  { month: "Feb", present: 90, absent: 10 },
];

const feeData = [
  { month: "Aug", collected: 450000, pending: 50000 },
  { month: "Sep", collected: 420000, pending: 80000 },
  { month: "Oct", collected: 480000, pending: 20000 },
  { month: "Nov", collected: 460000, pending: 40000 },
  { month: "Dec", collected: 430000, pending: 70000 },
  { month: "Jan", collected: 470000, pending: 30000 },
  { month: "Feb", collected: 440000, pending: 60000 },
];

const examPerformance = [
  { subject: "Mathematics", classAvg: 72, highest: 98, lowest: 35, passRate: 88 },
  { subject: "Science", classAvg: 78, highest: 96, lowest: 42, passRate: 92 },
  { subject: "English", classAvg: 81, highest: 95, lowest: 48, passRate: 95 },
  { subject: "Hindi", classAvg: 75, highest: 92, lowest: 38, passRate: 90 },
  { subject: "Social Science", classAvg: 70, highest: 94, lowest: 30, passRate: 85 },
];

const genderDistribution = [
  { name: "Boys", value: 580, color: "hsl(var(--primary))" },
  { name: "Girls", value: 520, color: "hsl(var(--accent))" },
];

const classStrength = [
  { class: "Class 6", students: 180 },
  { class: "Class 7", students: 175 },
  { class: "Class 8", students: 190 },
  { class: "Class 9", students: 185 },
  { class: "Class 10", students: 170 },
  { class: "Class 11", students: 160 },
  { class: "Class 12", students: 140 },
];

const topStudents = [
  { rank: 1, name: "Aarav Patel", class: "Class 10-A", percentage: 97.8, grade: "A+" },
  { rank: 2, name: "Diya Sharma", class: "Class 10-B", percentage: 96.5, grade: "A+" },
  { rank: 3, name: "Vivaan Gupta", class: "Class 10-A", percentage: 95.2, grade: "A+" },
  { rank: 4, name: "Ishita Reddy", class: "Class 10-C", percentage: 94.8, grade: "A+" },
  { rank: 5, name: "Arjun Singh", class: "Class 10-A", percentage: 93.4, grade: "A" },
];

const Page = () => {
  const [selectedYear, setSelectedYear] = useState("2025-26");

  const stats = [
    { label: "Total Students", value: "1,100", icon: Users, change: "+5.2%" },
    { label: "Avg Attendance", value: "91%", icon: ClipboardList, change: "+2.1%" },
    { label: "Fee Collection", value: "₹32.5L", icon: CreditCard, change: "+8.4%" },
    { label: "Pass Rate", value: "90%", icon: GraduationCap, change: "+3.6%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg text-white">
          <div>
            <h1 className="text-3xl font-bold">Reports Dashboard</h1>
            <p className="text-sm opacity-90">Comprehensive analytics & insights</p>
          </div>

          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-36 bg-white/20 text-white border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-26">2025-26</SelectItem>
                <SelectItem value="2024-25">2024-25</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="secondary" className="rounded-xl">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>

            <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-xl">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-white to-muted/40"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow">
                  <stat.icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <span className="text-xs text-emerald-500 flex items-center font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔥 TABS */}
        <Tabs defaultValue="attendance" className="space-y-6">

          <TabsList className="bg-muted p-1 rounded-xl shadow-sm">
            <TabsTrigger value="attendance">📊 Attendance</TabsTrigger>
            <TabsTrigger value="exam">📚 Exam</TabsTrigger>
            <TabsTrigger value="fees">💰 Fees</TabsTrigger>
            <TabsTrigger value="students">👨‍🎓 Students</TabsTrigger>
          </TabsList>

          {/* ATTENDANCE */}
          <TabsContent value="attendance">
            <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-white to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Monthly Attendance Rate (%)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#6366f1" radius={[6,6,0,0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EXAM */}
          <TabsContent value="exam" className="space-y-4">

            <Card className="rounded-2xl shadow-md border-0">
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Avg</TableHead>
                      <TableHead>Highest</TableHead>
                      <TableHead>Lowest</TableHead>
                      <TableHead>Pass</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {examPerformance.map((item) => (
                      <TableRow key={item.subject} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{item.subject}</TableCell>
                        <TableCell>{item.classAvg}%</TableCell>
                        <TableCell className="text-green-500 font-semibold">{item.highest}%</TableCell>
                        <TableCell className="text-red-500 font-semibold">{item.lowest}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${item.passRate}%` }}
                              />
                            </div>
                            <span className="text-xs">{item.passRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.passRate >= 90
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"}>
                            {item.passRate >= 90 ? "Good" : "Average"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </TabsContent>

          {/* FEES */}
          <TabsContent value="fees">
            <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle>Monthly Fee Collection</CardTitle>
              </CardHeader>

              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={feeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="collected" stroke="#6366f1" strokeWidth={3} />
                    <Line dataKey="pending" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students">
            <div className="grid md:grid-cols-2 gap-4">

              <Card className="rounded-2xl shadow-md border-0">
                <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={genderDistribution} dataKey="value" innerRadius={60} outerRadius={90}>
                        {genderDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md border-0">
                <CardHeader><CardTitle>Class Strength</CardTitle></CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={classStrength}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="students" fill="#6366f1" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Page;
