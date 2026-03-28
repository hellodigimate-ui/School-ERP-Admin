
// "use client"


// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { TrendingUp, Users, GraduationCap, CreditCard, ClipboardList, Download, Printer } from "lucide-react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
// import { AdminLayout } from "@/components/layout/AdminLayout";

// const attendanceData = [
//   { month: "Aug", present: 92, absent: 8 },
//   { month: "Sep", present: 89, absent: 11 },
//   { month: "Oct", present: 94, absent: 6 },
//   { month: "Nov", present: 88, absent: 12 },
//   { month: "Dec", present: 91, absent: 9 },
//   { month: "Jan", present: 93, absent: 7 },
//   { month: "Feb", present: 90, absent: 10 },
// ];

// const feeData = [
//   { month: "Aug", collected: 450000, pending: 50000 },
//   { month: "Sep", collected: 420000, pending: 80000 },
//   { month: "Oct", collected: 480000, pending: 20000 },
//   { month: "Nov", collected: 460000, pending: 40000 },
//   { month: "Dec", collected: 430000, pending: 70000 },
//   { month: "Jan", collected: 470000, pending: 30000 },
//   { month: "Feb", collected: 440000, pending: 60000 },
// ];

// const examPerformance = [
//   { subject: "Mathematics", classAvg: 72, highest: 98, lowest: 35, passRate: 88 },
//   { subject: "Science", classAvg: 78, highest: 96, lowest: 42, passRate: 92 },
//   { subject: "English", classAvg: 81, highest: 95, lowest: 48, passRate: 95 },
//   { subject: "Hindi", classAvg: 75, highest: 92, lowest: 38, passRate: 90 },
//   { subject: "Social Science", classAvg: 70, highest: 94, lowest: 30, passRate: 85 },
// ];

// const genderDistribution = [
//   { name: "Boys", value: 580, color: "hsl(var(--primary))" },
//   { name: "Girls", value: 520, color: "hsl(var(--accent))" },
// ];

// const classStrength = [
//   { class: "Class 6", students: 180 },
//   { class: "Class 7", students: 175 },
//   { class: "Class 8", students: 190 },
//   { class: "Class 9", students: 185 },
//   { class: "Class 10", students: 170 },
//   { class: "Class 11", students: 160 },
//   { class: "Class 12", students: 140 },
// ];



// const Page = () => {
//   const [selectedYear, setSelectedYear] = useState("2025-26");

//   const stats = [
//     { label: "Total Students", value: "1,100", icon: Users, change: "+5.2%" },
//     { label: "Avg Attendance", value: "91%", icon: ClipboardList, change: "+2.1%" },
//     { label: "Fee Collection", value: "₹32.5L", icon: CreditCard, change: "+8.4%" },
//     { label: "Pass Rate", value: "90%", icon: GraduationCap, change: "+3.6%" },
//   ];

//   return (
//     <AdminLayout>
//       <div className="space-y-6">

//         {/* 🔥 HEADER */}
//         <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg text-white">
//           <div>
//             <h1 className="text-3xl font-bold">Reports Dashboard</h1>
//             <p className="text-sm opacity-90">Comprehensive analytics & insights</p>
//           </div>

//           <div className="flex gap-2">
//             <Select value={selectedYear} onValueChange={setSelectedYear}>
//               <SelectTrigger className="w-36 bg-white/20 text-white border-0">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="2025-26">2025-26</SelectItem>
//                 <SelectItem value="2024-25">2024-25</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button variant="secondary" className="rounded-xl">
//               <Printer className="h-4 w-4 mr-2" /> Print
//             </Button>

//             <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-xl">
//               <Download className="h-4 w-4 mr-2" /> Export
//             </Button>
//           </div>
//         </div>

//         {/* 🔥 STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {stats.map((stat, i) => (
//             <Card
//               key={stat.label}
//               className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-white to-muted/40"
//             >
//               <CardContent className="p-4 flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow">
//                   <stat.icon className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <p className="text-2xl font-bold">{stat.value}</p>
//                   <div className="flex items-center gap-2">
//                     <p className="text-sm text-muted-foreground">{stat.label}</p>
//                     <span className="text-xs text-emerald-500 flex items-center font-medium">
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                       {stat.change}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* 🔥 TABS */}
//         <Tabs defaultValue="attendance" className="space-y-6">

//           <TabsList className="bg-muted p-1 rounded-xl shadow-sm">
//             <TabsTrigger value="attendance">📊 Attendance</TabsTrigger>
//             <TabsTrigger value="exam">📚 Exam</TabsTrigger>
//             <TabsTrigger value="fees">💰 Fees</TabsTrigger>
//             <TabsTrigger value="students">👨‍🎓 Students</TabsTrigger>
//           </TabsList>

//           {/* ATTENDANCE */}
//           <TabsContent value="attendance">
//             <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br   dark:bg-gray-900">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold dark:text-gray-400">
//                   Monthly Attendance Rate (%)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="h-80">  
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={attendanceData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="present" fill="#6366f1" radius={[6,6,0,0]} />
//                     <Bar dataKey="absent" fill="#ef4444" radius={[6,6,0,0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* EXAM */}
//           <TabsContent value="exam" className="space-y-4">

//             <Card className="rounded-2xl shadow-md border-0">
//               <CardHeader>
//                 <CardTitle>Subject-wise Performance</CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Subject</TableHead>
//                       <TableHead>Avg</TableHead>
//                       <TableHead>Highest</TableHead>
//                       <TableHead>Lowest</TableHead>
//                       <TableHead>Pass</TableHead>
//                       <TableHead>Status</TableHead>
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {examPerformance.map((item) => (
//                       <TableRow key={item.subject} className="hover:bg-muted/40">
//                         <TableCell className="font-medium">{item.subject}</TableCell>
//                         <TableCell>{item.classAvg}%</TableCell>
//                         <TableCell className="text-green-500 font-semibold">{item.highest}%</TableCell>
//                         <TableCell className="text-red-500 font-semibold">{item.lowest}%</TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2">
//                             <div className="w-full h-2 bg-muted rounded-full">
//                               <div
//                                 className="h-full bg-indigo-500 rounded-full"
//                                 style={{ width: `${item.passRate}%` }}
//                               />
//                             </div>
//                             <span className="text-xs">{item.passRate}%</span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={item.passRate >= 90
//                             ? "bg-green-100 text-green-600"
//                             : "bg-yellow-100 text-yellow-600"}>
//                             {item.passRate >= 90 ? "Good" : "Average"}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>

//           </TabsContent>

//           {/* FEES */}
//           <TabsContent value="fees">
//             <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br dark:bg-gray-900">
//               <CardHeader>
//                 <CardTitle>Monthly Fee Collection</CardTitle>
//               </CardHeader>

//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={feeData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line dataKey="collected" stroke="#6366f1" strokeWidth={3} />
//                     <Line dataKey="pending" stroke="#ef4444" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* STUDENTS */}
//           <TabsContent value="students">
//             <div className="grid md:grid-cols-2 gap-4">

//               <Card className="rounded-2xl shadow-md border-0">
//                 <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
//                 <CardContent className="h-64">
//                   <ResponsiveContainer>
//                     <PieChart>
//                       <Pie data={genderDistribution} dataKey="value" innerRadius={60} outerRadius={90}>
//                         {genderDistribution.map((entry, i) => (
//                           <Cell key={i} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>

//               <Card className="rounded-2xl shadow-md border-0">
//                 <CardHeader><CardTitle>Class Strength</CardTitle></CardHeader>
//                 <CardContent className="h-64">
//                   <ResponsiveContainer>
//                     <BarChart data={classStrength}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="class" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="students" fill="#6366f1" radius={[6,6,0,0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>

//             </div>
//           </TabsContent>

//         </Tabs>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Page;


// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users, DollarSign, Clock, FileText, BookOpen, Briefcase, ClipboardList, Library,
  Search, Download, Printer, TrendingUp, GraduationCap, 
  FileBarChart,  BookMarked,  Globe
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell,  Legend
} from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";

const attendanceData = [
  { month: "Apr", rate: 92 }, { month: "May", rate: 89 }, { month: "Jun", rate: 91 },
  { month: "Jul", rate: 94 }, { month: "Aug", rate: 88 }, { month: "Sep", rate: 85 },
  { month: "Oct", rate: 90 }, { month: "Nov", rate: 93 }, { month: "Dec", rate: 91 },
  { month: "Jan", rate: 89 }, { month: "Feb", rate: 94 }, { month: "Mar", rate: 91 },
];

const feeData = [
  { month: "Apr", collected: 420000, pending: 80000 },
  { month: "May", collected: 380000, pending: 120000 },
  { month: "Jun", collected: 450000, pending: 50000 },
  { month: "Jul", collected: 400000, pending: 100000 },
  { month: "Aug", collected: 460000, pending: 40000 },
  { month: "Sep", collected: 390000, pending: 110000 },
];

const examPieData = [
  { name: "Distinction", value: 180, color: "hsl(var(--primary))" },
  { name: "First Class", value: 350, color: "hsl(var(--chart-2))" },
  { name: "Second Class", value: 280, color: "hsl(var(--chart-3))" },
  { name: "Pass", value: 190, color: "hsl(var(--chart-4))" },
  { name: "Fail", value: 100, color: "hsl(var(--chart-5))" },
];

const syllabusData = [
  { subject: "English", code: "210", completion: 37 },
  { subject: "Hindi", code: "230", completion: 100 },
  { subject: "Mathematics", code: "110", completion: 75 },
  { subject: "Science", code: "111", completion: 67 },
  { subject: "Drawing", code: "200", completion: 50 },
  { subject: "Computer", code: "00220", completion: 42 },
  { subject: "Elective 1", code: "101", completion: 28 },
];

const reportSections = [
  { id: "student", label: "Student Information", icon: Users },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "examinations", label: "Examinations", icon: FileText },
  { id: "online-exam", label: "Online Examinations", icon: Globe },
  { id: "lesson-plan", label: "Lesson Plan", icon: BookMarked },
  { id: "human-resource", label: "Human Resource", icon: Briefcase },
  { id: "homework", label: "Homework", icon: ClipboardList },
  { id: "library", label: "Library", icon: Library },
];

const Reports = () => {
  const [activeSection, setActiveSection] = useState("student");
  const [session, setSession] = useState("2025-26");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl gradient-hero p-6 text-primary-foreground">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display">Reports Dashboard</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">Comprehensive analytics & insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="w-[130px] bg-white/20 border-white/30 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" size="sm" className="gap-2">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "1,100", change: "+5.2%", icon: Users, color: "bg-primary/10 text-primary" },
            { label: "Avg Attendance", value: "91%", change: "+2.1%", icon: Clock, color: "bg-chart-2/10 text-chart-2" },
            { label: "Fee Collection", value: "₹32.5L", change: "+8.4%", icon: DollarSign, color: "bg-chart-3/10 text-chart-3" },
            { label: "Pass Rate", value: "90%", change: "+3.6%", icon: GraduationCap, color: "bg-chart-4/10 text-chart-4" },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Section Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-xl">
          {reportSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === sec.id
                  ? "gradient-hero text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              <sec.icon className="w-4 h-4" />
              {sec.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        {activeSection === "student" && <StudentReports />}
        {activeSection === "finance" && <FinanceReports />}
        {activeSection === "attendance" && <AttendanceReports />}
        {activeSection === "examinations" && <ExaminationReports />}
        {activeSection === "online-exam" && <OnlineExamReports />}
        {activeSection === "lesson-plan" && <LessonPlanReports />}
        {activeSection === "human-resource" && <HumanResourceReports />}
        {activeSection === "homework" && <HomeworkReports />}
        {activeSection === "library" && <LibraryReports />}
      </div>
    </AdminLayout>
  );
};

/* ===== STUDENT REPORTS ===== */
const StudentReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Student Information Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Student Report" />
          <ReportLink label="Class & Section Report" />
          <ReportLink label="Guardian Report" />
          <ReportLink label="Student Profile Report" />
          <ReportLink label="Sibling Report" />
          <ReportLink label="Student History Report" />
          <ReportLink label="Admission Report" />
          <ReportLink label="Student Login Credential" />
          <ReportLink label="Class Subject Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
            <SelectField label="Category" options={["General","OBC","SC","ST"]} />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <ResultTable
            headers={["Admission No", "Student Name", "Class", "Section", "Father Name", "DOB", "Gender", "Category"]}
            rows={[
              ["2026001", "Aarav Sharma", "Class 5", "A", "Rajesh Sharma", "15/03/2015", "Male", "General"],
              ["2026002", "Priya Patel", "Class 5", "A", "Amit Patel", "22/07/2014", "Female", "OBC"],
              ["2026003", "Rohan Singh", "Class 5", "B", "Vikram Singh", "10/11/2015", "Male", "General"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== FINANCE REPORTS ===== */
const FinanceReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" /> Finance Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Balance Fees Statement" />
          <ReportLink label="Daily Collection Report" active />
          <ReportLink label="Fees Statement" />
          <ReportLink label="Balance Fees Report" />
          <ReportLink label="Fees Collection Report" />
          <ReportLink label="Online Fees Collection Report" />
          <ReportLink label="Balance Fees Report With Remark" />
          <ReportLink label="Income Report" />
          <ReportLink label="Expense Report" />
          <ReportLink label="Payroll Report" />
          <ReportLink label="Income Group Report" />
          <ReportLink label="Expense Group Report" />
          <ReportLink label="Online Admission Fees Collection Report" />
          <ReportLink label="Due Fees Report" />
          <ReportLink label="Income Expense Balance Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Date From <span className="text-destructive">*</span></label>
              <Input type="date" defaultValue="2026-03-01" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Date To <span className="text-destructive">*</span></label>
              <Input type="date" defaultValue="2026-03-27" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Daily Collection Report</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="hsl(var(--primary))" name="Collected" radius={[4,4,0,0]} />
                <Bar dataKey="pending" fill="hsl(var(--chart-4))" name="Pending" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== ATTENDANCE REPORTS ===== */
const AttendanceReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Attendance Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Student Attendance Report" />
          <ReportLink label="Daily Attendance Report" />
          <ReportLink label="Period Attendance Report" />
          <ReportLink label="Class Attendance Report" />
          <ReportLink label="Monthly Attendance Report" />
          <ReportLink label="Absentee Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Monthly Attendance Rate (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="rate" fill="hsl(var(--primary))" name="Attendance %" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== EXAMINATION REPORTS ===== */
const ExaminationReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Examination Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Exam Result Report" />
          <ReportLink label="Marks Sheet Report" />
          <ReportLink label="Merit List Report" />
          <ReportLink label="Exam Rank Report" />
          <ReportLink label="Subject Wise Report" />
          <ReportLink label="Tabulation Sheet" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Exam" options={["Unit Test 1","Half Yearly","Annual Exam"]} />
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Result Distribution</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie data={examPieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}>
                    {examPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </RPieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <ResultTable
              headers={["Admission No", "Student Name", "Class", "Total Marks", "Percentage", "Grade"]}
              rows={[
                ["2026001", "Aarav Sharma", "Class 5", "465/500", "93%", "A+"],
                ["2026002", "Priya Patel", "Class 5", "440/500", "88%", "A"],
                ["2026003", "Rohan Singh", "Class 5", "410/500", "82%", "B+"],
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== ONLINE EXAMINATION REPORTS ===== */
const OnlineExamReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Online Examinations Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Result Report" active />
          <ReportLink label="Exams Report" />
          <ReportLink label="Student Exams Attempt Report" />
          <ReportLink label="Exams Rank Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Exam" options={["Online Quiz 1","Online Mid Term","Online Final"]} />
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Result Report</h3>
          <ResultTable
            headers={["Admission No", "Student Name", "Class", "Total Attempt", "Remaining Attempt", "Exam Status"]}
            rows={[
              ["2026001", "Aarav Sharma", "Class 5", "3", "0", "Completed"],
              ["2026002", "Priya Patel", "Class 5", "2", "1", "In Progress"],
              ["2026003", "Rohan Singh", "Class 5", "1", "2", "Pending"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== LESSON PLAN REPORTS ===== */
const LessonPlanReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-primary" /> Lesson Plan Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="syllabus">
          <TabsList className="mb-4">
            <TabsTrigger value="syllabus" className="gap-2"><FileBarChart className="w-4 h-4" /> Syllabus Status Report</TabsTrigger>
            <TabsTrigger value="lesson" className="gap-2"><BookOpen className="w-4 h-4" /> Subject Lesson Plan Report</TabsTrigger>
          </TabsList>

          <TabsContent value="syllabus">
            <h3 className="font-semibold mb-4">Select Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
              <SelectField label="Section" options={["A","B","C","D"]} />
              <SelectField label="Subject Group" options={["Class 1st Subject Group","Class 2nd Subject Group","Class 3rd Subject Group"]} />
            </div>
            <div className="flex justify-end mt-4">
              <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Syllabus Status Report</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {syllabusData.map((s) => (
                  <div key={s.subject} className="text-center space-y-2">
                    <p className="text-sm font-semibold">{s.subject} ({s.code})</p>
                    <div className="relative w-24 h-24 mx-auto">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeDasharray={`${s.completion}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                        {s.completion}%
                      </div>
                    </div>
                    <Badge variant={s.completion === 100 ? "default" : "secondary"} className="text-xs">
                      Complete {s.completion}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lesson">
            <h3 className="font-semibold mb-4">Select Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
              <SelectField label="Section" options={["A","B","C","D"]} />
              <SelectField label="Subject" options={["English","Hindi","Mathematics","Science"]} />
            </div>
            <div className="flex justify-end mt-4">
              <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
            </div>
            <div className="mt-6">
              <ResultTable
                headers={["Lesson", "Topic", "Sub Topic", "Status", "Completion Date", "Teaching Method"]}
                rows={[
                  ["Chapter 1", "Introduction to Grammar", "Nouns & Pronouns", "Completed", "15/04/2025", "Lecture"],
                  ["Chapter 2", "Tenses", "Present Tense", "In Progress", "-", "Interactive"],
                  ["Chapter 3", "Essay Writing", "Descriptive", "Pending", "-", "Workshop"],
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
);

/* ===== HUMAN RESOURCE REPORTS ===== */
const HumanResourceReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Human Resource Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Staff Report" />
          <ReportLink label="Payroll Report" />
          <ReportLink label="Leave Request Report" />
          <ReportLink label="My Leave Request Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Role" options={["Teacher","Accountant","Librarian","Receptionist","Admin"]} />
            <SelectField label="Department" options={["Science","Mathematics","English","Hindi","Computer"]} />
            <SelectField label="Designation" options={["Principal","Vice Principal","HOD","Senior Teacher","Teacher"]} />
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <ResultTable
            headers={["Staff ID", "Name", "Role", "Department", "Phone", "Joining Date", "Status"]}
            rows={[
              ["STF001", "Dr. Meena Kumari", "Teacher", "Science", "9876543210", "01/04/2020", "Active"],
              ["STF002", "Ramesh Verma", "Accountant", "Finance", "9876543211", "15/06/2019", "Active"],
              ["STF003", "Sunita Devi", "Librarian", "Library", "9876543212", "10/08/2021", "Active"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== HOMEWORK REPORTS ===== */
const HomeworkReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" /> Homework Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Homework Report" />
          <ReportLink label="Homework Evaluation Report" />
          <ReportLink label="Daily Assignment Report" />
          <ReportLink label="Homework Marks Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
            <SelectField label="Subject" options={["English","Hindi","Mathematics","Science"]} />
            <div>
              <label className="text-sm font-medium text-foreground">Date</label>
              <Input type="date" defaultValue="2026-03-27" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <ResultTable
            headers={["Class", "Section", "Subject", "Homework Date", "Submission Date", "Created By", "Evaluation"]}
            rows={[
              ["Class 5", "A", "Mathematics", "25/03/2026", "27/03/2026", "Mrs. Sharma", "Completed"],
              ["Class 5", "A", "English", "24/03/2026", "26/03/2026", "Mr. Verma", "Pending"],
              ["Class 5", "B", "Science", "23/03/2026", "25/03/2026", "Dr. Singh", "Completed"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== LIBRARY REPORTS ===== */
const LibraryReports = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Library className="w-5 h-5 text-primary" /> Library Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ReportLink label="Book Issue Report" />
          <ReportLink label="Book Return Report" />
          <ReportLink label="Book Inventory Report" />
          <ReportLink label="Overdue Book Report" />
        </div>
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Date From</label>
              <Input type="date" defaultValue="2026-03-01" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Date To</label>
              <Input type="date" defaultValue="2026-03-27" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-hero text-primary-foreground gap-2"><Search className="w-4 h-4" /> Search</Button>
          </div>
        </div>
        <div className="mt-6">
          <ResultTable
            headers={["Book ID", "Book Title", "Author", "Issue To", "Issue Date", "Return Date", "Status"]}
            rows={[
              ["BK001", "NCERT Maths Class 5", "NCERT", "Aarav Sharma", "01/03/2026", "15/03/2026", "Returned"],
              ["BK002", "English Grammar", "Wren & Martin", "Priya Patel", "05/03/2026", "20/03/2026", "Issued"],
              ["BK003", "General Science", "S. Chand", "Rohan Singh", "10/03/2026", "25/03/2026", "Overdue"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== SHARED COMPONENTS ===== */
const ReportLink = ({ label, active }: { label: string; active?: boolean }) => (
  <button className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all border ${
    active
      ? "bg-primary/10 border-primary/30 text-primary"
      : "border-border hover:bg-accent hover:text-accent-foreground"
  }`}>
    <FileBarChart className="w-4 h-4 flex-shrink-0" />
    {label}
  </button>
);

const SelectField = ({ label, options }: { label: string; options: string[] }) => (
  <div>
    <label className="text-sm font-medium text-foreground">{label} <span className="text-destructive">*</span></label>
    <Select>
      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

const ResultTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          {headers.map((h) => <TableHead key={h} className="font-semibold text-foreground">{h}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i} className="hover:bg-accent/50">
            {row.map((cell, j) => (
              <TableCell key={j}>
                {cell === "Completed" || cell === "Active" || cell === "Returned" ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{cell}</Badge>
                ) : cell === "Pending" || cell === "Issued" || cell === "In Progress" ? (
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{cell}</Badge>
                ) : cell === "Overdue" ? (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{cell}</Badge>
                ) : cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default Reports;
