/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
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
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface HomeworkItem {
  id: string;
  title: string;
  category: string | null;
  type: string;
  dueDate: string;
  homeworkUrl: string[];
  teacher?: {
    id: string;
    name: string;
  };
  section?: {
    id: string;
    name: string;
    class?: {
      id: string;
      name: string;
    };
  };
}

const getDaysRemaining = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Coding":
      return "bg-blue-500/20 text-blue-600";
    case "Report":
      return "bg-purple-500/20 text-purple-600";
    case "Project":
      return "bg-emerald-500/20 text-emerald-600";
    case "Document":
      return "bg-amber-500/20 text-amber-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Assignments() {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState<
    "all" | "upcoming" | "overdue"
  >("all");

  const upcomingHomework = homework.filter(
    (item) => new Date(item.dueDate) >= new Date(),
  );
  const overdueHomework = homework.filter(
    (item) => new Date(item.dueDate) < new Date(),
  );
  const currentHomework =
    selectedTab === "upcoming"
      ? upcomingHomework
      : selectedTab === "overdue"
        ? overdueHomework
        : homework;

  const completionPercentage = homework.length
    ? Math.round(
        ((homework.length - overdueHomework.length) / homework.length) * 100,
      )
    : 0;

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/homework/student", {
        params: { page, perPage },
      });
      setHomework(res.data?.data || []);
      setTotalItems(res.data?.pagination?.totalItems || 0);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load homework", error);
      setHomework([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, [page]);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">
            Manage and submit your coursework
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loaded</p>
                <p className="text-xl font-bold text-foreground">
                  {homework.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
                <p className="text-xl font-bold text-foreground">
                  {upcomingHomework.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-xl font-bold text-foreground">
                  {overdueHomework.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Completion</p>
                <p className="text-sm font-medium">{completionPercentage}%</p>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as "all" | "upcoming" | "overdue")}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
              <Badge variant="secondary" className="ml-1">
                {homework.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Upcoming</span>
              <Badge variant="secondary" className="ml-1">
                {upcomingHomework.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Overdue</span>
              <Badge variant="secondary" className="ml-1">
                {overdueHomework.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading homework...
              </div>
            ) : currentHomework.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No homework assigned.
              </div>
            ) : (
              currentHomework.map((assignment) => {
                const due = new Date(assignment.dueDate);
                const daysRemaining = getDaysRemaining(assignment.dueDate);
                const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;
                return (
                  <Card
                    key={assignment.id}
                    className={isUrgent ? "border-amber-500/50" : ""}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getTypeColor(assignment.type)}
                            >
                              {assignment.type}
                            </Badge>
                            {assignment.category && (
                              <Badge variant="secondary">
                                {assignment.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground">
                            {assignment.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {assignment.teacher?.name && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {assignment.teacher.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {due.toLocaleDateString()}
                            </span>
                            {assignment.section?.class?.name && (
                              <span className="text-sm text-muted-foreground">
                                {assignment.section.class.name} /{" "}
                                {assignment.section.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div
                            className={`text-right ${isUrgent ? "text-amber-500" : "text-muted-foreground"}`}
                          >
                            <p className="text-2xl font-bold">
                              {daysRemaining}
                            </p>
                            <p className="text-xs">days left</p>
                          </div>
                          {/* <Button className="w-full md:w-auto">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading homework...
              </div>
            ) : upcomingHomework.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No upcoming homework.
              </div>
            ) : (
              upcomingHomework.map((assignment) => {
                const due = new Date(assignment.dueDate);
                const daysRemaining = getDaysRemaining(assignment.dueDate);
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getTypeColor(assignment.type)}
                            >
                              {assignment.type}
                            </Badge>
                            {assignment.category && (
                              <Badge variant="secondary">
                                {assignment.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground">
                            {assignment.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {assignment.teacher?.name && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {assignment.teacher.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {due.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right text-muted-foreground">
                            <p className="text-2xl font-bold">
                              {daysRemaining}
                            </p>
                            <p className="text-xs">days left</p>
                          </div>
                          {/* <Button className="w-full md:w-auto">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading homework...
              </div>
            ) : overdueHomework.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No overdue homework.
              </div>
            ) : (
              overdueHomework.map((assignment) => {
                const due = new Date(assignment.dueDate);
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getTypeColor(assignment.type)}
                            >
                              {assignment.type}
                            </Badge>
                            {assignment.category && (
                              <Badge variant="secondary">
                                {assignment.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground">
                            {assignment.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {assignment.teacher?.name && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {assignment.teacher.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {due.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right text-red-500">
                            <p className="text-2xl font-bold">Overdue</p>
                            <p className="text-xs">Due date passed</p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
