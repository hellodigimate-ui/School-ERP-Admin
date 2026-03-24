"use client";

import { useState } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Edit,
} from "lucide-react";

interface StudentGrade {
  id: string;
  name: string;
  avatar?: string;
  rollNo: string;
  assignments: number;
  quizzes: number;
  midterm: number;
  final: number;
  average: number;
  grade: string;
  trend: "up" | "down" | "stable";
}

const studentGrades: StudentGrade[] = [
  {
    id: "1",
    name: "Emma Thompson",
    rollNo: "001",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    assignments: 95,
    quizzes: 92,
    midterm: 88,
    final: 91,
    average: 91.5,
    grade: "A",
    trend: "up",
  },
  {
    id: "2",
    name: "James Wilson",
    rollNo: "002",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    assignments: 88,
    quizzes: 85,
    midterm: 82,
    final: 85,
    average: 85,
    grade: "B+",
    trend: "stable",
  },
  {
    id: "3",
    name: "Sophia Martinez",
    rollNo: "003",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    assignments: 92,
    quizzes: 90,
    midterm: 94,
    final: 96,
    average: 93,
    grade: "A",
    trend: "up",
  },
  {
    id: "4",
    name: "Oliver Brown",
    rollNo: "004",
    assignments: 75,
    quizzes: 70,
    midterm: 68,
    final: 72,
    average: 71.25,
    grade: "C",
    trend: "down",
  },
  {
    id: "5",
    name: "Ava Johnson",
    rollNo: "005",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    assignments: 98,
    quizzes: 96,
    midterm: 95,
    final: 97,
    average: 96.5,
    grade: "A+",
    trend: "up",
  },
];

const getGradeBadge = (grade: string) => {
  if (grade.startsWith("A"))
    return (
      <Badge className="bg-success/20 text-success border-0 font-bold">
        {grade}
      </Badge>
    );
  if (grade.startsWith("B"))
    return (
      <Badge className="bg-primary/20 text-primary border-0 font-bold">
        {grade}
      </Badge>
    );
  if (grade.startsWith("C"))
    return (
      <Badge className="bg-warning/20 text-warning border-0 font-bold">
        {grade}
      </Badge>
    );
  return (
    <Badge className="bg-destructive/20 text-destructive border-0 font-bold">
      {grade}
    </Badge>
  );
};

const getTrendIcon = (trend: StudentGrade["trend"]) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-success" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    default:
      return <span className="text-muted-foreground">—</span>;
  }
};

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("10a");

  const filteredStudents = studentGrades.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
  );

  const stats = {
    classAverage: Math.round(
      studentGrades.reduce((acc, s) => acc + s.average, 0) /
        studentGrades.length
    ),
    topPerformers: studentGrades.filter((s) => s.average >= 90).length,
    needsAttention: studentGrades.filter((s) => s.average < 75).length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Grades</h1>

          {/* Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student Grades</CardTitle>
                <div className="flex gap-3">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10a">10A - Mathematics</SelectItem>
                      <SelectItem value="9b">9B - Mathematics</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Average</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          {student.avatar && (
                            <AvatarImage src={student.avatar} />
                          )}
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {student.average}
                      </TableCell>
                      <TableCell className="text-center">
                        {getGradeBadge(student.grade)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTrendIcon(student.trend)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
