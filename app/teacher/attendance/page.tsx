"use client";

import { useState, useEffect } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused" | null;
  attendanceRate: number;
  empCode?: string;
  email?: string;
}

const getStatusBadge = (status: Student["status"]) => {
  switch (status) {
    case "present":
      return (
        <Badge className="bg-success/20 text-success border-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          Present
        </Badge>
      );
    case "absent":
      return (
        <Badge className="bg-destructive/20 text-destructive border-0">
          <XCircle className="w-3 h-3 mr-1" />
          Absent
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-warning/20 text-warning border-0">
          <Clock className="w-3 h-3 mr-1" />
          Late
        </Badge>
      );
    case "excused":
      return (
        <Badge className="bg-info/20 text-info border-0">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Excused
        </Badge>
      );
    default:
      return <Badge variant="secondary">Not Marked</Badge>;
  }
};

const mapAttendanceStatus = (apiStatus: string): Student["status"] => {
  switch (apiStatus?.toUpperCase()) {
    case "P":
      return "present";
    case "A":
      return "absent";
    case "L":
      return "late";
    case "E":
      return "excused";
    default:
      return null;
  }
};

export default function AttendancePage() {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        "/api/v1/teachers/section/attendance",
        {
          params: {
            fromDate: fromDate.split("-").reverse().join("/"),
            toDate: toDate.split("-").reverse().join("/"),
          },
        }
      );

      if (response.data?.data && Array.isArray(response.data.data)) {
        const transformed = response.data.data.map((record: any) => ({
          id: record.student.id,
          name: record.student.name,
          rollNo: record.student.rollNumber || "N/A",
          status: mapAttendanceStatus(record.status),
          attendanceRate: 0,
          empCode: record.empCode,
          email: record.user?.email,
        }));

        setStudentData(transformed);
      } else {
        setError("No attendance data received");
      }
    } catch (err: any) {
      console.error("Error fetching attendance:", err);
      if (err.response?.status === 403) {
        setError("Access denied: You don't have permission to mark attendance.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed: Please login again.");
      } else if (err.response?.status === 404) {
        setError("Teacher not assigned to any section.");
      } else {
        setError(err.response?.data?.message || "Failed to load attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleStatusChange = (studentId: string, status: Student["status"]) => {
    setStudentData((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const stats = {
    total: studentData.length,
    present: studentData.filter((s) => s.status === "present").length,
    absent: studentData.filter((s) => s.status === "absent").length,
    late: studentData.filter((s) => s.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-destructive font-medium">Failed to Load Attendance</p>
                <p className="text-destructive/80 text-sm mt-1">{error}</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchAttendance} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
              <p className="text-muted-foreground">Mark and manage student attendance</p>
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              Save Attendance
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4">
              {/* Date Filters */}
              <div className="dashboard-section flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <Button 
                  onClick={fetchAttendance}
                  className="gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Apply
                    </>
                  )}
                </Button>
              </div>

              {/* Attendance List */}
              <div className="dashboard-section">
                <h2 className="text-lg font-semibold mb-4">Students ({studentData.length})</h2>
                {studentData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No attendance records found</p>
                ) : (
                  <div className="space-y-3">
                    {studentData.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                          {student.email && (
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(student.status)}
                        </div>

                        {/* Status Display (Read-Only) */}
                        <div className="flex items-center gap-2 ml-4 text-sm">
                          <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-medium cursor-not-allowed">
                            P
                          </span>
                          <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-medium cursor-not-allowed">
                            A
                          </span>
                          <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-medium cursor-not-allowed">
                            L
                          </span>
                          <span className="px-2 py-1 rounded bg-muted text-muted-foreground font-medium cursor-not-allowed">
                            —
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overlay Loading Animation */}
            {loading && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background rounded-lg p-8 text-center shadow-lg">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-b-transparent mb-4"></div>
                  <p className="text-lg font-semibold text-foreground">Loading Attendance...</p>
                  <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch the data</p>
                </div>
              </div>
            )}

            {/* Stats Sidebar */}
            <div className="space-y-4">
              {/* Attendance Summary */}
              <div className="dashboard-section">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-success">{stats.present}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm text-muted-foreground">Late</p>
                    <p className="text-2xl font-bold text-warning">{stats.late}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                  </div>
                </div>
              </div>

              {/* Total Stats */}
              <div className="dashboard-section">
                <h2 className="text-lg font-semibold mb-4">Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Students</span>
                    <Badge variant="secondary">{stats.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marked</span>
                    <Badge variant="secondary">
                      {studentData.filter((s) => s.status !== null).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <Badge variant="secondary">
                      {studentData.filter((s) => s.status === null).length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
