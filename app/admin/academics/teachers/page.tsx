/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";

export const dynamic = 'force-dynamic';
import { Search, Plus, MoreHorizontal, Mail, Phone,  BookOpen, Award, Pencil, Trash2, Users, Save, User, ToggleRight, Lock } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */
interface Subject {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Teacher {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
  branchId: string;
  subjectId: string;
  qualification: string;
  experienceYears: number;
  isActive: boolean;
}

/* ---------------- STATUS BADGE ---------------- */
const getStatusBadge = (isActive: boolean) => (
  <Badge variant={isActive ? "default" : "secondary"}>
    {isActive ? "Active" : "Inactive"}
  </Badge>
);

/* ---------------- COMPONENT ---------------- */
function TeachersComponent({ highlightId }: { highlightId: string | null }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // const searchParams = useSearchParams();
  // const highlightId = searchParams.get('id');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branchId: "",
    subjectId: "",
    qualification:"",
    experienceYears: "",
    status: "active",
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchTeachers();
    fetchBranches();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (highlightId) {
      // Scroll to the highlighted row
      const element = document.getElementById(`teacher-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightId, teachers]);

  const fetchTeachers = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/teachers");
      setTeachers(res.data.data);
    } catch {
      toast.error("Failed to load teachers");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Failed to load branches");
    }
  };

const fetchSubjects = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/subjects?perPage=1000");

    const subjectsData = res?.data?.data || [];

    setSubjects(subjectsData);
  } catch {
    toast.error("Failed to load subjects");
    setSubjects([]); // fallback safety
  }
};

  /* ---------------- ADD TEACHER ---------------- */
  const handleAddTeacher = async () => {
    try {
      await axiosInstance.post("/api/v1/teachers", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        branchId: String(formData.branchId),
        qualification: String(formData.qualification),
        subjectId: String(formData.subjectId),
        experienceYears: Number(formData.experienceYears),
        isActive: formData.status === "active",
      });

      toast.success("Teacher created successfully");
      setIsAddModalOpen(false);
      resetForm();
      fetchTeachers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create teacher");
    }
  };

  /* ---------------- EDIT TEACHER ---------------- */
  const handleEditTeacher = async () => {
    if (!editingTeacher) return;
    try {
      await axiosInstance.put(`/api/v1/teachers/${editingTeacher.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        branchId: String(formData.branchId),
        subjectId: String(formData.subjectId),
        experienceYears: Number(formData.experienceYears),
        isActive: formData.status === "active",
      });

      toast.success("Teacher updated successfully");
      setIsEditModalOpen(false);
      setEditingTeacher(null);
      resetForm();
      fetchTeachers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update teacher");
    }
  };

  /* ---------------- DELETE TEACHER ---------------- */
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axiosInstance.delete(`/api/v1/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- HELPER ---------------- */
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      branchId: "",
      subjectId: "",
      qualification: "",
      experienceYears: "",
      status: "active",
    });
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: "", // leave blank
      phone: teacher.phone || "",
      branchId: teacher.branchId.toString(),
      subjectId: teacher.subjectId.toString(),
      qualification: teacher.qualification.toString(),
      experienceYears: teacher.experienceYears.toString(),
      status: teacher.isActive ? "active" : "inactive",
    });
    setIsEditModalOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-6">

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Users className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Teachers
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage teaching staff
            </p>
          </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </Button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border border-border/40 bg-card shadow-lg overflow-hidden">

        <Table>

          {/* Header */}
          <TableHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Contact</TableHead>
              {/* <TableHead>Branch</TableHead> */}
              <TableHead>Subject</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {paginatedTeachers.map((t) => (
              <TableRow
                key={t.id}
                id={`teacher-${t.userId}`}
                className={t.userId === highlightId ? "bg-green-100 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-900" : "hover:bg-muted/50 transition-all duration-200"}
              >

                {/* Teacher */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{t.name}</span>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail size={14} />
                    {t.email}
                  </div>
                  {t.phone && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone size={14} />
                      {t.phone}
                    </div>
                  )}
                </TableCell>

                {/* Branch */}
                {/* <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                      <GitBranch size={14} />
                    </div>
                    {branches.find((b) => String(b.id) === String(t.branchId))?.name || "-"}
                  </div>
                </TableCell> */}

                {/* Subject */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                      <BookOpen size={14} />
                    </div>
                    {subjects.find((s) => String(s.id) === String(t.subjectId))?.name || "-"}
                  </div>
                </TableCell>

                {/* Experience */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-amber-500" />
                    {t.experienceYears} yrs
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusBadge(t.isActive)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="rounded-lg hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl shadow-xl border border-border/40 p-2"
                    >
                      <DropdownMenuItem
                        onClick={() => openEditModal(t)}
                        className="gap-2 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4 text-indigo-500" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                        onClick={() => handleDeleteTeacher(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell />
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      {/* ================= PAGINATION ================= */}
      <Pagination className="mt-4 flex justify-center gap-1">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="bg-indigo-100 text-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-200"
          >
            Prev
          </PaginationPrevious>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-indigo-500 text-white shadow"
                    : "hover:bg-indigo-100"
                }`}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationNext
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="bg-indigo-100 text-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-200"
          >
            Next
          </PaginationNext>
        </PaginationContent>
      </Pagination>

      {/* ================= ADD TEACHER MODAL ================= */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-auto rounded-2xl border border-border/40 shadow-xl">

          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Teacher
            </DialogTitle>
            <DialogDescription className="text-indigo-100">
              Enter teacher details
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <div className="space-y-4 px-6 py-5">
            
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Branch */}
            {/* <div className="relative">
              <GitBranch className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Select
                value={formData.branchId}
                onValueChange={(v) => setFormData({ ...formData, branchId: v })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Subject */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Select
                value={formData.subjectId}
                onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="relative">
              <Award className="absolute left-3 top-3 text-amber-500" size={16} />
              <Input
                type="number"
                placeholder="Experience Years"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-amber-400"
              />
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="px-6 pb-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddTeacher}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add Teacher
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* ================= EDIT TEACHER MODAL ================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-auto rounded-2xl border border-border/40 shadow-xl">
          
          <DialogHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Teacher
            </DialogTitle>
            <DialogDescription className="text-indigo-100">
              Edit teacher details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Branch */}
            {/* <div className="relative">
              <GitBranch className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Select
                value={formData.branchId}
                onValueChange={(v) => setFormData({ ...formData, branchId: v })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Subject */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Select
                value={formData.subjectId}
                onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="relative">
              <Award className="absolute left-3 top-3 text-amber-500" size={16} />
              <Input
                type="number"
                placeholder="Experience Years"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="pl-10 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <ToggleRight className="absolute left-3 top-3 text-muted-foreground" size={16} />
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="px-6 pb-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEditTeacher}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Teacher
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function Teachers() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeachersWrapper />
    </Suspense>
  );
}

function TeachersWrapper() {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setHighlightId(urlParams.get('id'));
  }, []);

  return <TeachersComponent highlightId={highlightId} />;
}
