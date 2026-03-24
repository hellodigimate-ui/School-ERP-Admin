"use client"


import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface GradeData {
  id: number;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  description: string;
}

const sampleGrades: GradeData[] = [
  { id: 1, grade: "A+", minPercentage: 90, maxPercentage: 100, gradePoint: 10, description: "Outstanding" },
  { id: 2, grade: "A", minPercentage: 80, maxPercentage: 89, gradePoint: 9, description: "Excellent" },
  { id: 3, grade: "B+", minPercentage: 70, maxPercentage: 79, gradePoint: 8, description: "Very Good" },
  { id: 4, grade: "B", minPercentage: 60, maxPercentage: 69, gradePoint: 7, description: "Good" },
  { id: 5, grade: "C+", minPercentage: 50, maxPercentage: 59, gradePoint: 6, description: "Above Average" },
  { id: 6, grade: "C", minPercentage: 40, maxPercentage: 49, gradePoint: 5, description: "Average" },
  { id: 7, grade: "D", minPercentage: 33, maxPercentage: 39, gradePoint: 4, description: "Below Average" },
  { id: 8, grade: "F", minPercentage: 0, maxPercentage: 32, gradePoint: 0, description: "Fail" },
];

const gradeColors: Record<string, string> = {
  "A+": "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
  "A": "bg-gradient-to-r from-teal-400 to-cyan-500 text-white",
  "B+": "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
  "B": "bg-gradient-to-r from-purple-400 to-indigo-500 text-white",
  "C+": "bg-gradient-to-r from-orange-400 to-amber-500 text-white",
  "C": "bg-gradient-to-r from-pink-400 to-rose-500 text-white",
  "D": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  "F": "bg-gradient-to-r from-red-400 to-red-600 text-white",
};

const Page = () => {
  const [grades, setGrades] = useState(sampleGrades);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (id: number) => setGrades(prev => prev.filter(g => g.id !== id));

  return (
    <AdminLayout>
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">

            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                📊 Marks Grade
                </h1>
                <p className="text-sm text-muted-foreground">
                Define grading scale and grade points
                </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                <DialogTrigger asChild>

                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grade
                </Button>

                </DialogTrigger>

                <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>Add Grade</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-3">

                    <div>
                        <Label>Grade Name</Label>
                        <Input placeholder="e.g. A+" />
                    </div>

                    <div>
                        <Label>Grade Point</Label>
                        <Input type="number" placeholder="10" />
                    </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                    <div>
                        <Label>Min Percentage</Label>
                        <Input type="number" placeholder="90" />
                    </div>

                    <div>
                        <Label>Max Percentage</Label>
                        <Input type="number" placeholder="100" />
                    </div>

                    </div>

                    <div>
                    <Label>Description</Label>
                    <Input placeholder="Outstanding" />
                    </div>

                    <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    onClick={() => setDialogOpen(false)}
                    >
                    Save Grade
                    </Button>

                </div>

                </DialogContent>

            </Dialog>

            </div>

            {/* Grade Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {grades.map((g) => (

                    <Card
                    key={g.id}
                    className="border-0 shadow-lg hover:shadow-xl transition hover:-translate-y-1"
                    >

                    <CardContent className={`p-5 rounded-xl ${gradeColors[g.grade]}`}>

                        <div className="flex items-center justify-between mb-4">

                        <span className="text-3xl font-bold">
                            {g.grade}
                        </span>

                        <Badge className="bg-white/20 text-white border-0">
                            {g.gradePoint} GP
                        </Badge>

                        </div>

                        <p className="text-sm font-semibold mb-1">
                        {g.description}
                        </p>

                        <p className="text-xs opacity-90">
                        {g.minPercentage}% - {g.maxPercentage}%
                        </p>

                        <div className="flex gap-2 mt-4">

                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white border-0"
                            onClick={() => handleDelete(g.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>

                        </div>

                    </CardContent>

                    </Card>

                ))}

            </div>

            {/* Table */}
            <Card className="border-0 shadow-lg overflow-hidden">

            {/* Gradient Top Bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                📊 Grade Scale Summary
                </CardTitle>

                <Badge className="bg-indigo-50 text-indigo-600 border-indigo-200">
                {grades.length} Grades
                </Badge>

            </CardHeader>

            <CardContent>

                <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead>

                    <tr className="bg-muted/40 text-muted-foreground">

                        <th className="text-left p-3 font-medium">Grade</th>
                        <th className="text-left p-3 font-medium">Range</th>
                        <th className="text-left p-3 font-medium">Grade Point</th>
                        <th className="text-left p-3 font-medium">Description</th>

                    </tr>

                    </thead>

                    <tbody>

                    {grades.map((g) => (

                        <tr
                        key={g.id}
                        className="border-b border-border hover:bg-muted/30 transition"
                        >

                        <td className="p-3">

                            <Badge
                            className={`text-sm px-3 py-1 font-semibold ${
                                gradeColors[g.grade] || "bg-muted"
                            }`}
                            >
                            {g.grade}
                            </Badge>

                        </td>

                        <td className="p-3 font-medium">
                            {g.minPercentage}% - {g.maxPercentage}%
                        </td>

                        <td className="p-3">

                            <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-600 border-indigo-200"
                            >
                            {g.gradePoint} GP
                            </Badge>

                        </td>

                        <td className="p-3 text-muted-foreground">
                            {g.description}
                        </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

                </div>

            </CardContent>

            </Card>
        </div>
    </AdminLayout>
  );
};

export default Page;