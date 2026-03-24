"use client";

import { useState } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused" | null;
  attendanceRate: number;
}

const students: Student[] = [
  {
    id: "1",
    name: "Emma Thompson",
    rollNo: "001",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "present",
    attendanceRate: 96,
  },
  {
    id: "2",
    name: "James Wilson",
    rollNo: "002",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "present",
    attendanceRate: 92,
  },
  {
    id: "3",
    name: "Sophia Martinez",
    rollNo: "003",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    status: "late",
    attendanceRate: 88,
  },
  {
    id: "4",
    name: "Oliver Brown",
    rollNo: "004",
    status: "absent",
    attendanceRate: 75,
  },
  {
    id: "5",
    name: "Ava Johnson",
    rollNo: "005",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    status: "present",
    attendanceRate: 98,
  },
  {
    id: "6",
    name: "Liam Davis",
    rollNo: "006",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "present",
    attendanceRate: 94,
  },
  {
    id: "7",
    name: "Isabella Garcia",
    rollNo: "007",
    status: "excused",
    attendanceRate: 90,
  },
  {
    id: "8",
    name: "Noah Miller",
    rollNo: "008",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "present",
    attendanceRate: 91,
  },
  {
    id: "9",
    name: "Mia Anderson",
    rollNo: "009",
    status: null,
    attendanceRate: 85,
  },
  {
    id: "10",
    name: "Lucas Taylor",
    rollNo: "010",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face",
    status: null,
    attendanceRate: 89,
  },
];

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

export default function AttendancePage() {
//   const [selectedClass, setSelectedClass] = useState("10a");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
  const [studentData, setStudentData] = useState(students);

  const handleStatusChange = (
    studentId: string,
    status: Student["status"]
  ) => {
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
    stats.total > 0
      ? Math.round((stats.present / stats.total) * 100)
      : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Attendance
              </h1>
              <p className="text-muted-foreground">
                Mark and manage student attendance
              </p>
            </div>

            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Attendance
            </Button>
          </div>

          {/* Rest of UI unchanged */}
        </main>
      </div>
    </div>
  );
}
