/* eslint-disable react-hooks/rules-of-hooks */
"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Video, Plus, Search, Users, Clock, Calendar, Play, ExternalLink,
   Copy, Star, Filter, Mic,
   ScreenShare, MessageSquare, Hand, Settings,
   CheckCircle
} from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

const stats = [
  {
    label: "Total Classes",
    value: 128,
    icon: Video,
    gradient: "linear-gradient(135deg,#c084fc,#6366f1)",
  },
  {
    label: "Live Now",
    value: 3,
    icon: Users,
    gradient: "linear-gradient(135deg,#34d399,#10b981)",
  },
  {
    label: "Upcoming",
    value: 12,
    icon: Calendar,
    gradient: "linear-gradient(135deg,#60a5fa,#3b82f6)",
  },
  {
    label: "Completed",
    value: 95,
    icon: CheckCircle,
    gradient: "linear-gradient(135deg,#fbbf24,#f59e0b)",
  },
]

const liveNow = [
  { id: 1, title: "Mathematics - Trigonometry", teacher: "Mr. Rajesh Kumar", class: "10-A", students: 38, duration: "45 min", started: "10:00 AM", meetLink: "meet.google.com/abc-defg-hij", status: "Live" },
  { id: 2, title: "Physics - Optics", teacher: "Mrs. Sunita Verma", class: "11-B", students: 35, duration: "50 min", started: "10:15 AM", meetLink: "meet.google.com/xyz-abcd-efg", status: "Live" },
  { id: 3, title: "English Literature", teacher: "Ms. Priya Nair", class: "9-C", students: 42, duration: "40 min", started: "10:30 AM", meetLink: "meet.google.com/lmn-opqr-stu", status: "Live" },
];

const scheduled = [
  { id: 1, title: "Chemistry - Organic Reactions", teacher: "Dr. Amit Sharma", class: "12-A", date: "2024-04-02", time: "11:00 AM", duration: "50 min", students: 40, status: "Scheduled" },
  { id: 2, title: "History - Mughal Empire", teacher: "Mrs. Kavita Joshi", class: "8-B", date: "2024-04-02", time: "12:00 PM", duration: "45 min", students: 38, status: "Scheduled" },
  { id: 3, title: "Computer Science - Python", teacher: "Mr. Arjun Reddy", class: "11-A", date: "2024-04-02", time: "02:00 PM", duration: "55 min", students: 36, status: "Scheduled" },
  { id: 4, title: "Biology - Cell Division", teacher: "Dr. Meera Patel", class: "10-B", date: "2024-04-03", time: "09:00 AM", duration: "45 min", students: 39, status: "Scheduled" },
  { id: 5, title: "Hindi - Kavya Sangrah", teacher: "Mrs. Rekha Singh", class: "9-A", date: "2024-04-03", time: "10:30 AM", duration: "40 min", students: 41, status: "Scheduled" },
];

const pastClasses = [
  { id: 1, title: "Mathematics - Algebra", teacher: "Mr. Rajesh Kumar", class: "10-A", date: "2024-04-01", duration: "48 min", attended: 36, total: 40, rating: 4.5, recording: true },
  { id: 2, title: "Physics - Newton's Laws", teacher: "Mrs. Sunita Verma", class: "11-B", date: "2024-04-01", duration: "52 min", attended: 33, total: 35, rating: 4.8, recording: true },
  { id: 3, title: "English - Shakespeare", teacher: "Ms. Priya Nair", class: "9-C", date: "2024-03-31", duration: "42 min", attended: 39, total: 42, rating: 4.2, recording: false },
];

const page = () => {
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
                <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3 tracking-tight">
                <span className="p-2 rounded-xl bg-primary/10 shadow-sm">
                    <Video className="w-6 h-6 text-primary" />
                </span>
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    G-Meet Live Classes
                </span>
                </h1>

                <p className="text-muted-foreground text-sm mt-2">
                Schedule, manage & monitor Google Meet live classes
                </p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                <Button className="gradient-hero text-primary-foreground shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Class
                </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Schedule New Live Class
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">

                    <div className="space-y-2">
                    <Label>Class Title</Label>
                    <Input 
                        placeholder="e.g. Mathematics - Trigonometry"
                        className="focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/40">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {["8-A","8-B","9-A","9-B","10-A","10-B","11-A","11-B","12-A","12-B"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/40">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Mathematics","Physics","Chemistry","Biology","English","Hindi","History","Computer Science"].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" className="focus:ring-2 focus:ring-primary/40 transition-all" />
                    </div>

                    <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" className="focus:ring-2 focus:ring-primary/40 transition-all" />
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Duration (min)</Label>
                        <Input type="number" placeholder="45" className="focus:ring-2 focus:ring-primary/40 transition-all" />
                    </div>

                    <div className="space-y-2">
                        <Label>Teacher</Label>
                        <Select>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/40">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rajesh">Mr. Rajesh Kumar</SelectItem>
                            <SelectItem value="sunita">Mrs. Sunita Verma</SelectItem>
                            <SelectItem value="priya">Ms. Priya Nair</SelectItem>
                            <SelectItem value="amit">Dr. Amit Sharma</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label>Google Meet Link (auto-generated or paste)</Label>
                    <Input 
                        placeholder="meet.google.com/xxx-xxxx-xxx"
                        className="focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                        placeholder="Class description..."
                        className="focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    </div>

                    <Button className="w-full gradient-hero text-primary-foreground shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    Schedule Class
                    </Button>

                </div>
                </DialogContent>
            </Dialog>

        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((s, i) => (
            <Card
            key={i}
            className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            style={{ background: s.gradient }}
            >

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl" />
            </div>

            <CardContent className="relative p-6">
                <div className="flex items-center gap-5">

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center shadow-md group-hover:scale-110 transition">
                    <s.icon className="w-6 h-6 text-gray-800" />
                </div>

                {/* Text */}
                <div>
                    <p className="text-sm text-gray-700 font-medium tracking-wide">
                    {s.label}
                    </p>

                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {s.value}
                    </p>
                </div>

                </div>
            </CardContent>

            </Card>
        ))}

        </div>



        {/* Live Now Banner */}
        {liveNow.length > 0 && (
        <Card className="relative border-0 shadow-xl overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl">
            {/* Top Gradient Line */}
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 animate-pulse" />

            <CardHeader className="pb-3">
            <CardTitle className="text-xl font-display flex items-center gap-3 text-gray-800">
                <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Live Now ({liveNow.length} classes)
            </CardTitle>
            </CardHeader>

            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {liveNow.map((cls) => (
                <Card
                    key={cls.id}
                    className="group relative border border-border/40 shadow-md rounded-2xl overflow-hidden bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Soft Glow on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-20" />
                    </div>

                    <div className="absolute top-3 right-3">
                    <Badge className="bg-emerald-500 text-white border-0 text-xs px-3 py-1 shadow-md animate-pulse">
                        🔴 LIVE
                    </Badge>
                    </div>

                    <CardContent className="relative p-5 space-y-4">
                    <h3 className="font-semibold font-display text-gray-800 pr-16 text-base">
                        {cls.title}
                    </h3>

                    <p className="text-sm text-gray-500">{cls.teacher}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-500" /> {cls.students}
                        </span>
                        <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" /> {cls.duration}
                        </span>
                        <Badge
                        variant="outline"
                        className="text-xs bg-gray-50 border-gray-200"
                        >
                        {cls.class}
                        </Badge>
                    </div>

                    {/* Mock Meet Controls */}
                    <div className="flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-border/40">
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-emerald-50">
                        <Mic className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-blue-50">
                        <Video className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-purple-50">
                        <ScreenShare className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-yellow-50">
                        <Hand className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full bg-white shadow-sm hover:bg-pink-50">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        </Button>
                    </div>

                    <div className="flex gap-3">
                        <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs shadow-md hover:shadow-lg transition"
                        >
                        <ExternalLink className="w-3 h-3 mr-1" /> Join Meet
                        </Button>
                        <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-300 hover:bg-gray-50"
                        >
                        <Copy className="w-3 h-3 mr-1" /> Link
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            </CardContent>
        </Card>
        )}


        {/* Tabs */}
        <Tabs defaultValue="scheduled" className="space-y-4">
            <TabsList className="relative bg-white/70 backdrop-blur-xl border border-border/40 shadow-md rounded-xl p-1 flex gap-1">

                <TabsTrigger
                    value="scheduled"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    hover:bg-purple-50 hover:text-purple-600
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500
                    data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                    <Calendar className="w-4 h-4" />
                    Scheduled
                </TabsTrigger>

                <TabsTrigger
                    value="past"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    hover:bg-blue-50 hover:text-blue-600
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500
                    data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                    <Clock className="w-4 h-4" />
                    Past Classes
                </TabsTrigger>

                <TabsTrigger
                    value="settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    hover:bg-emerald-50 hover:text-emerald-600
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500
                    data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </TabsTrigger>

            </TabsList>


            <TabsContent value="scheduled">
            <Card className="relative border border-border/40 shadow-xl rounded-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                
                {/* Top Gradient Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

                <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 pt-6">
                <CardTitle className="text-xl font-display text-gray-800">
                    Upcoming Classes
                </CardTitle>

                <div className="flex gap-3">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 w-56 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-400 transition-all"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    </div>

                    <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg border-gray-200 hover:bg-purple-50 hover:text-purple-600 transition"
                    >
                    <Filter className="w-4 h-4" />
                    </Button>
                </div>
                </CardHeader>

                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold text-gray-600">Title</TableHead>
                        <TableHead className="font-semibold text-gray-600">Teacher</TableHead>
                        <TableHead className="font-semibold text-gray-600">Class</TableHead>
                        <TableHead className="font-semibold text-gray-600">Date</TableHead>
                        <TableHead className="font-semibold text-gray-600">Time</TableHead>
                        <TableHead className="font-semibold text-gray-600">Duration</TableHead>
                        <TableHead className="font-semibold text-gray-600">Actions</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {scheduled
                        .filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
                        .map((cls) => (
                        <TableRow
                            key={cls.id}
                            className="hover:bg-purple-50/40 transition-all duration-200"
                        >
                            <TableCell className="font-semibold text-gray-800">
                            {cls.title}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                            {cls.teacher}
                            </TableCell>

                            <TableCell>
                            <Badge className="bg-indigo-50 text-indigo-600 border-0">
                                {cls.class}
                            </Badge>
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                            {cls.date}
                            </TableCell>

                            <TableCell className="text-sm font-semibold text-purple-600">
                            {cls.time}
                            </TableCell>

                            <TableCell className="text-sm text-gray-600">
                            {cls.duration}
                            </TableCell>

                            <TableCell>
                            <div className="flex gap-2">
                                <Button
                                size="sm"
                                className="h-8 text-xs bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                <Play className="w-3 h-3 mr-1" /> Start
                                </Button>

                                <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 transition"
                                >
                                <Copy className="w-3.5 h-3.5 text-gray-600" />
                                </Button>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>


            <TabsContent value="past">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-sm overflow-hidden">
                
                {/* Top Accent Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <CardHeader className="pb-4">
                <CardTitle className="text-xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    📚 Class History
                </CardTitle>
                </CardHeader>

                <CardContent>
                <div className="rounded-xl border bg-background/60 backdrop-blur-sm overflow-hidden">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-muted/70 to-muted/40">
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Teacher</TableHead>
                        <TableHead className="font-semibold">Class</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Duration</TableHead>
                        <TableHead className="font-semibold">Attendance</TableHead>
                        <TableHead className="font-semibold">Rating</TableHead>
                        <TableHead className="font-semibold">Recording</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pastClasses.map((cls) => (
                        <TableRow
                            key={cls.id}
                            className="transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/40 dark:hover:to-purple-950/40"
                        >
                            <TableCell className="font-medium text-foreground">
                            {cls.title}
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                            {cls.teacher}
                            </TableCell>

                            <TableCell>
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-sm">
                                {cls.class}
                            </Badge>
                            </TableCell>

                            <TableCell className="text-sm">
                            {cls.date}
                            </TableCell>

                            <TableCell className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {cls.duration}
                            </TableCell>

                            <TableCell>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">
                                {cls.attended}/{cls.total}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                ({Math.round(cls.attended / cls.total * 100)}%)
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                                style={{ width: `${Math.round(cls.attended / cls.total * 100)}%` }}
                                />
                            </div>
                            </TableCell>

                            <TableCell>
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                                <span className="text-sm font-semibold text-foreground">
                                {cls.rating}
                                </span>
                            </div>
                            </TableCell>

                            <TableCell>
                            {cls.recording ? (
                                <Button
                                size="sm"
                                className="h-8 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-md hover:scale-105 transition-transform"
                                >
                                <Play className="w-3 h-3 mr-1" /> Watch
                                </Button>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">
                                N/A
                                </span>
                            )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
            </TabsContent>


            <TabsContent value="settings">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-sm overflow-hidden">
                
                {/* Top Accent Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <CardHeader className="pb-4">
                <CardTitle className="text-xl font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ⚙️ Google Meet Settings
                </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Default Settings */}
                    <div className="space-y-5 p-6 rounded-xl bg-background/60 backdrop-blur-sm border shadow-sm">
                    <h3 className="font-semibold font-display text-indigo-600 dark:text-indigo-400">
                        Default Settings
                    </h3>

                    <div className="space-y-4">

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Default Duration (minutes)</Label>
                        <Input
                            type="number"
                            defaultValue="45"
                            className="focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                        </div>

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Auto-record Classes</Label>
                        <Select defaultValue="yes">
                            <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Allow Student Chat</Label>
                        <Select defaultValue="yes">
                            <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="moderated">Moderated</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                    </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="space-y-5 p-6 rounded-xl bg-background/60 backdrop-blur-sm border shadow-sm">
                    <h3 className="font-semibold font-display text-purple-600 dark:text-purple-400">
                        Notification Preferences
                    </h3>

                    <div className="space-y-4">

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Reminder Before Class (minutes)</Label>
                        <Input
                            type="number"
                            defaultValue="15"
                            className="focus-visible:ring-2 focus-visible:ring-purple-500"
                        />
                        </div>

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Send SMS to Parents</Label>
                        <Select defaultValue="yes">
                            <SelectTrigger className="focus:ring-2 focus:ring-purple-500">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                        <div className="space-y-2">
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <Select defaultValue="all">
                            <SelectTrigger className="focus:ring-2 focus:ring-purple-500">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All (Students + Parents)</SelectItem>
                            <SelectItem value="students">Students Only</SelectItem>
                            <SelectItem value="parents">Parents Only</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                    </div>
                    </div>

                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform duration-200">
                    💾 Save Settings
                    </Button>
                </div>

                </CardContent>
            </Card>
            </TabsContent>

        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default page;