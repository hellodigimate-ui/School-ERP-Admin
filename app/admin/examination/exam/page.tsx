"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface ExamData {
id: number;
name: string;
type: string;
session: string;
description: string;
publishResult: boolean;
}

const sampleExams: ExamData[] = [
{ id: 1, name: "Unit Test 1", type: "Internal", session: "2025-26", description: "First unit test for all classes", publishResult: false },
{ id: 2, name: "Half Yearly", type: "Board", session: "2025-26", description: "Mid-term examination", publishResult: true },
{ id: 3, name: "Annual Exam", type: "Board", session: "2025-26", description: "Final annual examination", publishResult: false },
{ id: 4, name: "Unit Test 2", type: "Internal", session: "2025-26", description: "Second unit test", publishResult: false },
{ id: 5, name: "Pre-Board", type: "Board", session: "2025-26", description: "Practice exam before boards", publishResult: true },
];

const Page = () => {
    const [exams, setExams] = useState(sampleExams);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const [newExam, setNewExam] = useState({
    name: "",
    type: "Internal",
    description: "",
    });

    const filtered = exams.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!newExam.name) return;

        setExams((prev) => [
            ...prev,
            {
            ...newExam,
            id: Date.now(),
            session: "2025-26",
            publishResult: false,
            },
         ]);

        setNewExam({ name: "", type: "Internal", description: "" });
        setDialogOpen(false);
    };

    const handleDelete = (id: number) =>
    setExams((prev) => prev.filter((e) => e.id !== id));

    return (
        <AdminLayout>

            <div className="space-y-6">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    Exam Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                    Create and manage school examinations
                    </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                    <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:scale-105 transition">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exam
                    </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">

                    <DialogHeader>
                    <DialogTitle>Add New Exam</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">

                    <div>
                    <Label>Exam Name</Label>
                    <Input
                    value={newExam.name}
                    onChange={(e) =>
                    setNewExam({ ...newExam, name: e.target.value })
                    }
                    placeholder="e.g. Unit Test 1"
                    />
                    </div>

                    <div>
                    <Label>Exam Type</Label>

                    <Select
                    value={newExam.type}
                    onValueChange={(v) =>
                    setNewExam({ ...newExam, type: v })
                    }
                    >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="Board">Board</SelectItem>
                    <SelectItem value="Practical">Practical</SelectItem>
                    </SelectContent>

                    </Select>

                    </div>

                    <div>
                    <Label>Description</Label>
                    <Input
                    value={newExam.description}
                    onChange={(e) =>
                    setNewExam({ ...newExam, description: e.target.value })
                    }
                    placeholder="Brief description"
                    />
                    </div>

                    <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    onClick={handleAdd}
                    >
                    Save Exam
                    </Button>

                    </div>

                    </DialogContent>

                    </Dialog>

                </div>

                {/* TABLE CARD */}

                <div className="bg-white/80 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden">

                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        {/* SEARCH */}

                        <div className="p-4 border-b">

                        <div className="relative w-72">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                        <Input
                        className="pl-10 focus-visible:ring-indigo-400"
                        placeholder="Search exams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />

                        </div>

                        </div>

                        {/* TABLE */}

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">

                                    <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Exam Name</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Session</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Result</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">Action</th>

                                    </tr>

                                </thead>

                            <tbody>

                            {filtered.map((exam, i) => (

                            <tr
                            key={exam.id}
                            className="border-b hover:bg-indigo-50/40 transition"
                            >

                            <td className="p-3">{i + 1}</td>

                            <td className="p-3 font-medium text-foreground">
                            {exam.name}
                            </td>

                            <td className="p-3">

                            <Badge
                            className={
                            exam.type === "Board"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : exam.type === "Practical"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                            }
                            >
                            {exam.type}
                            </Badge>

                            </td>

                            <td className="p-3">{exam.session}</td>

                            <td className="p-3 text-muted-foreground">
                            {exam.description}
                            </td>

                            <td className="p-3">

                            <Badge
                            className={
                            exam.publishResult
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                            }
                            >
                            {exam.publishResult ? "Published" : "Pending"}
                            </Badge>

                            </td>

                            <td className="p-3">

                            <div className="flex gap-1">

                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 text-blue-600"
                            >
                            <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100 text-red-600"
                            onClick={() => handleDelete(exam.id)}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>

                            </div>

                            </td>

                            </tr>

                            ))}

                            </tbody>

                            </table>

                        </div>
                        
                </div>

            </div>

        </AdminLayout>
    );
};

export default Page;