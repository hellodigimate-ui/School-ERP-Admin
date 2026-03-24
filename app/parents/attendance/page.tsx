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
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import ParentLayout from "@/components/parents/layout/parentLayout";

const attendanceData = {
  rahul: {
    name: "Rahul Sharma",
    class: "Class 10-A",
    monthlyRate: 92,
    present: 22,
    absent: 2,
    leave: 1,
    total: 25,
    records: [
      { date: "Feb 1, 2026", day: "Monday", status: "present" },
      { date: "Feb 2, 2026", day: "Tuesday", status: "present" },
      { date: "Feb 3, 2026", day: "Wednesday", status: "absent" },
      { date: "Feb 4, 2026", day: "Thursday", status: "present" },
      { date: "Feb 5, 2026", day: "Friday", status: "present" },
      { date: "Feb 6, 2026", day: "Saturday", status: "leave" },
    ],
  },
  ananya: {
    name: "Ananya Sharma",
    class: "Class 7-B",
    monthlyRate: 96,
    present: 24,
    absent: 1,
    leave: 0,
    total: 25,
    records: [
      { date: "Feb 1, 2026", day: "Monday", status: "present" },
      { date: "Feb 2, 2026", day: "Tuesday", status: "present" },
      { date: "Feb 3, 2026", day: "Wednesday", status: "present" },
      { date: "Feb 4, 2026", day: "Thursday", status: "present" },
      { date: "Feb 5, 2026", day: "Friday", status: "absent" },
      { date: "Feb 6, 2026", day: "Saturday", status: "present" },
    ],
  },
};

const statusConfig = {
  present: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Present" },
  absent: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Absent" },
  leave: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Leave" },
};

export default function Page() {
  const [selectedChild, setSelectedChild] = useState<"rahul" | "ananya">("rahul");
  const data = attendanceData[selectedChild];

  return (
    <ParentLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Track your children`s attendance</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
            <CardContent className="pt-6">
                <div className="text-center">
                <div className="text-4xl font-bold text-primary">{data.monthlyRate}%</div>
                <div className="text-sm text-muted-foreground mt-1">Monthly Rate</div>
                <Progress value={data.monthlyRate} className="h-2 mt-3" />
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-success">{data.present}</div>
                <div className="text-sm text-muted-foreground mt-1">Days Present</div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-destructive">{data.absent}</div>
                <div className="text-sm text-muted-foreground mt-1">Days Absent</div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-warning">{data.leave}</div>
                <div className="text-sm text-muted-foreground mt-1">On Leave</div>
            </CardContent>
            </Card>
        </div>

        {/* Attendance Records */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Attendance Records - {data.name}
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
                {data.records.map((record, index) => {
                const config = statusConfig[record.status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                    <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                    >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                        <div className="font-medium">{record.date}</div>
                        <div className="text-sm text-muted-foreground">{record.day}</div>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className={`${config.bg} ${config.color} border-0`}
                    >
                        {config.label}
                    </Badge>
                    </div>
                );
                })}
            </div>
            </CardContent>
        </Card>
        </div>
    </ParentLayout>
  );
}
