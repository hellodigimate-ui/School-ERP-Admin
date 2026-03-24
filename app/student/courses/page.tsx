"use client"

import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
BookOpen,
Clock,
Users,
Video,
FileText,
Calendar,
MapPin,
Mail,
ChevronRight,
} from "lucide-react";

const courses = [
{
id: 1,
name: "Data Structures",
code: "CS301",
credits: 4,
teacher: "Dr. Amit Sharma",
teacherEmail: "amit.sharma@school.edu",
schedule: "Mon, Wed, Fri - 9:00 AM",
room: "Room 301",
progress: 72,
totalClasses: 45,
attendedClasses: 41,
assignments: 8,
completedAssignments: 6,
color: "bg-blue-500",
},
{
id: 2,
name: "Database Systems",
code: "CS302",
credits: 4,
teacher: "Prof. Priya Verma",
teacherEmail: "priya.verma@school.edu",
schedule: "Tue, Thu - 11:00 AM",
room: "Room 205",
progress: 68,
totalClasses: 30,
attendedClasses: 28,
assignments: 6,
completedAssignments: 5,
color: "bg-emerald-500",
},
{
id: 3,
name: "Computer Networks",
code: "CS303",
credits: 3,
teacher: "Dr. Rajesh Kumar",
teacherEmail: "rajesh.kumar@school.edu",
schedule: "Mon, Thu - 2:00 PM",
room: "Lab 102",
progress: 55,
totalClasses: 28,
attendedClasses: 24,
assignments: 5,
completedAssignments: 3,
color: "bg-purple-500",
},
{
id: 4,
name: "Operating Systems",
code: "CS304",
credits: 4,
teacher: "Dr. Sunita Patel",
teacherEmail: "sunita.patel@school.edu",
schedule: "Wed, Fri - 11:00 AM",
room: "Room 401",
progress: 80,
totalClasses: 32,
attendedClasses: 30,
assignments: 7,
completedAssignments: 7,
color: "bg-amber-500",
},
{
id: 5,
name: "Software Engineering",
code: "CS305",
credits: 3,
teacher: "Prof. Vikram Singh",
teacherEmail: "vikram.singh@school.edu",
schedule: "Tue, Thu - 3:30 PM",
room: "Room 302",
progress: 62,
totalClasses: 26,
attendedClasses: 23,
assignments: 4,
completedAssignments: 3,
color: "bg-rose-500",
},
{
id: 6,
name: "Web Technologies",
code: "CS306",
credits: 4,
teacher: "Dr. Neha Gupta",
teacherEmail: "neha.gupta@school.edu",
schedule: "Mon, Wed - 4:00 PM",
room: "Lab 201",
progress: 85,
totalClasses: 40,
attendedClasses: 38,
assignments: 9,
completedAssignments: 8,
color: "bg-cyan-500",
},
];

export default function Courses() {
const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

return (
<StudentLayout>
    <div className="space-y-6">
    <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Current semester enrolled courses</p>
    </div>

    {/* Overview Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
        <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
            <p className="text-xs text-muted-foreground">Enrolled</p>
            <p className="text-xl font-bold text-foreground">{courses.length}</p>
            </div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
            <p className="text-xs text-muted-foreground">Total Credits</p>
            <p className="text-xl font-bold text-foreground">{totalCredits}</p>
            </div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
            <p className="text-xs text-muted-foreground">Teachers</p>
            <p className="text-xl font-bold text-foreground">{courses.length}</p>
            </div>
        </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Avg Progress</p>
            <p className="text-sm font-medium">{avgProgress}%</p>
            </div>
            <Progress value={avgProgress} className="h-2" />
        </CardContent>
        </Card>
    </div>

    {/* Course Cards */}
    <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-1.5 ${course.color}`} />
            <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
                <div>
                <Badge variant="outline" className="mb-2">{course.code}</Badge>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{course.credits} Credits</p>
                </div>
                <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            </CardHeader>
            <CardContent className="space-y-4">
            {/* Teacher Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                <AvatarFallback className={`${course.color} text-white`}>
                    {course.teacher.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{course.teacher}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {course.teacherEmail}
                </p>
                </div>
            </div>

            {/* Schedule & Room */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="truncate">{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{course.room}</span>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Syllabus Progress</span>
                <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs">
                    <p className="text-muted-foreground">Attendance</p>
                    <p className="font-medium">{course.attendedClasses}/{course.totalClasses} classes</p>
                </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs">
                    <p className="text-muted-foreground">Assignments</p>
                    <p className="font-medium">{course.completedAssignments}/{course.assignments} done</p>
                </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                <Video className="h-4 w-4 mr-2" />
                Join Class
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Materials
                </Button>
            </div>
            </CardContent>
        </Card>
        ))}
    </div>
    </div>
</StudentLayout>
);
}
