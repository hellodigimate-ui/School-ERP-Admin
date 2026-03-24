"use client"

import ParentLayout from "@/components/parents/layout/parentLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, BookOpen, Trophy, Calendar } from "lucide-react";

const children = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    class: "Class 10-A",
    rollNo: "1045",
    section: "A",
    attendance: 92,
    cgpa: 8.5,
    totalSubjects: 6,
    pendingAssignments: 2,
    classTeacher: "Mrs. Priya Singh",
    bloodGroup: "O+",
    dob: "March 15, 2011",
  },
  {
    id: "2",
    name: "Ananya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    class: "Class 7-B",
    rollNo: "732",
    section: "B",
    attendance: 96,
    cgpa: 9.2,
    totalSubjects: 6,
    pendingAssignments: 0,
    classTeacher: "Mr. Ravi Kumar",
    bloodGroup: "O+",
    dob: "July 22, 2014",
  },
];

export default function MyChildren() {
  return (
    <ParentLayout>
        <div className="space-y-6">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold">My Children</h1>
            <p className="text-muted-foreground">
            Manage and view details of your children
            </p>
        </div>

        {/* Children Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-card">
                        <AvatarImage src={child.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {child.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{child.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                        {child.class} | Roll No: {child.rollNo}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                        Section {child.section}
                        </Badge>
                    </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="w-4 h-4" />
                    View Profile
                    </Button>
                </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-success/10 flex items-center justify-center mb-2">
                        <Calendar className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-lg font-bold text-success">{child.attendance}%</div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-lg font-bold">{child.cgpa}</div>
                    <div className="text-xs text-muted-foreground">CGPA</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-warning/10 flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-warning" />
                    </div>
                    <div className="text-lg font-bold text-warning">{child.pendingAssignments}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class Teacher</span>
                    <span className="font-medium">{child.classTeacher}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Subjects</span>
                    <span className="font-medium">{child.totalSubjects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date of Birth</span>
                    <span className="font-medium">{child.dob}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blood Group</span>
                    <Badge variant="outline">{child.bloodGroup}</Badge>
                    </div>
                </div>

                {/* Attendance Progress */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Monthly Attendance</span>
                    <span className="font-medium">{child.attendance}%</span>
                    </div>
                    <Progress value={child.attendance} className="h-2" />
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </ParentLayout>
  );
}
