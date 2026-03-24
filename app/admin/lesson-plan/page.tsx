"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, BookOpen,  Clock, CheckCircle2, AlertCircle,  Eye, Edit2, Trash2, Copy } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const syllabusData = [
  { id: 1, class: "Class 10", section: "A", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", totalTopics: 24, completed: 18, status: "In Progress", startDate: "2026-01-05", endDate: "2026-03-30" },
  { id: 2, class: "Class 10", section: "B", subject: "Science", teacher: "Mrs. Priya Singh", totalTopics: 20, completed: 20, status: "Completed", startDate: "2026-01-05", endDate: "2026-03-15" },
  { id: 3, class: "Class 9", section: "A", subject: "English", teacher: "Ms. Anita Sharma", totalTopics: 16, completed: 10, status: "In Progress", startDate: "2026-01-06", endDate: "2026-03-28" },
  { id: 4, class: "Class 8", section: "A", subject: "Hindi", teacher: "Mr. Suresh Verma", totalTopics: 18, completed: 5, status: "Pending", startDate: "2026-01-07", endDate: "2026-04-10" },
  { id: 5, class: "Class 10", section: "A", subject: "Social Science", teacher: "Mrs. Kavita Patel", totalTopics: 22, completed: 14, status: "In Progress", startDate: "2026-01-05", endDate: "2026-03-25" },
];

const topicPlanData = [
  { week: "Week 1", topic: "Quadratic Equations", subtopics: "Standard form, Factorization method", periods: 5, status: "Completed", methodology: "Lecture + Practice" },
  { week: "Week 2", topic: "Arithmetic Progressions", subtopics: "nth term, Sum of n terms", periods: 6, status: "Completed", methodology: "Interactive + Worksheet" },
  { week: "Week 3", topic: "Triangles", subtopics: "Similarity, Pythagoras theorem", periods: 5, status: "Completed", methodology: "Visual aids + Group work" },
  { week: "Week 4", topic: "Coordinate Geometry", subtopics: "Distance formula, Section formula", periods: 6, status: "In Progress", methodology: "Graphing + Practice" },
  { week: "Week 5", topic: "Trigonometry", subtopics: "Ratios, Identities", periods: 7, status: "Upcoming", methodology: "Lecture + Lab" },
  { week: "Week 6", topic: "Statistics", subtopics: "Mean, Median, Mode", periods: 5, status: "Upcoming", methodology: "Data analysis + Projects" },
];

const Page = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Plans", value: "45", icon: BookOpen, color: "text-primary" },
    { label: "In Progress", value: "28", icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: "12", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Pending", value: "5", icon: AlertCircle, color: "text-destructive" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{status}</Badge>;
      case "In Progress": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{status}</Badge>;
      case "Pending": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">{status}</Badge>;
      case "Upcoming": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                📚 Lesson Plan
                </h1>

                <p className="text-sm text-muted-foreground">
                Manage syllabus and weekly topic plans
                </p>
            </div>


            {/* Create Button */}
            <Dialog>

                <DialogTrigger asChild>

                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition">
                    <Plus className="h-4 w-4 mr-2"/>
                    Create Lesson Plan
                </Button>

                </DialogTrigger>


                {/* Dialog */}
                <DialogContent className="max-w-2xl">

                <DialogHeader>

                    <DialogTitle className="text-xl flex items-center gap-2">
                    ✨ Create New Lesson Plan
                    </DialogTitle>

                </DialogHeader>


                <div className="grid grid-cols-2 gap-4 py-4">

                    {/* Class */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>

                    <Select>
                        <SelectTrigger className="bg-muted/40">
                        <SelectValue placeholder="Select Class"/>
                        </SelectTrigger>

                        <SelectContent>
                        {["Class 8","Class 9","Class 10"].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                        </SelectContent>

                    </Select>
                    </div>


                    {/* Section */}
                    <div className="space-y-2">

                    <label className="text-sm font-medium">Section</label>

                    <Select>

                        <SelectTrigger className="bg-muted/40">
                        <SelectValue placeholder="Select Section"/>
                        </SelectTrigger>

                        <SelectContent>
                        {["A","B","C"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                        </SelectContent>

                    </Select>

                    </div>


                    {/* Subject */}
                    <div className="space-y-2">

                    <label className="text-sm font-medium">Subject</label>

                    <Select>

                        <SelectTrigger className="bg-muted/40">
                        <SelectValue placeholder="Select Subject"/>
                        </SelectTrigger>

                        <SelectContent>
                        {["Mathematics","Science","English","Hindi","Social Science"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                        </SelectContent>

                    </Select>

                    </div>


                    {/* Teacher */}
                    <div className="space-y-2">

                    <label className="text-sm font-medium">Teacher</label>

                    <Select>

                        <SelectTrigger className="bg-muted/40">
                        <SelectValue placeholder="Assign Teacher"/>
                        </SelectTrigger>

                        <SelectContent>
                        {[
                            "Mr. Rajesh Kumar",
                            "Mrs. Priya Singh",
                            "Ms. Anita Sharma"
                        ].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                        </SelectContent>

                    </Select>

                    </div>


                    {/* Start Date */}
                    <div className="space-y-2">

                    <label className="text-sm font-medium">Start Date</label>

                    <Input
                        type="date"
                        className="bg-muted/40"
                    />

                    </div>


                    {/* End Date */}
                    <div className="space-y-2">

                    <label className="text-sm font-medium">End Date</label>

                    <Input
                        type="date"
                        className="bg-muted/40"
                    />

                    </div>


                    {/* Description */}
                    <div className="col-span-2 space-y-2">

                    <label className="text-sm font-medium">
                        Description
                    </label>

                    <Textarea
                        placeholder="Write lesson plan description..."
                        className="bg-muted/40"
                    />

                    </div>

                </div>


                {/* Buttons */}

                <div className="flex justify-end gap-2">

                    <Button
                    variant="outline"
                    className="hover:bg-muted"
                    >
                    Cancel
                    </Button>

                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    Create Plan
                    </Button>

                </div>

                </DialogContent>

            </Dialog>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                {stats.map((stat) => (

                    <Card
                    key={stat.label}
                    className="border-0 shadow-md hover:shadow-xl transition hover:-translate-y-1"
                    >

                    <CardContent className="p-5 flex items-center gap-4">

                        {/* Icon */}
                        <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center 
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md`}
                        >
                        <stat.icon className="h-5 w-5" />
                        </div>

                        {/* Text */}
                        <div>

                        <p className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {stat.label}
                        </p>

                        </div>

                    </CardContent>

                    </Card>

                ))}

            </div>

            <Tabs defaultValue="syllabus">
                <TabsList className="bg-muted/40 p-1 rounded-xl flex gap-1">

                <TabsTrigger
                    value="syllabus"
                    className="px-4 py-2 rounded-lg text-sm font-medium 
                    data-[state=active]:bg-gradient-to-r 
                    data-[state=active]:from-indigo-500 
                    data-[state=active]:to-purple-500 
                    data-[state=active]:text-white
                    hover:bg-muted transition"
                >
                    📚 Syllabus Status
                </TabsTrigger>

                <TabsTrigger
                    value="topics"
                    className="px-4 py-2 rounded-lg text-sm font-medium 
                    data-[state=active]:bg-gradient-to-r 
                    data-[state=active]:from-pink-500 
                    data-[state=active]:to-rose-500 
                    data-[state=active]:text-white
                    hover:bg-muted transition"
                >
                    📝 Topic Plan
                </TabsTrigger>

                </TabsList>

                <TabsContent value="syllabus" className="space-y-4">

                    <Card className="border-0 shadow-md rounded-xl overflow-hidden">

                        {/* Header */}
                        <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b">

                        <div className="flex flex-col md:flex-row gap-3">

                        {/* Search */}
                        <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Search lesson plans..."
                        className="pl-9 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        />
                        </div>

                        {/* Class Filter */}
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-40 bg-white shadow-sm">
                        <SelectValue placeholder="All Classes" />
                        </SelectTrigger>

                        <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {["Class 8","Class 9","Class 10"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                        </SelectContent>
                        </Select>

                        {/* Subject Filter */}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-40 bg-white shadow-sm">
                        <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>

                        <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {["Mathematics","Science","English","Hindi","Social Science"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                        </SelectContent>
                        </Select>

                        </div>
                        </CardHeader>

                        {/* Table */}
                        <CardContent className="p-0">

                            <Table>

                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>

                                    {syllabusData.map(item => {

                                    const progress = (item.completed / item.totalTopics) * 100

                                    return (
                                        <TableRow
                                        key={item.id}
                                        className="hover:bg-muted/40 transition"
                                        >

                                            <TableCell className="font-medium">
                                                {item.class} - {item.section}
                                            </TableCell>

                                            <TableCell>{item.subject}</TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {item.teacher}
                                            </TableCell>

                                            {/* Progress */}
                                            <TableCell>
                                            <div className="flex items-center gap-3">

                                                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">

                                                    <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                    />

                                                </div>

                                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                    {item.completed}/{item.totalTopics}
                                                </span>

                                            </div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.startDate} → {item.endDate}
                                            </TableCell>

                                            <TableCell>
                                                {getStatusBadge(item.status)}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>

                                                <div className="flex justify-end gap-1">

                                                    <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                                                    >
                                                    <Eye className="h-4 w-4"/>
                                                    </Button>

                                                    <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                                                    >
                                                    <Edit2 className="h-4 w-4"/>
                                                    </Button>

                                                    <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                    >
                                                    <Trash2 className="h-4 w-4"/>
                                                    </Button>

                                                </div>

                                            </TableCell>

                                        </TableRow>
                                    )

                                })}

                                </TableBody>

                            </Table>

                        </CardContent>

                    </Card>

                </TabsContent>

                <TabsContent value="topics" className="space-y-4">

                    <Card className="border-0 shadow-md rounded-xl overflow-hidden">

                        {/* Header */}
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">

                            <div className="flex items-center justify-between">

                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    📘 Weekly Topic Plan — Mathematics (Class 10-A)
                                </CardTitle>

                                <Button
                                variant="outline"
                                size="sm"
                                className="bg-white hover:bg-indigo-50 hover:text-indigo-600 transition"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate Plan
                                </Button>

                            </div>

                        </CardHeader>

                        {/* Table */}
                        <CardContent className="p-0">

                            <Table>

                                {/* Table Header */}
                                <TableHeader className="bg-muted/40">
                                    <TableRow>

                                        <TableHead>Week</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Sub-Topics</TableHead>
                                        <TableHead>Periods</TableHead>
                                        <TableHead>Methodology</TableHead>
                                        <TableHead>Status</TableHead>

                                    </TableRow>
                                </TableHeader>

                                    <TableBody>

                                        {topicPlanData.map(item => (

                                            <TableRow
                                            key={item.week}
                                            className="hover:bg-muted/40 transition"
                                            >

                                                {/* Week */}
                                                <TableCell className="font-semibold text-indigo-600">
                                                    {item.week}
                                                </TableCell>

                                                {/* Topic */}
                                                <TableCell className="font-medium">
                                                    {item.topic}
                                                </TableCell>

                                                {/* Subtopics */}
                                                <TableCell className="text-muted-foreground text-sm max-w-[240px]">
                                                    {item.subtopics}
                                                </TableCell>

                                                {/* Periods */}
                                                <TableCell>

                                                <span className="px-2 py-1 rounded-md bg-indigo-100 text-indigo-600 text-xs font-semibold">
                                                    {item.periods} Periods
                                                </span>

                                                </TableCell>

                                                {/* Methodology */}
                                                <TableCell>

                                                    <Badge
                                                    className="
                                                    bg-blue-100
                                                    text-blue-600
                                                    border-blue-200
                                                    "
                                                    >
                                                        {item.methodology}
                                                    </Badge>

                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>

                                                    {getStatusBadge(item.status)}

                                                </TableCell>

                                            </TableRow>

                                        ))}

                                    </TableBody>

                            </Table>

                        </CardContent>

                    </Card>

                </TabsContent>
            </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;