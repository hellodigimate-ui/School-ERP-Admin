"use client"


import { useState } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck, CalendarX, Clock, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  date: string;
  day: string;
  status: "present" | "absent" | "leave" | "holiday";
  subject?: string;
}

interface SubjectAttendance {
  subject: string;
  present: number;
  total: number;
  percentage: number;
  teacher: string;
}

const monthlyRecords: AttendanceRecord[] = [
  { date: "2026-02-01", day: "Saturday", status: "holiday" },
  { date: "2026-02-02", day: "Sunday", status: "holiday" },
  { date: "2026-02-03", day: "Monday", status: "present" },
  { date: "2026-02-04", day: "Tuesday", status: "present" },
  { date: "2026-02-05", day: "Wednesday", status: "present" },
  { date: "2026-02-06", day: "Thursday", status: "absent", subject: "Mathematics" },
  { date: "2026-02-07", day: "Friday", status: "present" },
  { date: "2026-02-08", day: "Saturday", status: "holiday" },
  { date: "2026-02-09", day: "Sunday", status: "holiday" },
  { date: "2026-02-10", day: "Monday", status: "present" },
  { date: "2026-02-11", day: "Tuesday", status: "leave" },
  { date: "2026-02-12", day: "Wednesday", status: "present" },
];

const subjectAttendance: SubjectAttendance[] = [
  { subject: "Mathematics", present: 28, total: 30, percentage: 93, teacher: "Mrs. Sharma" },
  { subject: "Physics", present: 25, total: 28, percentage: 89, teacher: "Mr. Patel" },
  { subject: "Chemistry", present: 26, total: 28, percentage: 93, teacher: "Dr. Singh" },
  { subject: "English", present: 27, total: 30, percentage: 90, teacher: "Mrs. Gupta" },
  { subject: "Computer Science", present: 24, total: 26, percentage: 92, teacher: "Mr. Kumar" },
  { subject: "History", present: 20, total: 22, percentage: 91, teacher: "Mr. Verma" },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const stats = {
    totalDays: 50,
    present: 45,
    absent: 3,
    leave: 2,
    percentage: 92,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-stat-green text-white";
      case "absent":
        return "bg-destructive text-white";
      case "leave":
        return "bg-stat-yellow text-white";
      case "holiday":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-stat-green">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "leave":
        return <Badge className="bg-stat-yellow text-foreground">Leave</Badge>;
      case "holiday":
        return <Badge variant="secondary">Holiday</Badge>;
      default:
        return null;
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">Track your attendance records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-stat-teal to-stat-teal/80">
            <CardContent className="p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Attendance Rate</p>
                  <p className="text-2xl font-bold">{stats.percentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-stat-green/10 flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-stat-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Present</p>
                  <p className="text-xl font-bold">{stats.present}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <CalendarX className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Absent</p>
                  <p className="text-xl font-bold">{stats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-stat-yellow/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-stat-yellow" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">On Leave</p>
                  <p className="text-xl font-bold">{stats.leave}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                  <p className="text-xl font-bold">{stats.totalDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subject-wise">Subject-wise</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Attendance Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md pointer-events-auto"
                    modifiers={{
                      present: monthlyRecords.filter(r => r.status === "present").map(r => new Date(r.date)),
                      absent: monthlyRecords.filter(r => r.status === "absent").map(r => new Date(r.date)),
                      leave: monthlyRecords.filter(r => r.status === "leave").map(r => new Date(r.date)),
                    }}
                    modifiersStyles={{
                      present: { backgroundColor: "hsl(var(--stat-green))", color: "white", borderRadius: "50%" },
                      absent: { backgroundColor: "hsl(var(--destructive))", color: "white", borderRadius: "50%" },
                      leave: { backgroundColor: "hsl(var(--stat-yellow))", color: "black", borderRadius: "50%" },
                    }}
                  />
                  <div className="flex justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-stat-green" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-destructive" />
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-stat-yellow" />
                      <span>Leave</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Records */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {monthlyRecords.slice(0, 8).map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium", getStatusColor(record.status))}>
                            {new Date(record.date).getDate()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{record.day}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {record.subject && (
                            <span className="text-xs text-muted-foreground">Missed: {record.subject}</span>
                          )}
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subject-wise">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject-wise Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectAttendance.map((subject, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{subject.subject}</h4>
                          <p className="text-xs text-muted-foreground">{subject.teacher}</p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-lg font-bold",
                            subject.percentage >= 90 ? "text-stat-green" :
                            subject.percentage >= 75 ? "text-stat-yellow" : "text-destructive"
                          )}>
                            {subject.percentage}%
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {subject.present}/{subject.total} classes
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={subject.percentage}
                        className={cn(
                          "h-2",
                          subject.percentage >= 90 ? "[&>div]:bg-stat-green" :
                          subject.percentage >= 75 ? "[&>div]:bg-stat-yellow" : "[&>div]:bg-destructive"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Attendance History</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Day</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyRecords.map((record, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3 text-sm">
                            {new Date(record.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                          </td>
                          <td className="p-3 text-sm">{record.day}</td>
                          <td className="p-3">{getStatusBadge(record.status)}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {record.subject ? `Missed ${record.subject}` : record.status === "holiday" ? "School Holiday" : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default Attendance;
