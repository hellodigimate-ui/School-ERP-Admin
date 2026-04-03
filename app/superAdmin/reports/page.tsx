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
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
// import { AdminLayout } from "@/components/layout/AdminLayout";

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
        <div className="rounded-2xl p-6 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight">
                Reports Dashboard
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Comprehensive analytics & insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="w-[130px] bg-background/30 backdrop-blur border border-white/20 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="secondary" size="sm" className="gap-2 shadow-sm">
                <Printer className="w-4 h-4" /> Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-background/30 backdrop-blur border border-white/20 hover:bg-background/50"
              >
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "1,100", change: "+5.2%", icon: Users, color: "text-primary bg-primary/10" },
            { label: "Avg Attendance", value: "91%", change: "+2.1%", icon: Clock, color: "text-blue-500 bg-blue-500/10 dark:text-blue-400" },
            { label: "Fee Collection", value: "₹32.5L", change: "+8.4%", icon: DollarSign, color: "text-green-500 bg-green-500/10 dark:text-green-400" },
            { label: "Pass Rate", value: "90%", change: "+3.6%", icon: GraduationCap, color: "text-purple-500 bg-purple-500/10 dark:text-purple-400" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>

                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Section Tabs */}
        <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-muted/60 backdrop-blur border border-border/50">
          {reportSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeSection === sec.id
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
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

{/* ===== STUDENT REPORTS ===== */}
const StudentReports = () => (
  <div className="space-y-6">
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          Student Information Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Student Report",
            "Class & Section Report",
            "Guardian Report",
            "Student Profile Report",
            "Sibling Report",
            "Student History Report",
            "Admission Report",
            "Student Login Credential",
            "Class Subject Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
            <SelectField label="Category" options={["General","OBC","SC","ST"]} />
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
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


{/* ===== FINANCE REPORTS ===== */}
const FinanceReports = () => (
  <div className="space-y-6">
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-green-500/10 text-green-500 dark:text-green-400">
            <DollarSign className="w-5 h-5" />
          </div>
          Finance Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Balance Fees Statement",
            "Daily Collection Report",
            "Fees Statement",
            "Balance Fees Report",
            "Fees Collection Report",
            "Online Fees Collection Report",
            "Balance Fees Report With Remark",
            "Income Report",
            "Expense Report",
            "Payroll Report",
            "Income Group Report",
            "Expense Group Report",
            "Online Admission Fees Collection Report",
            "Due Fees Report",
            "Income Expense Balance Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Date From <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                defaultValue="2026-03-01"
                className="mt-1 bg-background/70"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Date To <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                defaultValue="2026-03-27"
                className="mt-1 bg-background/70"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Daily Collection Report
          </h3>

          <div className="h-[300px] rounded-xl border border-border/50 bg-background/60 backdrop-blur p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />

                <Bar
                  dataKey="collected"
                  fill="hsl(var(--primary))"
                  name="Collected"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="pending"
                  fill="hsl(var(--chart-4))"
                  name="Pending"
                  radius={[6, 6, 0, 0]}
                />
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          Attendance Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Student Attendance Report",
            "Daily Attendance Report",
            "Period Attendance Report",
            "Class Attendance Report",
            "Monthly Attendance Report",
            "Absentee Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Monthly Attendance Rate (%)
          </h3>

          <div className="h-[300px] rounded-xl border border-border/50 bg-background/60 backdrop-blur p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />

                <Bar
                  dataKey="rate"
                  fill="hsl(var(--primary))"
                  name="Attendance %"
                  radius={[6, 6, 0, 0]}
                />
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          Examination Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Exam Result Report",
            "Marks Sheet Report",
            "Merit List Report",
            "Exam Rank Report",
            "Subject Wise Report",
            "Tabulation Sheet",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Exam" options={["Unit Test 1","Half Yearly","Annual Exam"]} />
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Results + Chart */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pie Chart */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">
              Result Distribution
            </h3>

            <div className="h-[280px] rounded-xl border border-border/50 bg-background/60 backdrop-blur p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie
                    data={examPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${
                        percent ? (percent * 100).toFixed(0) : "0"
                      }%`
                    }
                  >
                    {examPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </RPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 dark:text-teal-400">
            <Globe className="w-5 h-5" />
          </div>
          Online Examinations Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Result Report",
            "Exams Report",
            "Student Exams Attempt Report",
            "Exams Rank Report",
          ].map((label, i) => (
            <div
              key={label}
              className={`p-4 rounded-xl border border-border/50 bg-muted/40 cursor-pointer transition-all hover:shadow-md
              ${i === 0 ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400"}`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Exam" options={["Online Quiz 1","Online Mid Term","Online Final"]} />
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
          <h3 className="font-semibold mb-3 text-foreground">
            Result Report
          </h3>

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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400">
            <BookMarked className="w-5 h-5" />
          </div>
          Lesson Plan Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="syllabus">

          {/* Tabs */}
          <TabsList className="mb-4 bg-muted/50 border border-border/50 p-1 rounded-lg">
            <TabsTrigger
              value="syllabus"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileBarChart className="w-4 h-4" />
              Syllabus Status
            </TabsTrigger>

            <TabsTrigger
              value="lesson"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookOpen className="w-4 h-4" />
              Lesson Plan
            </TabsTrigger>
          </TabsList>

          {/* ===== SYLLABUS ===== */}
          <TabsContent value="syllabus">
            <h3 className="font-semibold mb-4 text-foreground">
              Select Criteria
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
              <SelectField label="Section" options={["A","B","C","D"]} />
              <SelectField label="Subject Group" options={["Group 1","Group 2","Group 3"]} />
            </div>

            <div className="flex justify-end mt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>

            {/* Progress Cards */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4 text-foreground">
                Syllabus Status Report
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {syllabusData.map((s) => (
                  <div
                    key={s.subject}
                    className="text-center p-3 rounded-xl border border-border/50 bg-background/60 backdrop-blur hover:shadow-md transition-all"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {s.subject}
                    </p>

                    {/* Circle Progress */}
                    <div className="relative w-24 h-24 mx-auto my-2">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
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

                    <Badge
                      variant={s.completion === 100 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {s.completion === 100 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ===== LESSON PLAN ===== */}
          <TabsContent value="lesson">
            <h3 className="font-semibold mb-4 text-foreground">
              Select Criteria
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
              <SelectField label="Section" options={["A","B","C","D"]} />
              <SelectField label="Subject" options={["English","Hindi","Mathematics","Science"]} />
            </div>

            <div className="flex justify-end mt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
              <ResultTable
                headers={["Lesson", "Topic", "Sub Topic", "Status", "Completion Date", "Teaching Method"]}
                rows={[
                  ["Chapter 1", "Grammar", "Nouns", "Completed", "15/04/2025", "Lecture"],
                  ["Chapter 2", "Tenses", "Present", "In Progress", "-", "Interactive"],
                  ["Chapter 3", "Essay", "Descriptive", "Pending", "-", "Workshop"],
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          Human Resource Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Report Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Staff Report",
            "Payroll Report",
            "Leave Request Report",
            "My Leave Request Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField label="Role" options={["Teacher","Accountant","Librarian","Receptionist","Admin"]} />
            <SelectField label="Department" options={["Science","Mathematics","English","Hindi","Computer"]} />
            <SelectField label="Designation" options={["Principal","Vice Principal","HOD","Senior Teacher","Teacher"]} />
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500 dark:text-pink-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          Homework Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Homework Report",
            "Homework Evaluation Report",
            "Daily Assignment Report",
            "Homework Marks Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SelectField label="Class" options={["Class 1","Class 2","Class 3","Class 4","Class 5"]} />
            <SelectField label="Section" options={["A","B","C","D"]} />
            <SelectField label="Subject" options={["English","Hindi","Mathematics","Science"]} />

            <div>
              <label className="text-sm font-medium text-foreground">
                Date
              </label>
              <Input type="date" defaultValue="2026-03-27" className="mt-1 bg-background/70" />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
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
    <Card className="bg-background/80 backdrop-blur border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Library className="w-5 h-5" />
          </div>
          Library Report
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            "Book Issue Report",
            "Book Return Report",
            "Book Inventory Report",
            "Overdue Book Report",
          ].map((label) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/50 bg-muted/40 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer hover:shadow-md"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="font-semibold mb-4 text-foreground">
            Select Criteria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Date From
              </label>
              <Input type="date" defaultValue="2026-03-01" className="mt-1 bg-background/70" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Date To
              </label>
              <Input type="date" defaultValue="2026-03-27" className="mt-1 bg-background/70" />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-border/50 bg-background/60 backdrop-blur p-2">
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

// const ReportLink = ({ label, active }: { label: string; active?: boolean }) => (
//   <button
//     className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border backdrop-blur
//     ${
//       active
//         ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
//         : "border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:shadow-md"
//     }`}
//   >
//     <FileBarChart className="w-4 h-4 flex-shrink-0" />
//     <span className="truncate">{label}</span>
//   </button>
// );


const SelectField = ({ label, options }: { label: string; options: string[] }) => (
  <div>
    <label className="text-sm font-medium text-foreground">
      {label} <span className="text-destructive">*</span>
    </label>

    <Select>
      <SelectTrigger className="mt-1 bg-background/70 backdrop-blur border border-border/50 focus:ring-2 focus:ring-primary/30">
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent className="bg-background border border-border/50">
        {options.map((o) => (
          <SelectItem key={o} value={o} className="focus:bg-primary/10">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);


const ResultTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => {

  const getBadgeStyle = (value: string) => {
    switch (value) {
      case "Completed":
      case "Active":
      case "Returned":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";

      case "Pending":
      case "Issued":
      case "In Progress":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20";

      case "Overdue":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";

      default:
        return "";
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-background/70 backdrop-blur overflow-hidden">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="bg-muted/50">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="font-semibold text-foreground whitespace-nowrap"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              className="hover:bg-muted/40 transition-colors"
            >
              {row.map((cell, j) => (
                <TableCell key={j} className="text-foreground">
                  {getBadgeStyle(cell) ? (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeStyle(cell)}`}
                    >
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Reports;
