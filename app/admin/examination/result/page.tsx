"use client";

import { useState } from "react";
import { Search, Download, Eye, Printer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface ResultData {
    id: number;
    student: string;
    rollNo: string;
    class: string;
    totalMarks: number;
    obtained: number;
    percentage: number;
    grade: string;
    rank: number;
    status: "Pass" | "Fail";
}

const sampleResults: ResultData[] = [
    { id: 1, student: "Aarav Sharma", rollNo: "101", class: "Class 10-A", totalMarks: 500, obtained: 462, percentage: 92.4, grade: "A+", rank: 1, status: "Pass" },
    { id: 2, student: "Priya Patel", rollNo: "102", class: "Class 10-A", totalMarks: 500, obtained: 445, percentage: 89.0, grade: "A+", rank: 2, status: "Pass" },
    { id: 3, student: "Rahul Kumar", rollNo: "103", class: "Class 10-A", totalMarks: 500, obtained: 398, percentage: 79.6, grade: "A", rank: 3, status: "Pass" },
    { id: 4, student: "Sneha Gupta", rollNo: "104", class: "Class 10-A", totalMarks: 500, obtained: 356, percentage: 71.2, grade: "B+", rank: 4, status: "Pass" },
    { id: 5, student: "Arjun Singh", rollNo: "105", class: "Class 10-A", totalMarks: 500, obtained: 142, percentage: 28.4, grade: "F", rank: 5, status: "Fail" },
];

const Page = () => {

    const [results] = useState(sampleResults);
    const [search, setSearch] = useState("");

    const filtered = results.filter(
        (r) =>
        r.student.toLowerCase().includes(search.toLowerCase()) ||
        r.rollNo.includes(search)
    );

    const passCount = results.filter((r) => r.status === "Pass").length;

    const avgPercentage = (
        results.reduce((a, r) => a + r.percentage, 0) / results.length
    ).toFixed(1);

    return (
        <AdminLayout>

            <div className="space-y-6">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-indigo-500" />
                            Exam Results
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View and manage student examination results
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Button
                        variant="outline"
                        className="hover:bg-secondary/40"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>

                        <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>

                    </div>

                </div>

                {/* STATS CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

                    <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                        <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{results.length}</p>
                        <p className="text-xs opacity-90">Total Students</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">{passCount}</p>
                            <p className="text-xs opacity-90">Passed</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">{results.length - passCount}</p>
                            <p className="text-xs opacity-90">Failed</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">{avgPercentage}%</p>
                            <p className="text-xs opacity-90">Average</p>
                        </CardContent>
                    </Card>

                </div>

                {/* FILTERS */}

                <div className="flex gap-3 flex-wrap">

                    <Select defaultValue="half">
                    <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select exam" />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="half">Half Yearly</SelectItem>
                    <SelectItem value="annual">Annual Exam</SelectItem>
                    </SelectContent>
                    </Select>

                    <Select defaultValue="10a">
                    <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select class" />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="10a">Class 10-A</SelectItem>
                    <SelectItem value="9a">Class 9-A</SelectItem>
                    </SelectContent>
                    </Select>

                    <div className="relative flex-1 min-w-[200px]">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                        <Input
                        className="pl-10 focus-visible:ring-indigo-400"
                        placeholder="Search by name or roll no..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                </div>

                {/* RESULTS TABLE */}

                <div className="bg-card/80 backdrop-blur-md rounded-xl border border-border shadow-lg overflow-x-auto">

                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="bg-secondary/50 dark:bg-secondary/30 border-b border-border">

                                    <th className="text-left p-3">Rank</th>
                                    <th className="text-left p-3">Student</th>
                                    <th className="text-left p-3">Roll No</th>
                                    <th className="text-left p-3">Total</th>
                                    <th className="text-left p-3">Obtained</th>
                                    <th className="text-left p-3">Percentage</th>
                                    <th className="text-left p-3">Grade</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-left p-3">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filtered.map((r) => (

                                    <tr
                                    key={r.id}
                                    className="border-b hover:bg-indigo-50/40 transition"
                                    >

                                        <td className="p-3 font-bold text-indigo-600">
                                        #{r.rank}
                                        </td>

                                        <td className="p-3 font-medium">
                                        {r.student}
                                        </td>

                                        <td className="p-3">
                                        {r.rollNo}
                                        </td>

                                        <td className="p-3">
                                        {r.totalMarks}
                                        </td>

                                        <td className="p-3 font-semibold">
                                        {r.obtained}
                                        </td>

                                        <td className="p-3">

                                            <div className="flex items-center gap-2">

                                                <Progress
                                                value={r.percentage}
                                                className="w-20 h-2"
                                                />

                                                <span className="font-medium text-indigo-600">
                                                    {r.percentage}%
                                                </span>

                                            </div>

                                        </td>

                                        <td className="p-3">

                                            <Badge
                                            className={
                                            r.grade === "F"
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            }
                                            >
                                            {r.grade}
                                            </Badge>

                                        </td>

                                        <td className="p-3">

                                            <Badge
                                            className={
                                            r.status === "Pass"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                            }
                                            >
                                            {r.status}
                                            </Badge>

                                        </td>

                                        <td className="p-3">

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-indigo-100 text-indigo-600"
                                            >
                                            <Eye className="h-4 w-4" />
                                            </Button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </div>
                </div>

        </AdminLayout>
    );
};

export default Page;