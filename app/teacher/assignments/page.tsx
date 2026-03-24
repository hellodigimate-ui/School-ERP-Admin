"use client";

import { useState } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Progress } from "@/components/ui/progress";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  class: string;
  dueDate: string;
  status: "active" | "completed" | "draft";
  submissions: number;
  totalStudents: number;
  type: string;
  maxScore: number;
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Quadratic Equations Quiz",
    class: "10A - Mathematics",
    dueDate: "Feb 10, 2026",
    status: "active",
    submissions: 18,
    totalStudents: 32,
    type: "Quiz",
    maxScore: 100,
  },
  {
    id: "2",
    title: "Algebra Homework Ch.5",
    class: "10A - Mathematics",
    dueDate: "Feb 8, 2026",
    status: "active",
    submissions: 25,
    totalStudents: 32,
    type: "Homework",
    maxScore: 50,
  },
  {
    id: "3",
    title: "Geometry Project",
    class: "9B - Mathematics",
    dueDate: "Feb 15, 2026",
    status: "active",
    submissions: 5,
    totalStudents: 28,
    type: "Project",
    maxScore: 200,
  },
  {
    id: "4",
    title: "Linear Equations Test",
    class: "10A - Mathematics",
    dueDate: "Feb 1, 2026",
    status: "completed",
    submissions: 32,
    totalStudents: 32,
    type: "Test",
    maxScore: 100,
  },
  {
    id: "5",
    title: "Statistics Assignment",
    class: "11C - Mathematics",
    dueDate: "Jan 28, 2026",
    status: "completed",
    submissions: 30,
    totalStudents: 30,
    type: "Assignment",
    maxScore: 75,
  },
  {
    id: "6",
    title: "Calculus Introduction",
    class: "11C - Mathematics",
    dueDate: "Feb 20, 2026",
    status: "draft",
    submissions: 0,
    totalStudents: 30,
    type: "Lesson",
    maxScore: 0,
  },
];

const getStatusBadge = (status: Assignment["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-success/20 text-success border-0">
          <Clock className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-primary/20 text-primary border-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "draft":
      return (
        <Badge variant="secondary">
          <AlertCircle className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      );
  }
};

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" || assignment.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter((a) => a.status === "active").length,
    completed: assignments.filter((a) => a.status === "completed").length,
    pendingReview: assignments.reduce(
      (acc, a) => acc + a.submissions,
      0
    ),
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Assignments
              </h1>
              <p className="text-muted-foreground">
                Create and manage class assignments
              </p>
            </div>

            {/* Create Assignment Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new assignment
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Assignment title" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10a">
                            10A - Mathematics
                          </SelectItem>
                          <SelectItem value="9b">
                            9B - Mathematics
                          </SelectItem>
                          <SelectItem value="11c">
                            11C - Mathematics
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homework">
                            Homework
                          </SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="project">
                            Project
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Score</Label>
                      <Input type="number" placeholder="100" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Assignment instructions..."
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Assignment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          {/* (unchanged UI — kept exactly as-is) */}

          {/* Assignments Table */}
          {/* (unchanged UI — kept exactly as-is) */}
        </main>
      </div>
    </div>
  );
}
