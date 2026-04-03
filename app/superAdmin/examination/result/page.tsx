/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
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
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

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

const Page = () => {
  const [results, setResults] = useState<ResultData[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingResults, setLoadingResults] = useState(false);

  const [branch, setBranch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [section, setSection] = useState("");
  const [exam, setExam] = useState("");

  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [exams, setExams] = useState<{ id: string; name: string }[]>([]);

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    branch: "",
    class: "",
    section: "",
    exam: "",
    studentId: "",
    rollNo: "",
  });

  const [modalSections, setModalSections] = useState<
    { id: string; name: string }[]
  >([]);

  const [subjects, setSubjects] = useState<
    { subject: string; total: string; obtained: string }[]
  >([]);

  const [students, setStudents] = useState<
    { id: string; name: string; rollNo: string }[]
  >([]);
  const [examSchedules, setExamSchedules] = useState<
    {
      id: string;
      subject: string;
    }[]
  >([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [resultStats, setResultStats] = useState({
    totalResults: 0,
    passCount: 0,
    failCount: 0,
    averagePercentage: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);

  const fetchStudents = async (
    sectionId: string,
    classId: string,
    search = "",
  ) => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/students?section=${sectionId}&class=${classId}&name=${encodeURIComponent(
          search,
        )}&perPage=100`,
      );
      if (res.data.success) {
        const payload = res.data.data;
        setStudents(
          Array.isArray(payload) ? payload : payload?.students || payload || [],
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totals = useMemo(() => {
    let totalMarks = 0;
    let obtainedMarks = 0;

    subjects.forEach((s) => {
      totalMarks += Number(s.total || 0);
      obtainedMarks += Number(s.obtained || 0);
    });

    const percentage = totalMarks
      ? ((obtainedMarks / totalMarks) * 100).toFixed(2)
      : 0;

    return { totalMarks, obtainedMarks, percentage };
  }, [subjects]);

  const resetForm = () => {
    setForm({
      branch: "",
      class: "",
      section: "",
      exam: "",
      studentId: "",
      rollNo: "",
    });
    setModalSections([]);
    setStudents([]);
    setExamSchedules([]);
    setSubjects([]);
    setIsEditing(false);
    setEditingResultId(null);
    setSelectedResult(null);
  };

  const handleSubmit = async () => {
    try {
      if (!form.exam || !form.studentId || subjects.length === 0) {
        return;
      }

      const payload = {
        examId: form.exam,
        studentId: form.studentId,
        subjects,
        totalMarks: totals.totalMarks,
        obtainedMarks: totals.obtainedMarks,
        percentage: totals.percentage,
      };

      const res =
        isEditing && editingResultId
          ? await axiosInstance.put(
              `/api/v1/results/${editingResultId}`,
              payload,
            )
          : await axiosInstance.post("/api/v1/results", payload);

      if (res.data.success) {
        setOpenModal(false);
        resetForm();
        fetchResults(exam || form.exam, search, currentPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch branches and overall result stats on mount
  useEffect(() => {
    fetchBranches();
    fetchResultStats();
  }, []);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      console.log("Branches response:", res.data);
      setBranches(res.data.data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
    setLoadingBranches(false);
  };

  const fetchClasses = async (branchId: string) => {
    setLoadingClasses(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/classes?branchId=${branchId}&perPage=100`,
      );
      if (res.data.success) {
        setClasses(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    setLoadingClasses(false);
  };

  const fetchSections = async (classId: string) => {
    setLoadingSections(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/sections?classId=${classId}&perPage=100`,
      );
      if (res.data.success) {
        setSections(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
    setLoadingSections(false);
  };

  const fetchExams = async (classId: string) => {
    if (!classId) {
      setExams([]);
      return;
    }

    setLoadingExams(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/exams?classId=${classId}&perPage=100`,
      );
      if (res.data.success) {
        setExams(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
    setLoadingExams(false);
  };

  const fetchModalSections = async (classId: string) => {
    if (!classId) {
      setModalSections([]);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/api/v1/sections?classId=${classId}&perPage=100`,
      );
      if (res.data.success) {
        setModalSections(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching modal sections:", error);
    }
  };

  const fetchResults = async (
    examId: string,
    searchTerm: string = "",
    page: number = 1,
  ) => {
    setLoadingResults(true);
    try {
      const res = await axiosInstance.get(
        `/api/v1/results?examId=${examId}&search=${encodeURIComponent(
          searchTerm,
        )}&page=${page}&perPage=10`,
      );
      if (res.data.success) {
        const responseData = res.data.data;
        const resultsPayload = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];

        setResults(resultsPayload);
        setTotalPages(
          res.data.pagination?.totalPages ||
            responseData?.pagination?.totalPages ||
            1,
        );
        setTotalResults(
          res.data.pagination?.totalRecords ||
            responseData?.pagination?.totalRecords ||
            0,
        );
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
    }

    await fetchResultStats(examId || "");
    setLoadingResults(false);
  };

  const fetchResultStats = async (examId?: string) => {
    setStatsLoading(true);
    try {
      const url = examId
        ? `/api/v1/results/stats?examId=${examId}`
        : "/api/v1/results/stats";
      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setResultStats(
          res.data.data || {
            totalResults: 0,
            passCount: 0,
            failCount: 0,
            averagePercentage: 0,
          },
        );
      }
    } catch (error) {
      console.error("Error fetching result stats:", error);
      setResultStats({
        totalResults: 0,
        passCount: 0,
        failCount: 0,
        averagePercentage: 0,
      });
    }
    setStatsLoading(false);
  };

  const fetchExamDetails = async (examId: string) => {
    if (!examId) {
      setExamSchedules([]);
      setSubjects([]);
      return;
    }

    try {
      const res = await axiosInstance.get(`/api/v1/exams/${examId}`);
      if (res.data.success && res.data.data) {
        const schedules = res.data.data.schedules || [];
        setExamSchedules(schedules);
        setSubjects(
          schedules.length > 0
            ? schedules.map((schedule: any) => ({
                subject: schedule.subject || "",
                total: "",
                obtained: "",
              }))
            : [],
        );
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
      setExamSchedules([]);
      setSubjects([{ subject: "", total: "", obtained: "" }]);
    }
  };

  const handleViewResult = async (resultId: string | number) => {
    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const res = await axiosInstance.get(`/api/v1/results/${resultId}`);
      if (res.data.success) {
        setSelectedResult(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching result details:", error);
      setSelectedResult(null);
    }
    setViewLoading(false);
  };

  const handleDeleteResult = async (resultId: number) => {
    if (!window.confirm("Are you sure you want to delete this result?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/v1/results/${resultId}`);
      fetchResults(exam, search, currentPage);
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  const handleEditResult = async (resultId: string | number) => {
    setViewLoading(true);

    try {
      const res = await axiosInstance.get(`/api/v1/results/${resultId}`);
      if (res.data.success) {
        const result = res.data.data;
        const branchId = result.exam?.branchId || "";
        const classId =
          result.student?.classId || result.student?.section?.class?.id || "";
        const sectionId = result.student?.section?.id || "";
        const studentId = result.student?.id || "";

        setForm({
          branch: branchId,
          class: classId,
          section: sectionId,
          exam: result.exam?.id || "",
          studentId,
          rollNo: result.student?.rollNumber || "",
        });

        if (branchId) {
          await fetchClasses(branchId);
        }
        if (classId) {
          await fetchModalSections(classId);
        }
        if (sectionId && classId) {
          await fetchStudents(sectionId, classId);
        }

        setStudents(
          result.student
            ? [
                {
                  id: result.student.id,
                  name: result.student.name,
                  rollNo: result.student.rollNumber,
                },
              ]
            : [],
        );

        setSubjects(
          Array.isArray(result.items)
            ? result.items.map((item: any) => ({
                subject: item.subject || "",
                total: String(item.totalMarks || ""),
                obtained: String(item.obtainedMarks || ""),
              }))
            : [],
        );

        setIsEditing(true);
        setEditingResultId(String(resultId));
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error fetching result for edit:", error);
    }

    setViewLoading(false);
  };

  // Handle branch change

  const handleBranchChange = (val: string) => {
    setBranch(val);
    setSelectedClass("");
    setSection("");
    setExam("");
    setClasses([]);
    setSections([]);
    setExams([]);
    setResults([]);
    if (val) fetchClasses(val);
  };

  // Handle class change
  const handleClassChange = (val: string) => {
    setSelectedClass(val);
    setSection("");
    setExam("");
    setSections([]);
    setExams([]);
    setResults([]);
    if (val) fetchSections(val);
  };

  // Handle section change
  const handleSectionChange = (val: string) => {
    setSection(val);
    setExam("");
    setExams([]);
    setResults([]);
    if (val && selectedClass) fetchExams(selectedClass);
  };

  // Handle exam change
  const handleExamChange = (val: string) => {
    setExam(val);
    setResults([]);
    setCurrentPage(1);
    if (val) {
      fetchResults(val, search, 1);
    } else {
      fetchResultStats("");
    }
  };

  // Handle search change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (exam) {
      setCurrentPage(1);
      fetchResults(exam, val, 1);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (exam) {
      fetchResults(exam, search, page);
    }
  };

  const passCount = resultStats.passCount;
  const avgPercentage = resultStats.averagePercentage.toFixed(1);

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
            {/* <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}

            <Button
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : resultStats.totalResults}
              </p>
              <p className="text-xs opacity-90">Total Students</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : resultStats.passCount}
              </p>
              <p className="text-xs opacity-90">Passed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : resultStats.failCount}
              </p>
              <p className="text-xs opacity-90">Failed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : `${resultStats.averagePercentage}%`}
              </p>
              <p className="text-xs opacity-90">Average</p>
            </CardContent>
          </Card>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-3 items-center">
          {/* Branch */}
          <Select
            value={branch}
            onValueChange={handleBranchChange}
            disabled={loadingBranches}
          >
            <SelectTrigger className="w-[150px] bg-background/70 border-border/50">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Class */}
          <Select
            value={selectedClass}
            onValueChange={handleClassChange}
            disabled={!branch || loadingClasses}
          >
            <SelectTrigger className="w-[150px] bg-background/70 border-border/50 disabled:opacity-50">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Section */}
          <Select
            value={section}
            onValueChange={handleSectionChange}
            disabled={!selectedClass || loadingSections}
          >
            <SelectTrigger className="w-[150px] bg-background/70 border-border/50 disabled:opacity-50">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Exam */}
          <Select
            value={exam}
            onValueChange={handleExamChange}
            disabled={!section || loadingExams}
          >
            <SelectTrigger className="w-[160px] bg-background/70 border-border/50 disabled:opacity-50">
              <SelectValue placeholder="Exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10 bg-background/70 border-border/50 focus-visible:ring-primary/40"
              placeholder="Search by name or roll no..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={!exam}
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
              {loadingResults ? (
                <tr>
                  <td colSpan={9} className="p-3 text-center">
                    Loading...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-3 text-center">
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-indigo-50/40 transition"
                  >
                    <td className="p-3 font-bold text-indigo-600">#{r.rank}</td>

                    <td className="p-3 font-medium">{r.student}</td>

                    <td className="p-3">{r.rollNo}</td>

                    <td className="p-3">{r.totalMarks}</td>

                    <td className="p-3 font-semibold">{r.obtained}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={r.percentage} className="w-20 h-2" />

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
                        onClick={() => handleViewResult(r.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-indigo-100 text-indigo-600"
                        onClick={() => handleEditResult(r.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-indigo-100 text-indigo-600"
                        onClick={() => handleDeleteResult(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {exam && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {results.length} of {totalResults} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingResults}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loadingResults}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-background w-full max-w-4xl p-6 rounded-xl overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isEditing ? "Edit Result" : "Add Result"}
                </h2>
                <button
                  onClick={() => {
                    setOpenModal(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {/* Branch */}
                <Select
                  value={form.branch}
                  onValueChange={(val) => {
                    setForm({
                      ...form,
                      branch: val,
                      class: "",
                      exam: "",
                      studentId: "",
                      rollNo: "",
                    });
                    setExams([]);
                    setStudents([]);
                    setExamSchedules([]);
                    setSubjects([{ subject: "", total: "", obtained: "" }]);
                    fetchClasses(val);
                  }}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Class */}
                <Select
                  value={form.class}
                  onValueChange={(val) => {
                    setForm({
                      ...form,
                      class: val,
                      section: "",
                      exam: "",
                      studentId: "",
                      rollNo: "",
                    });
                    setExamSchedules([]);
                    setSubjects([]);
                    setModalSections([]);
                    setStudents([]);
                    fetchExams(val);
                    fetchModalSections(val);
                  }}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Section */}
                <Select
                  value={form.section}
                  onValueChange={(val) => {
                    setForm({
                      ...form,
                      section: val,
                      exam: "",
                      studentId: "",
                      rollNo: "",
                    });
                    setExamSchedules([]);
                    setSubjects([]);
                    setStudents([]);
                    fetchStudents(val, form.class);
                  }}
                  disabled={!form.class || isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalSections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Exam */}
                <Select
                  value={form.exam}
                  onValueChange={(val) => {
                    setForm({ ...form, exam: val });
                    if (!isEditing) {
                      fetchExamDetails(val);
                    }
                  }}
                  disabled={!form.section || loadingExams || isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={form.studentId}
                onValueChange={(val) => {
                  const student = students.find((s) => s.id === val);
                  setForm({
                    ...form,
                    studentId: val,
                    rollNo: student?.rollNo || "",
                  });
                }}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subjects Grid */}
              {subjects.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {subjects.map((s, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <Input placeholder="Subject" value={s.subject} readOnly />
                      <Input
                        type="number"
                        placeholder="Total Marks"
                        value={s.total}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[i].total = e.target.value;
                          setSubjects(updated);
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Obtained"
                        value={s.obtained}
                        onChange={(e) => {
                          const updated = [...subjects];
                          updated[i].obtained = e.target.value;
                          setSubjects(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 text-sm text-slate-600">
                  Select an exam to load subjects.
                </div>
              )}

              {/* Totals */}
              <div className="mt-4 border-t pt-3 text-sm space-y-1">
                <p>Total Subjects: {subjects.length}</p>
                <p>Total Marks: {totals.totalMarks}</p>
                <p>Obtained Marks: {totals.obtainedMarks}</p>
                <p className="font-semibold text-indigo-600">
                  Percentage: {totals.percentage}%
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {isEditing ? "Update Result" : "Save Result"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-background w-full max-w-3xl p-6 rounded-xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">View Result</h2>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedResult(null);
                  }}
                >
                  ✕
                </button>
              </div>

              {viewLoading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : selectedResult ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Student</p>
                      <p className="text-base font-medium">
                        {selectedResult.student?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Roll No</p>
                      <p className="text-base font-medium">
                        {selectedResult.student?.rollNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Exam</p>
                      <p className="text-base font-medium">
                        {selectedResult.exam?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Class</p>
                      <p className="text-base font-medium">
                        {selectedResult.student?.section?.class?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Section</p>
                      <p className="text-base font-medium">
                        {selectedResult.student?.section?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        className={
                          selectedResult.status === "Pass"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {selectedResult.status || "-"}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-secondary/50 dark:bg-secondary/30 border-b border-border">
                          <th className="text-left p-3">Subject</th>
                          <th className="text-left p-3">Total</th>
                          <th className="text-left p-3">Obtained</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedResult.items?.length > 0 ? (
                          selectedResult.items.map((item: any) => (
                            <tr
                              key={item.id}
                              className="border-b hover:bg-slate-50 transition"
                            >
                              <td className="p-3">{item.subject}</td>
                              <td className="p-3">{item.totalMarks}</td>
                              <td className="p-3">{item.obtainedMarks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-3 text-center text-sm text-muted-foreground"
                            >
                              No subject details available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-xs text-muted-foreground">
                        Total Marks
                      </p>
                      <p className="text-lg font-semibold">
                        {selectedResult.totalMarks}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-xs text-muted-foreground">Obtained</p>
                      <p className="text-lg font-semibold">
                        {selectedResult.obtainedMarks}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-xs text-muted-foreground">
                        Percentage
                      </p>
                      <p className="text-lg font-semibold">
                        {selectedResult.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-slate-600">
                  Result details are not available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Page;
