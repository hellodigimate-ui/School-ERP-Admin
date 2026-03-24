"use client";

import { Users, Clock, MapPin, BookOpen, MoreHorizontal, Plus } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const classes = [
  {
    id: 1,
    name: "Mathematics 101",
    code: "MATH-101",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    room: "Room 204",
    students: 32,
    avgGrade: 85,
    avgAttendance: 92,
    status: "ongoing",
    color: "bg-primary",
  },
  {
    id: 2,
    name: "Algebra II",
    code: "ALG-201",
    schedule: "Tue, Thu - 10:30 AM",
    room: "Room 108",
    students: 28,
    avgGrade: 78,
    avgAttendance: 88,
    status: "ongoing",
    color: "bg-success",
  },
  {
    id: 3,
    name: "Calculus",
    code: "CALC-301",
    schedule: "Mon, Wed - 2:00 PM",
    room: "Room 315",
    students: 24,
    avgGrade: 82,
    avgAttendance: 95,
    status: "ongoing",
    color: "bg-info",
  },
  {
    id: 4,
    name: "Geometry",
    code: "GEO-102",
    schedule: "Tue, Thu - 1:00 PM",
    room: "Room 212",
    students: 35,
    avgGrade: 88,
    avgAttendance: 90,
    status: "ongoing",
    color: "bg-warning",
  },
  {
    id: 5,
    name: "Statistics",
    code: "STAT-201",
    schedule: "Fri - 11:00 AM",
    room: "Room 101",
    students: 36,
    avgGrade: 80,
    avgAttendance: 86,
    status: "upcoming",
    color: "bg-accent",
  },
];

export default function ClassesPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-info/10 text-info hover:bg-info/20">
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Classes
              </h1>
              <p className="text-muted-foreground">
                Manage your classes and view performance
              </p>
            </div>

            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <p className="text-sm text-muted-foreground">
                Total Classes
              </p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-muted-foreground">
                Total Students
              </p>
              <p className="text-2xl font-bold">
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-muted-foreground">
                Avg. Class Grade
              </p>
              <p className="text-2xl font-bold">
                {Math.round(
                  classes.reduce((sum, c) => sum + c.avgGrade, 0) /
                    classes.length
                )}
                %
              </p>
            </div>
            <div className="stat-card">
              <p className="text-sm text-muted-foreground">
                Avg. Attendance
              </p>
              <p className="text-2xl font-bold">
                {Math.round(
                  classes.reduce((sum, c) => sum + c.avgAttendance, 0) /
                    classes.length
                )}
                %
              </p>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="dashboard-section hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${classItem.color} flex items-center justify-center`}
                    >
                      <BookOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {classItem.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {classItem.code}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Take Attendance</DropdownMenuItem>
                      <DropdownMenuItem>View Students</DropdownMenuItem>
                      <DropdownMenuItem>Grade Assignments</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{classItem.students} Students</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        Average Grade
                      </span>
                      <span className="font-medium">
                        {classItem.avgGrade}%
                      </span>
                    </div>
                    <Progress value={classItem.avgGrade} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        Attendance
                      </span>
                      <span className="font-medium">
                        {classItem.avgAttendance}%
                      </span>
                    </div>
                    <Progress
                      value={classItem.avgAttendance}
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  {getStatusBadge(classItem.status)}
                  <Button variant="outline" size="sm">
                    View Class
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
