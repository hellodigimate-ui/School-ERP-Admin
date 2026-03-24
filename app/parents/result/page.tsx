"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ParentLayout from "@/components/parents/layout/parentLayout";

const resultsData = {
  rahul: {
    name: "Rahul Sharma",
    class: "Class 10-A",
    cgpa: 8.5,
    rank: 5,
    totalStudents: 42,
    subjects: [
      { name: "Mathematics", grade: "A+", marks: 95, total: 100, trend: "up" },
      { name: "Physics", grade: "A", marks: 88, total: 100, trend: "up" },
      { name: "Chemistry", grade: "A", marks: 85, total: 100, trend: "same" },
      { name: "English", grade: "B+", marks: 78, total: 100, trend: "down" },
      { name: "Computer Science", grade: "A+", marks: 92, total: 100, trend: "up" },
      { name: "Hindi", grade: "A", marks: 84, total: 100, trend: "same" },
    ],
  },
  ananya: {
    name: "Ananya Sharma",
    class: "Class 7-B",
    cgpa: 9.2,
    rank: 2,
    totalStudents: 38,
    subjects: [
      { name: "Mathematics", grade: "A+", marks: 98, total: 100, trend: "up" },
      { name: "Science", grade: "A+", marks: 94, total: 100, trend: "up" },
      { name: "Social Studies", grade: "A", marks: 88, total: 100, trend: "same" },
      { name: "English", grade: "A+", marks: 92, total: 100, trend: "up" },
      { name: "Hindi", grade: "A", marks: 90, total: 100, trend: "up" },
      { name: "Art", grade: "A+", marks: 95, total: 100, trend: "same" },
    ],
  },
};

const gradeColors: Record<string, string> = {
  "A+": "bg-success text-success-foreground",
  A: "bg-success/80 text-success-foreground",
  "B+": "bg-primary text-primary-foreground",
  B: "bg-primary/80 text-primary-foreground",
  "C+": "bg-warning text-warning-foreground",
  C: "bg-warning/80 text-warning-foreground",
  D: "bg-destructive/80 text-destructive-foreground",
  F: "bg-destructive text-destructive-foreground",
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export default function Results() {
  const [selectedChild, setSelectedChild] = useState<"rahul" | "ananya">("rahul");
  const data = resultsData[selectedChild];

  return (
    <ParentLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-2xl font-bold">Results</h1>
            <p className="text-muted-foreground">View academic performance</p>
            </div>
            <Select
            value={selectedChild}
            onValueChange={(value) => setSelectedChild(value as "rahul" | "ananya")}
            >
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="rahul">Rahul Sharma</SelectItem>
                <SelectItem value="ananya">Ananya Sharma</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <div className="text-3xl font-bold">{data.cgpa}</div>
                    <div className="text-sm text-muted-foreground">Current CGPA</div>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="text-center">
                <div className="text-3xl font-bold text-primary">#{data.rank}</div>
                <div className="text-sm text-muted-foreground">Class Rank</div>
                <div className="text-xs text-muted-foreground mt-1">
                    out of {data.totalStudents} students
                </div>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6">
                <div className="text-center">
                <div className="text-3xl font-bold">{data.subjects.length}</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
                <div className="text-xs text-primary mt-1">Term 1 Results</div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Subject-wise Results */}
        <Card>
            <CardHeader>
            <CardTitle>Subject-wise Performance - {data.name}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {data.subjects.map((subject, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                >
                    <div className="flex items-center gap-4">
                    <Badge className={gradeColors[subject.grade]}>
                        {subject.grade}
                    </Badge>
                    <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-muted-foreground">
                        {subject.marks}/{subject.total} marks
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-lg font-bold">{subject.marks}%</div>
                    </div>
                    <TrendIcon trend={subject.trend} />
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
        </div>
    </ParentLayout>
  );
}
