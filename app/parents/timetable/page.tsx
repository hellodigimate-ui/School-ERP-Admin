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
import { Clock } from "lucide-react";
import ParentLayout from "@/components/parents/layout/parentLayout";

const timetableData = {
  rahul: {
    name: "Rahul Sharma",
    class: "Class 10-A",
    schedule: [
      { time: "8:00 - 8:45", subject: "Mathematics", teacher: "Mrs. Sharma", room: "Room 101" },
      { time: "8:45 - 9:30", subject: "Physics", teacher: "Mr. Patel", room: "Lab 1" },
      { time: "9:30 - 10:15", subject: "Chemistry", teacher: "Mrs. Gupta", room: "Lab 2" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:15", subject: "English", teacher: "Ms. Johnson", room: "Room 105" },
      { time: "11:15 - 12:00", subject: "Computer Science", teacher: "Mr. Kumar", room: "Computer Lab" },
      { time: "12:00 - 12:45", subject: "Hindi", teacher: "Mrs. Singh", room: "Room 102" },
      { time: "12:45 - 1:30", subject: "Lunch", teacher: "", room: "" },
      { time: "1:30 - 2:15", subject: "Physical Education", teacher: "Mr. Verma", room: "Ground" },
    ],
  },
  ananya: {
    name: "Ananya Sharma",
    class: "Class 7-B",
    schedule: [
      { time: "8:00 - 8:45", subject: "English", teacher: "Ms. Rao", room: "Room 201" },
      { time: "8:45 - 9:30", subject: "Mathematics", teacher: "Mr. Iyer", room: "Room 203" },
      { time: "9:30 - 10:15", subject: "Science", teacher: "Mrs. Nair", room: "Lab 3" },
      { time: "10:15 - 10:30", subject: "Break", teacher: "", room: "" },
      { time: "10:30 - 11:15", subject: "Social Studies", teacher: "Mr. Menon", room: "Room 205" },
      { time: "11:15 - 12:00", subject: "Hindi", teacher: "Mrs. Devi", room: "Room 202" },
      { time: "12:00 - 12:45", subject: "Art", teacher: "Ms. Priya", room: "Art Room" },
      { time: "12:45 - 1:30", subject: "Lunch", teacher: "", room: "" },
      { time: "1:30 - 2:15", subject: "Music", teacher: "Mr. Das", room: "Music Room" },
    ],
  },
};

const subjectColors: Record<string, string> = {
  Mathematics: "bg-primary/10 text-primary",
  Physics: "bg-info/10 text-info",
  Chemistry: "bg-success/10 text-success",
  English: "bg-warning/10 text-warning",
  "Computer Science": "bg-chart-5/10 text-chart-5",
  Hindi: "bg-destructive/10 text-destructive",
  Science: "bg-success/10 text-success",
  "Social Studies": "bg-warning/10 text-warning",
  Art: "bg-chart-4/10 text-chart-4",
  Music: "bg-chart-5/10 text-chart-5",
  "Physical Education": "bg-chart-3/10 text-chart-3",
  Break: "bg-muted text-muted-foreground",
  Lunch: "bg-muted text-muted-foreground",
};

export default function TimeTable() {
  const [selectedChild, setSelectedChild] = useState<"rahul" | "ananya">("rahul");
  const [selectedDay, setSelectedDay] = useState("monday");
  const data = timetableData[selectedChild];

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  return (
    <ParentLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-2xl font-bold">Time Table</h1>
            <p className="text-muted-foreground">View class schedule</p>
            </div>
            <div className="flex gap-3">
            <Select
                value={selectedChild}
                onValueChange={(value) => setSelectedChild(value as "rahul" | "ananya")}
            >
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="rahul">Rahul Sharma</SelectItem>
                <SelectItem value="ananya">Ananya Sharma</SelectItem>
                </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                {days.map((day) => (
                    <SelectItem key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        </div>

        {/* Schedule Card */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {data.name} - {data.class} ({selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)})
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
                {data.schedule.map((period, index) => {
                const isBreak = period.subject === "Break" || period.subject === "Lunch";
                return (
                    <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl border border-border ${
                        isBreak ? "bg-muted/50" : "bg-muted/30"
                    }`}
                    >
                    <div className="w-24 text-sm font-medium text-muted-foreground">
                        {period.time}
                    </div>
                    <Badge
                        variant="secondary"
                        className={subjectColors[period.subject] || "bg-muted text-muted-foreground"}
                    >
                        {period.subject}
                    </Badge>
                    {!isBreak && (
                        <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm">{period.teacher}</span>
                        <span className="text-sm text-muted-foreground">{period.room}</span>
                        </div>
                    )}
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
