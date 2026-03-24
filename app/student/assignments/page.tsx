"use client"

// import { useState } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Calendar,
  BookOpen,
  Eye,
  Download,
} from "lucide-react";

const assignments = {
  pending: [
    {
      id: 1,
      title: "Database Normalization Report",
      subject: "Database Systems",
      dueDate: "2026-02-10",
      dueTime: "11:59 PM",
      maxMarks: 50,
      type: "Report",
      description: "Write a detailed report on database normalization forms (1NF to BCNF) with examples.",
    },
    {
      id: 2,
      title: "Sorting Algorithm Implementation",
      subject: "Data Structures",
      dueDate: "2026-02-12",
      dueTime: "5:00 PM",
      maxMarks: 40,
      type: "Coding",
      description: "Implement Quick Sort, Merge Sort, and Heap Sort with time complexity analysis.",
    },
    {
      id: 3,
      title: "Network Topology Design",
      subject: "Computer Networks",
      dueDate: "2026-02-15",
      dueTime: "11:59 PM",
      maxMarks: 60,
      type: "Project",
      description: "Design a network topology for a medium-sized organization with proper documentation.",
    },
  ],
  submitted: [
    {
      id: 4,
      title: "Process Scheduling Simulation",
      subject: "Operating Systems",
      submittedDate: "2026-02-03",
      dueDate: "2026-02-05",
      status: "Under Review",
      type: "Coding",
    },
    {
      id: 5,
      title: "Software Requirements Document",
      subject: "Software Engineering",
      submittedDate: "2026-02-01",
      dueDate: "2026-02-02",
      status: "Under Review",
      type: "Document",
    },
  ],
  graded: [
    {
      id: 6,
      title: "React Component Library",
      subject: "Web Technologies",
      submittedDate: "2026-01-25",
      marks: 48,
      maxMarks: 50,
      grade: "A+",
      feedback: "Excellent work! Well-structured components with proper documentation.",
      type: "Project",
    },
    {
      id: 7,
      title: "Binary Tree Operations",
      subject: "Data Structures",
      submittedDate: "2026-01-20",
      marks: 36,
      maxMarks: 40,
      grade: "A",
      feedback: "Good implementation. Minor optimization needed in deletion operation.",
      type: "Coding",
    },
    {
      id: 8,
      title: "ER Diagram Design",
      subject: "Database Systems",
      submittedDate: "2026-01-15",
      marks: 28,
      maxMarks: 30,
      grade: "A",
      feedback: "Well-designed ER diagram with proper cardinality notations.",
      type: "Assignment",
    },
  ],
};

const getDaysRemaining = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Coding": return "bg-blue-500/20 text-blue-600";
    case "Report": return "bg-purple-500/20 text-purple-600";
    case "Project": return "bg-emerald-500/20 text-emerald-600";
    case "Document": return "bg-amber-500/20 text-amber-600";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Assignments() {
//   const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

  const totalAssignments = assignments.pending.length + assignments.submitted.length + assignments.graded.length;
  const completedAssignments = assignments.submitted.length + assignments.graded.length;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Manage and submit your coursework</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">{assignments.pending.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-xl font-bold text-foreground">{assignments.submitted.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Graded</p>
                <p className="text-xl font-bold text-foreground">{assignments.graded.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Completion</p>
                <p className="text-sm font-medium">{Math.round((completedAssignments / totalAssignments) * 100)}%</p>
              </div>
              <Progress value={(completedAssignments / totalAssignments) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Assignments Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pending</span>
              <Badge variant="secondary" className="ml-1">{assignments.pending.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="submitted" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Submitted</span>
              <Badge variant="secondary" className="ml-1">{assignments.submitted.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="graded" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Graded</span>
              <Badge variant="secondary" className="ml-1">{assignments.graded.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Pending Assignments */}
          <TabsContent value="pending" className="space-y-4">
            {assignments.pending.map((assignment) => {
              const daysRemaining = getDaysRemaining(assignment.dueDate);
              const isUrgent = daysRemaining <= 3;

              return (
                <Card key={assignment.id} className={isUrgent ? "border-amber-500/50" : ""}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={getTypeColor(assignment.type)}>
                            {assignment.type}
                          </Badge>
                          {isUrgent && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()} at {assignment.dueTime}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Max Marks: </span>
                          <span className="font-medium">{assignment.maxMarks}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`text-right ${isUrgent ? "text-amber-500" : "text-muted-foreground"}`}>
                          <p className="text-2xl font-bold">{daysRemaining}</p>
                          <p className="text-xs">days left</p>
                        </div>
                        <Button className="w-full md:w-auto">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Submitted Assignments */}
          <TabsContent value="submitted" className="space-y-4">
            {assignments.submitted.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTypeColor(assignment.type)}>
                          {assignment.type}
                        </Badge>
                        <Badge variant="secondary">{assignment.status}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {assignment.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Graded Assignments */}
          <TabsContent value="graded" className="space-y-4">
            {assignments.graded.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={getTypeColor(assignment.type)}>
                          {assignment.type}
                        </Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                          {assignment.grade}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {assignment.subject}
                        </span>
                        <span>
                          Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Feedback: </span>
                          {assignment.feedback}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-500">
                          {assignment.marks}/{assignment.maxMarks}
                        </p>
                        <p className="text-xs text-muted-foreground">marks obtained</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}
