// /* eslint-disable @typescript-eslint/no-explicit-any */
'use client'


import { useState } from "react";
import { Plus, Search, Play, Eye, Settings, Clock, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface OnlineExamData {
  id: number;
  title: string;
  class: string;
  subject: string;
  questions: number;
  duration: number;
  totalMarks: number;
  attempts: number;
  status: "Draft" | "Active" | "Completed" | "Scheduled";
  startDate: string;
  autoGrade: boolean;
}

export const sampleExams: OnlineExamData[] = [
  {
    id: 1,
    title: "Math Quiz - Chapter 5",
    class: "Class 10",
    subject: "Mathematics",
    questions: 30,
    duration: 60,
    totalMarks: 100,
    attempts: 28,
    status: "Active",
    startDate: "2025-09-20",
    autoGrade: true,
  },
  {
    id: 2,
    title: "Science MCQ Test",
    class: "Class 9",
    subject: "Science",
    questions: 25,
    duration: 45,
    totalMarks: 50,
    attempts: 0,
    status: "Scheduled",
    startDate: "2025-09-25",
    autoGrade: true,
  },
  {
    id: 3,
    title: "English Grammar Test",
    class: "Class 10",
    subject: "English",
    questions: 20,
    duration: 30,
    totalMarks: 40,
    attempts: 35,
    status: "Completed",
    startDate: "2025-09-10",
    autoGrade: false,
  },
  {
    id: 4,
    title: "History Assessment",
    class: "Class 8",
    subject: "History",
    questions: 15,
    duration: 30,
    totalMarks: 30,
    attempts: 0,
    status: "Draft",
    startDate: "",
    autoGrade: true,
  },
];

export const statusColors: Record<string, string> = {

  Draft:
    "bg-secondary/50 text-foreground border-border",

  Active:
    "bg-secondary/50 text-foreground border-border",

  Completed:
    "bg-secondary/50 text-foreground border-border",

  Scheduled:
    "bg-secondary/50 text-foreground border-border",

};

export const subjectColors: Record<string, string> = {

  Mathematics:
    "bg-secondary/50 text-foreground",

  Science:
    "bg-secondary/50 text-foreground",

  English:
    "bg-secondary/50 text-foreground",

  History:
    "bg-secondary/50 text-foreground",

};

const Page = () => {
  const [exams] = useState(sampleExams);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
        <div className="space-y-6">
            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                🧠 Online Exam
                </h1>
                <p className="text-sm text-muted-foreground">
                Create and manage online examinations
                </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                <DialogTrigger asChild>

                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition">
                    <Plus className="h-4 w-4 mr-2"/>
                    Create Exam
                </Button>

                </DialogTrigger>

                <DialogContent className="max-w-lg">

                <DialogHeader>
                    <DialogTitle>Create Online Exam</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div>
                    <Label>Exam Title</Label>
                    <Input placeholder="e.g. Math Quiz - Chapter 5"/>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                    <div>
                        <Label>Class</Label>
                        <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="9">Class 9</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Subject</Label>
                        <Input placeholder="Mathematics"/>
                    </div>

                    </div>

                    <div className="grid grid-cols-3 gap-3">

                    <div>
                        <Label>Questions</Label>
                        <Input type="number" placeholder="30"/>
                    </div>

                    <div>
                        <Label>Duration</Label>
                        <Input type="number" placeholder="60"/>
                    </div>

                    <div>
                        <Label>Total Marks</Label>
                        <Input type="number" placeholder="100"/>
                    </div>

                    </div>

                    <div>
                    <Label>Start Date</Label>
                    <Input type="datetime-local"/>
                    </div>

                    <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
                    <Label>Auto Grade (MCQ)</Label>
                    <Switch defaultChecked/>
                    </div>

                    <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    onClick={() => setDialogOpen(false)}
                    >
                    Create Exam
                    </Button>

                </div>

                </DialogContent>

            </Dialog>

            </div>



            {/* STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

            <Card className="shadow-md hover:shadow-xl transition">
                <CardContent className="p-5 flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                    <FileText className="h-5 w-5"/>
                </div>

                <div>
                    <p className="text-2xl font-bold">{exams.length}</p>
                    <p className="text-xs text-muted-foreground">Total Exams</p>
                </div>

                </CardContent>
            </Card>


            <Card className="shadow-md hover:shadow-xl transition">
                <CardContent className="p-5 flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white">
                    <Play className="h-5 w-5"/>
                </div>

                <div>
                    <p className="text-2xl font-bold">
                    {exams.filter(e => e.status === "Active").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                </div>

                </CardContent>
            </Card>


            <Card className="shadow-md hover:shadow-xl transition">
                <CardContent className="p-5 flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center text-white">
                    <Clock className="h-5 w-5"/>
                </div>

                <div>
                    <p className="text-2xl font-bold">
                    {exams.filter(e => e.status === "Scheduled").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>

                </CardContent>
            </Card>


            <Card className="shadow-md hover:shadow-xl transition">
                <CardContent className="p-5 flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                    <Users className="h-5 w-5"/>
                </div>

                <div>
                    <p className="text-2xl font-bold">
                    {exams.reduce((a, e) => a + e.attempts, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Attempts</p>
                </div>

                </CardContent>
            </Card>

            </div>



            {/* SEARCH */}

            <div className="relative w-full md:w-80 mt-6">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>

            <Input
                className="pl-10 rounded-xl border-muted bg-muted/40 focus-visible:ring-primary"
                placeholder="Search online exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {filtered.map((exam) => (

                    <Card
                    key={exam.id}
                    className="border-0 shadow-lg hover:shadow-xl transition hover:-translate-y-1 overflow-hidden"
                    >

                    {/* Top Gradient Line */}
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <CardContent className="p-5">

                        {/* Header */}

                        <div className="flex items-start justify-between mb-4">

                        <div>
                            <h3 className="font-semibold text-foreground text-base">
                            {exam.title}
                            </h3>

                            <p className="text-xs text-muted-foreground">
                            {exam.class} • {exam.subject}
                            </p>
                        </div>

                        <Badge
                            className={`px-3 py-1 text-xs font-medium border ${statusColors[exam.status]}`}
                        >
                            {exam.status}
                        </Badge>

                        </div>


                        {/* Stats */}

                        <div className="grid grid-cols-3 gap-3 mb-4 text-center">

                        <div className="bg-secondary/50 rounded-xl p-3">
                            <p className="text-lg font-bold text-foreground">
                            {exam.questions}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Questions</p>
                        </div>

                        <div className="bg-secondary/50 rounded-xl p-3">
                            <p className="text-lg font-bold text-foreground">
                            {exam.duration}m
                            </p>
                            <p className="text-[10px] text-muted-foreground">Duration</p>
                        </div>

                        <div className="bg-secondary/50 rounded-xl p-3">
                            <p className="text-lg font-bold text-foreground">
                            {exam.totalMarks}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Marks</p>
                        </div>

                        </div>


                        {/* Attempts */}

                        {exam.status !== "Draft" && (

                        <div className="mb-4">

                            <div className="flex justify-between text-xs mb-1">

                            <span className="text-muted-foreground">
                                Attempts
                            </span>

                            <span className="font-medium text-foreground">
                                {exam.attempts}
                            </span>

                            </div>

                            <Progress
                            value={
                                exam.attempts > 0
                                ? Math.min((exam.attempts / 40) * 100, 100)
                                : 0
                            }
                            className="h-2"
                            />

                        </div>

                        )}


                        {/* Buttons */}

                        <div className="flex gap-2">

                        <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
                        >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-muted"
                        >
                            <Settings className="h-3.5 w-3.5" />
                        </Button>

                        </div>

                    </CardContent>

                    </Card>

                ))}

            </div>
        </div>
    </AdminLayout>
  );
};

export default Page;