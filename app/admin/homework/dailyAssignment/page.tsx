'use client'


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dailyData: Record<string, { subject: string; title: string; status: "Completed" | "Pending" | "Overdue" }[]> = {
  Mon: [
    { subject: "Mathematics", title: "Solve Exercise 5.3 (Q1-Q10)", status: "Completed" },
    { subject: "English", title: "Write essay on 'My School'", status: "Completed" },
  ],
  Tue: [
    { subject: "Science", title: "Draw and label human digestive system", status: "Completed" },
    { subject: "Hindi", title: "Complete grammar worksheet", status: "Pending" },
  ],
  Wed: [
    { subject: "Physics", title: "Numerical problems on Motion Ch-2", status: "Pending" },
    { subject: "Chemistry", title: "Balance chemical equations (pg 45)", status: "Overdue" },
    { subject: "Mathematics", title: "Trigonometry practice set", status: "Pending" },
  ],
  Thu: [
    { subject: "English", title: "Read Chapter 4 and summarize", status: "Pending" },
    { subject: "Social Science", title: "Map work - Rivers of India", status: "Pending" },
  ],
  Fri: [
    { subject: "Mathematics", title: "Geometry construction exercises", status: "Pending" },
    { subject: "Computer", title: "Write HTML program for table", status: "Pending" },
  ],
  Sat: [
    { subject: "Science", title: "Weekly revision test preparation", status: "Pending" },
  ],
};

const statusConfig = {
  Completed: { icon: CheckCircle2, color: "text-green-600 bg-green-500/10" },
  Pending: { icon: Clock, color: "text-amber-600 bg-amber-500/10" },
  Overdue: { icon: AlertCircle, color: "text-red-600 bg-red-500/10" },
};

const Page = () => {
  const [selectedDay, setSelectedDay] = useState("Wed");
  const [selectedClass, setSelectedClass] = useState("Class 10-A");

  const totalByStatus = (status: string) =>
    Object.values(dailyData).flat().filter(d => d.status === status).length;

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Assignment</h1>
            <p className="text-muted-foreground text-sm">Track daily assignments and submissions</p>
            </div>
            <div className="flex gap-2">
            <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
                <option>Class 10-A</option><option>Class 10-B</option><option>Class 9-A</option><option>Class 9-B</option>
            </select>
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" /> This Week</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{totalByStatus("Completed")}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-600">
                <Clock className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{totalByStatus("Pending")}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-red-500/10 text-red-600">
                <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{totalByStatus("Overdue")}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Week Navigation */}
        <Card>
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Week: Feb 10 - Feb 15, 2025</CardTitle>
                <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <div className="flex gap-2 mb-6">
                {weekDays.map(day => (
                <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${selectedDay === day ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                    <div>{day}</div>
                    <div className="text-xs mt-0.5 opacity-80">{dailyData[day]?.length || 0} tasks</div>
                </button>
                ))}
            </div>

            <div className="space-y-3">
                {dailyData[selectedDay]?.map((item, i) => {
                const StatusIcon = statusConfig[item.status].icon;
                return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.subject} • {selectedClass}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={statusConfig[item.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" /> {item.status}
                        </Badge>
                    </div>
                    </div>
                );
                })}
                {(!dailyData[selectedDay] || dailyData[selectedDay].length === 0) && (
                <p className="text-center py-8 text-muted-foreground">No assignments for this day</p>
                )}
            </div>
            </CardContent>
        </Card>
        </div>
    </AdminLayout>
  );
};

export default Page;