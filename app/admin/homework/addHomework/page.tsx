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
    color:
      "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-700",
    iconBg:
      "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md",
  },
  {
    label: "Active Assignments",
    value: "0",
    icon: Clock,
    color:
      "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-700",
    iconBg:
      "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md",
  },
  {
    label: "Overdue",
    value: "0",
    icon: Calendar,
    color:
      "bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-700",
    iconBg:
      "bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md",
  },
  {
    label: "Today Homework",
    value: "0",
    icon: Users,
    color:
      "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-700",
    iconBg:
      "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md",
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
          color:
            "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-700",
          iconBg:
            "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md",
        },
        {
          label: "Active Assignments",
          value: String(statsData.upcomingHomework),
          icon: Clock,
          color:
            "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-700",
          iconBg:
            "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md",
        },
        {
          label: "Overdue",
          value: String(statsData.overdueHomework),
          icon: Calendar,
          color:
            "bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-700",
          iconBg:
            "bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md",
        },
        {
          label: "Today Homework",
          value: String(statsData.todayHomework),
          icon: Users,
          color:
            "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-700",
          iconBg:
            "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md",
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
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 p-5 rounded-2xl shadow-md text-white">
          <div>
            <h1 className="text-2xl font-bold">📘 Homework</h1>
            <p className="text-sm text-white/80">
              Manage and assign homework to students
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border bg-white dark:bg-gray-900"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow dark:shadow-lg ${s.color}`}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card */}
        <Card className="rounded-2xl shadow-md border bg-white dark:bg-gray-900">
          
          {/* Header */}
          <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                📋 Homework List
              </CardTitle>

              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search homework..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Class</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Teacher</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Assign Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Due Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        ⏳ Loading homework...
                      </TableCell>
                    </TableRow>
                  ) : homeworkData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        🚫 No homework records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    homeworkData.map((hw, index) => (
                      <TableRow
                        key={hw.id}
                        className={`hover:bg-indigo-50 dark:hover:bg-gray-700 transition ${
                          index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                          {hw.className}-{hw.subject}
                        </TableCell>

                        <TableCell className="max-w-[200px] truncate text-gray-800 dark:text-gray-200">
                          {hw.title}
                        </TableCell>

                        <TableCell className="text-gray-800 dark:text-gray-200">{hw.teacher}</TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">{hw.assignDate}</TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">{hw.dueDate}</TableCell>

                        {/* Status */}
                        <TableCell>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full
                            ${
                              hw.status === "Active"
                                ? "bg-blue-100 text-blue-700"
                                : hw.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {hw.status}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-indigo-100 rounded-full"
                              onClick={() => {
                                setViewHomework(hw);
                                setIsViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 text-indigo-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages}
              </div>

              <div className="flex gap-2">
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg"
                >
                  Previous
                </Button>

                <Button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Next
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[600px] p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 shadow-xl">

            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                📘 Homework Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">

              {/* Top Info Card */}
              <div className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Title</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {viewHomework?.title ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {viewHomework?.className ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {viewHomework?.subject ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Teacher</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {viewHomework?.teacher ?? "-"}
                  </p>
                </div>
              </div>

              {/* Document Section */}
              {viewHomework?.homeworkUrl && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium">
                      📎 Homework Document
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Click below to view full assignment
                    </p>
                  </div>

                  <a
                    href={viewHomework.homeworkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                </div>
              )}

              {/* Dates & Status */}
              <div className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assign Date</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {viewHomework?.assignDate ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {viewHomework?.dueDate ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Submissions</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {viewHomework?.submissions ?? 0} / {viewHomework?.total ?? 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`
                    inline-block px-3 py-1 text-xs font-semibold rounded-full
                    ${
                      viewHomework?.status === "Completed"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                        : viewHomework?.status === "Pending"
                        ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }
                  `}>
                    {viewHomework?.status ?? "-"}
                  </span>
                </div>

              </div>

            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
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