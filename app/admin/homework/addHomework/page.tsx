"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Calendar, Clock, Users } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const homeworkData = [
  { id: 1, class: "Class 10-A", subject: "Mathematics", teacher: "Mr. Rajesh Kumar", title: "Quadratic Equations Practice", assignDate: "2025-02-10", dueDate: "2025-02-14", status: "Active", submissions: 32, total: 40 },
  { id: 2, class: "Class 9-B", subject: "Science", teacher: "Mrs. Priya Sharma", title: "Chemical Reactions Lab Report", assignDate: "2025-02-11", dueDate: "2025-02-15", status: "Active", submissions: 18, total: 38 },
  { id: 3, class: "Class 8-A", subject: "English", teacher: "Ms. Anita Verma", title: "Essay on Environmental Awareness", assignDate: "2025-02-08", dueDate: "2025-02-12", status: "Completed", submissions: 35, total: 36 },
  { id: 4, class: "Class 7-C", subject: "Hindi", teacher: "Mr. Deepak Singh", title: "Grammar Worksheet - Tenses", assignDate: "2025-02-09", dueDate: "2025-02-13", status: "Overdue", submissions: 20, total: 34 },
  { id: 5, class: "Class 10-B", subject: "Physics", teacher: "Dr. Suresh Patel", title: "Newton's Laws Numerical Problems", assignDate: "2025-02-12", dueDate: "2025-02-16", status: "Active", submissions: 10, total: 42 },
];

const stats = [
  { label: "Total Homework", value: "156", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  { label: "Active Assignments", value: "42", icon: Clock, color: "bg-green-500/10 text-green-600" },
  { label: "Overdue", value: "8", icon: Calendar, color: "bg-red-500/10 text-red-600" },
  { label: "Avg Submission Rate", value: "87%", icon: Users, color: "bg-purple-500/10 text-purple-600" },
];

const Page = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-foreground">Homework</h1>
            <p className="text-muted-foreground text-sm">Manage and assign homework to students</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Homework
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map(s => (
            <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {showForm && (
            <Card>
            <CardHeader><CardTitle className="text-lg">Add New Homework</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Class</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Select Class</option>
                    <option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Section</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Select Section</option>
                    <option>A</option><option>B</option><option>C</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Select Subject</option>
                    <option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Physics</option>
                    </select>
                </div>
                <div className="space-y-1.5 md:col-span-3">
                    <label className="text-sm font-medium text-foreground">Homework Title</label>
                    <Input placeholder="Enter homework title" />
                </div>
                <div className="space-y-1.5 md:col-span-3">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground" placeholder="Enter homework description..." />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Assign Date</label>
                    <Input type="date" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Due Date</label>
                    <Input type="date" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Attach Document</label>
                    <Input type="file" />
                </div>
                </div>
                <div className="flex gap-2 mt-4">
                <Button>Save Homework</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
            </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Homework List</CardTitle>
                <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search homework..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Assign Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {homeworkData.filter(h => h.title.toLowerCase().includes(search.toLowerCase()) || h.class.toLowerCase().includes(search.toLowerCase())).map(hw => (
                    <TableRow key={hw.id}>
                    <TableCell className="font-medium">{hw.class}</TableCell>
                    <TableCell>{hw.subject}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{hw.title}</TableCell>
                    <TableCell>{hw.teacher}</TableCell>
                    <TableCell>{hw.assignDate}</TableCell>
                    <TableCell>{hw.dueDate}</TableCell>
                    <TableCell>
                        <span className="text-sm">{hw.submissions}/{hw.total}</span>
                    </TableCell>
                    <TableCell>
                        <Badge variant={hw.status === "Active" ? "default" : hw.status === "Completed" ? "secondary" : "destructive"}>
                        {hw.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
    </AdminLayout>
  );
};

export default Page;