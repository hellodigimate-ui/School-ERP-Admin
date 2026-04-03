/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, MoreHorizontal, BookOpen, Users, GraduationCap, Layers, BookMarked, Filter, Search, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";
// import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

interface Branch {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  branchId: string;
  branch?: Branch;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalClasses: number;
}

const subjectsData = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "Science" },
  { id: "3", name: "History" },
];

const branchesData = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
  { id: "3", name: "Arts" },
];

const classesData = [
  { id: "1", name: "Class 9-A", branchId: "1", branch: { id: "1", name: "Science" } },
  { id: "2", name: "Class 9-B", branchId: "2", branch: { id: "2", name: "Commerce" } },
  { id: "3", name: "Class 9-C", branchId: "3", branch: { id: "3", name: "Arts" } },
];

const sectionsData = [
  { id: "1", name: "Section A", classId: "1", class: { id: "1", name: "Class 9-A" } },
  { id: "2", name: "Section B", classId: "1", class: { id: "1", name: "Class 9-A" } },
  { id: "3", name: "Section A", classId: "2", class: { id: "2", name: "Class 9-B" } },
];

export default function Classes() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalClasses: 0,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [filterBranch, setFilterBranch] = useState("")

  const [formData, setFormData] = useState({ name: "", branchId: "" });

  /** Fetch branches */
  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Failed to load branches");
    }
  };

  /** Fetch classes with server-side pagination and filters */
  const fetchClasses = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", {
        params: {
          name: searchQuery || undefined,
          page,
          perPage: pagination.perPage,
          branchId: branchFilter !== "all" ? branchFilter : undefined,
        },
      });
      setClasses(res.data.data);
      setBranchFilter("all");
      // setSearchQuery("");
      // console.log(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  useEffect(() => {
    fetchBranches();
    // fetchClasses(1);
  }, []);

  useEffect(() => {
  fetchClasses(pagination.currentPage);
}, [searchQuery, branchFilter, pagination.currentPage, pagination.perPage]);

  /** Add class */
  const handleAddClass = async () => {
    if (!formData.name || !formData.branchId) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await axiosInstance.post("/api/v1/classes", formData);
      toast.success("Class created successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", branchId: "" });
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  };

  /** Edit class */
  const handleEditClass = async () => {
    if (!editingClass || !formData.name || !formData.branchId) return;
    try {
      await axiosInstance.put(`/api/v1/classes/${editingClass.id}`, formData);
      toast.success("Class updated successfully");
      setIsEditDialogOpen(false);
      setEditingClass(null);
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
  };

  /** Delete class */
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/classes/${id}`);
      toast.success("Class deleted successfully");
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  };

  /** Open edit dialog */
  const openEditDialog = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, branchId: cls.branchId });
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-background">
        {/* <AdminSidebar /> */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="space-y-6">

            {/* ================= Page Header ================= */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <BookOpen className="text-white" size={26} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Academics
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage subjects, classes, sections & timetables
                  </p>
                </div>
              </div>
            </div>

            {/* ================= Stats Cards ================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                {
                  label: "Total Subjects",
                  value: subjectsData.length,
                  icon: BookMarked,
                  gradient: "from-blue-500 to-indigo-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Branches",
                  value: branchesData.length,
                  icon: Layers,
                  gradient: "from-pink-500 to-rose-500",
                  bg: "bg-rose-50",
                },
                {
                  label: "Classes",
                  value: classesData.length,
                  icon: GraduationCap,
                  gradient: "from-emerald-500 to-teal-500",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Sections",
                  value: sectionsData.length,
                  icon: Users,
                  gradient: "from-amber-500 to-orange-500",
                  bg: "bg-amber-50",
                },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="group rounded-2xl border border-border/40 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    {/* Left Content */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <h2 className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform">
                        {stat.value}
                      </h2>
                    </div>

                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${stat.bg} flex items-center justify-center`}
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}
                      >
                        <stat.icon size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ================= Header ================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">

              {/* Title Section */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <GraduationCap className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Classes
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage class assignments
                  </p>
                </div>
              </div>

              {/* Add Class Button */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 transition">
                    <Plus className="h-4 w-4" />
                    Add Class
                  </Button>
                </DialogTrigger>

                {/* Dialog */}
                <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden border border-border/40">

                  {/* Dialog Header */}
                  <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-t-2xl">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <Plus size={18} /> Add New Class
                    </DialogTitle>
                  </DialogHeader>

                  {/* Form */}
                  <div className="grid gap-5 py-5 px-6">

                    {/* Class Name */}
                    <div className="grid gap-2">
                      <Label htmlFor="name">Class Name</Label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="name"
                          placeholder="e.g. Mathematics 101"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-9 focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="grid gap-2">
                      <Label>Branch</Label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Select
                          value={formData.branchId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, branchId: value })
                          }
                        >
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <DialogFooter className="px-6 pb-5">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddClass}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    >
                      Create Class
                    </Button>
                  </DialogFooter>

                </DialogContent>
              </Dialog>
            </div>

            {/* ================= Filters ================= */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchClasses();
                  }}
                  className="pl-9 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-[220px]">
                <Filter className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Select
                  value={filterBranch}
                  onValueChange={(value) => {
                    setFilterBranch(value);
                    fetchClasses();
                  }}
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Filter by Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

              {/* ================= Table ================= */}
              <div className="rounded-2xl border border-border/40 bg-card shadow-lg overflow-hidden">

                <Table>

                  {/* ===== Table Header ===== */}
                  <TableHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Class Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Branch</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>

                  {/* ===== Table Body ===== */}
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow
                        key={cls.id}
                        className="group hover:bg-muted/50 transition-all duration-200"
                      >
                        {/* Class Name */}
                        <TableCell className="font-medium flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                            <GraduationCap size={14} />
                          </div>
                          {cls.name}
                        </TableCell>

                        {/* Branch */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                              <Layers size={14} />
                            </div>
                            <span className="text-muted-foreground">
                              {cls.branch?.name || "—"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-muted transition"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl shadow-xl border border-border/40 p-2"
                            >
                              <DropdownMenuItem
                                onClick={() => openEditDialog(cls)}
                                className="gap-2 cursor-pointer"
                              >
                                <Pencil className="h-4 w-4 text-indigo-500" />
                                Edit Class
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={() => handleDelete(cls.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        {/* Extra spacing column */}
                        <TableCell />
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 0 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-2xl shadow-sm">

                      {/* ===== Previous ===== */}
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.currentPage > 1)
                              fetchClasses(pagination.currentPage - 1);
                          }}
                          className={`rounded-xl transition-all duration-200 
                            ${pagination.currentPage === 1 
                              ? "pointer-events-none opacity-40" 
                              : "hover:bg-indigo-100 hover:text-indigo-600 hover:scale-105"
                            }`}
                        />
                      </PaginationItem>

                      {/* ===== Page Numbers ===== */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={pagination.currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                fetchClasses(page);
                              }}
                              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200
                                ${
                                  pagination.currentPage === page
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md scale-105"
                                    : "hover:bg-indigo-100 hover:text-indigo-600 hover:scale-105"
                                }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      {/* ===== Next ===== */}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.currentPage < pagination.totalPages)
                              fetchClasses(pagination.currentPage + 1);
                          }}
                          className={`rounded-xl transition-all duration-200 
                            ${pagination.currentPage === pagination.totalPages 
                              ? "pointer-events-none opacity-40" 
                              : "hover:bg-indigo-100 hover:text-indigo-600 hover:scale-105"
                            }`}
                        />
                      </PaginationItem>

                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* ================= Edit Class Dialog ================= */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden border border-border/40 shadow-xl">

                  {/* ===== Header ===== */}
                  <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Pencil className="h-5 w-5" />
                      Edit Class
                    </DialogTitle>
                  </DialogHeader>

                  {/* ===== Form ===== */}
                  <div className="grid gap-5 px-6 py-5">

                    {/* Class Name */}
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Class Name</Label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-9 focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="grid gap-2">
                      <Label>Branch</Label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Select
                          value={formData.branchId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, branchId: value })
                          }
                        >
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                  </div>

                  {/* ===== Footer ===== */}
                  <DialogFooter className="px-6 pb-5 flex justify-end gap-2">

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingClass(null);
                      }}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleEditClass}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>

                  </DialogFooter>

                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}