/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  BookOpen,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

type HomeworkItem = {
  id: number;
  className: string;
  subject: string;
  teacher: string;
  title: string;
  assignDate: string;
  dueDate: string;
  status: string;
  submissions: number;
  total: number;
  homeworkUrl?: string;
};

type HomeworkStats = {
  totalHomework: number;
  todayHomework: number;
  upcomingHomework: number;
  overdueHomework: number;
};

const defaultStats = [
  {
    label: "Total Homework",
    value: "0",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Active Assignments",
    value: "0",
    icon: Clock,
    color: "bg-green-500/10 text-green-600",
  },
  {
    label: "Overdue",
    value: "0",
    icon: Calendar,
    color: "bg-red-500/10 text-red-600",
  },
  {
    label: "Today Homework",
    value: "0",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600",
  },
];

const Page = () => {
  const [search, setSearch] = useState("");
//   const [showForm, setShowForm] = useState(false);
  const [homeworkData, setHomeworkData] = useState<HomeworkItem[]>([]);
  const [stats, setStats] = useState(defaultStats);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewHomework, setViewHomework] = useState<HomeworkItem | null>(null);

  const transformHomework = (item: any): HomeworkItem => ({
    id: item.id,
    className: item.section?.class?.name ?? item.class ?? "Unknown",
    subject: item.section?.name ?? item.subject ?? "Unknown",
    teacher: item.teacher?.name ?? item.teacher ?? "Unknown",
    title: item.title ?? "Untitled",
    assignDate: item.assignDate
      ? item.assignDate.split("T")[0]
      : item.createdAt
        ? item.createdAt.split("T")[0]
        : "-",
    dueDate: item.dueDate ? item.dueDate.split("T")[0] : "-",
    status:
      item.status ??
      (new Date(item.dueDate) < new Date() ? "Overdue" : "Active"),
    submissions: item.submissions ?? 0,
    total: item.total ?? 0,
    homeworkUrl: item.homeworkUrl ?? item.homework_url ?? "",
  });

  const loadHomework = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search || "",
      }).toString();

      const response = await axiosInstance.get(`/api/v1/homework?${query}`);
      if (!response || response.status !== 200) {
        throw new Error(
          `Failed to fetch homework (${response?.status ?? "unknown"})`,
        );
      }

      const payload = response.data;
      const fetchedHomework = (payload.data || []).map((hw: any) =>
        transformHomework(hw),
      );
      setHomeworkData(fetchedHomework);
      setTotalPages(payload.pagination?.totalPages ?? 1);
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/homework/stats");
      if (!response || response.status !== 200) {
        throw new Error("Failed to fetch homework stats");
      }
      const payload = response.data;
      const statsData: HomeworkStats = payload.data;
      setStats([
        {
          label: "Total Homework",
          value: String(statsData.totalHomework),
          icon: BookOpen,
          color: "bg-blue-500/10 text-blue-600",
        },
        {
          label: "Active Assignments",
          value: String(statsData.upcomingHomework),
          icon: Clock,
          color: "bg-green-500/10 text-green-600",
        },
        {
          label: "Overdue",
          value: String(statsData.overdueHomework),
          icon: Calendar,
          color: "bg-red-500/10 text-red-600",
        },
        {
          label: "Today Homework",
          value: String(statsData.todayHomework),
          icon: Users,
          color: "bg-purple-500/10 text-purple-600",
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadHomework();
  }, [page, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Homework</h1>
            <p className="text-muted-foreground text-sm">
              Manage and assign homework to students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Homework List</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search homework..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Assign Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Loading homework...
                    </TableCell>
                  </TableRow>
                ) : homeworkData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No homework records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  homeworkData.map((hw) => (
                    <TableRow key={hw.id}>
                      <TableCell className="font-medium">
                        {hw.className}-{hw.subject}
                      </TableCell>

                      <TableCell className="max-w-[200px] truncate">
                        {hw.title}
                      </TableCell>
                      <TableCell>{hw.teacher}</TableCell>
                      <TableCell>{hw.assignDate}</TableCell>
                      <TableCell>{hw.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            hw.status === "Active"
                              ? "default"
                              : hw.status === "Completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {hw.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setViewHomework(hw);
                              setIsViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Homework Details</DialogTitle>
            </DialogHeader>

            <div className="divide-y divide-muted-foreground/20 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Title</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.title ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.className ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.subject ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Teacher</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.teacher ?? "-"}
                  </p>
                </div>
              </div>

              {viewHomework?.homeworkUrl && (
                <div className="rounded-lg border border-muted-foreground/30 bg-muted-foreground/5 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Document Link
                  </p>
                  <a
                    href={viewHomework.homeworkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    View full homework document
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Assign Date</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.assignDate ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.dueDate ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submissions</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.submissions ?? 0} /{" "}
                    {viewHomework?.total ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground">
                    {viewHomework?.status ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Page;