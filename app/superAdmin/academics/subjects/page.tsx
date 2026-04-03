/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { BookOpen, Check, ChevronLeft, ChevronRight, FileText, Hash, List, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalSubjects: number;
  perPage: number;
}

const API_BASE = "/api/v1/subjects";

const Subjects = () => {
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalSubjects: 0,
    perPage: 10,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({});
  const [editSubject, setEditSubject] = useState<Partial<Subject>>({});

  /** -----------------------------
   * API Calls
   * ----------------------------- */
  const getSubjects = async (page = 1, perPage = pagination.perPage) => {
  try {
    const res = await axiosInstance.get(
      `${API_BASE}?page=${page}&perPage=${perPage}`
    );

    setSubjects(res.data.data);
    setPagination(res.data?.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalSubjects: 0,
      perPage,
    });
  } catch {
    toast({
      title: "Error",
      description: "Failed to fetch subjects",
      variant: "destructive",
    });
  }
};


  const createSubject = async (subject: Partial<Subject>) =>
    axiosInstance.post(API_BASE, subject);
  const updateSubject = async (id: number, subject: Partial<Subject>) =>
    axiosInstance.put(`${API_BASE}/${id}`, subject);
  const deleteSubject = async (id: number) => axiosInstance.delete(`${API_BASE}/${id}`);

  const searchSubjects = async (query: string) => {
    try {
      const res = await axiosInstance.get(`${API_BASE}?name=${query}`);
      setSubjects(res.data.data);
      // Reset pagination when searching
      setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1, totalSubjects: res.data.data.length }));
    } catch {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      });
    }
  };

  /** -----------------------------
   * Lifecycle
   * ----------------------------- */
  useEffect(() => {
    if (!searchQuery) getSubjects(pagination.currentPage, pagination.perPage);
  }, [pagination.currentPage, pagination.perPage]);






  /** -----------------------------
   * Handlers
   * ----------------------------- */
  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      toast({
        title: "Missing Fields",
        description: "Name and Code are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await createSubject(newSubject);
      getSubjects(1); // refresh page
      setIsAddDialogOpen(false);
      setNewSubject({});
      toast({ title: "Success", description: "Subject added successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleEditSubject = async () => {
    if (!editingSubjectId || !editSubject.name || !editSubject.code) {
      toast({
        title: "Missing Fields",
        description: "Name and Code are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await updateSubject(editingSubjectId, editSubject);
      getSubjects(pagination.currentPage, pagination.perPage); // refresh
      setIsEditDialogOpen(false);
      setEditingSubjectId(null);
      setEditSubject({});
      toast({ title: "Updated", description: "Subject updated successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update subject",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await deleteSubject(id);
      getSubjects(pagination.currentPage, pagination.perPage); // refresh
      toast({ title: "Deleted", description: "Subject deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      getSubjects(1, pagination.perPage);
      return;
    }
    await searchSubjects(query);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const perPage = Number(e.target.value);
  //   setPagination((prev) => ({ ...prev, perPage, currentPage: 1 }));
  // };

  const handlePerPageChange = (value: string) => {
  setPagination((prev) => ({
    ...prev,
    perPage: Number(value),
  }));
};

  /** -----------------------------
   * Render
   * ----------------------------- */
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Subjects
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize subjects
          </p>
        </div>

        {/* Add Subject */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-lg rounded-xl px-5 py-2 transition-all">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-semibold">
                  Add New Subject
                </DialogTitle>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-6 py-5 bg-gradient-to-br from-card via-indigo-50/40 to-purple-50/40 space-y-4">

              {/* Name */}
              <div className="space-y-2">
                <Label>Name *</Label>
                <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={newSubject.name || ""}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  placeholder="Subject name"
                  className="pl-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                />
                </div>
              </div>

              {/* Code */}
              <div className="space-y-2">
                <Label>Code *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={newSubject.code || ""}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, code: e.target.value })
                    }
                    className="pl-10 rounded-xl border-border focus:ring-2 focus:ring-purple-400"
                    placeholder="e.g. MATH101"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={newSubject.description || ""}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, description: e.target.value })
                    }
                    className="pl-10 rounded-xl border-border focus:ring-2 focus:ring-pink-400"
                    placeholder="Short description"
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between px-6 py-4 border-t bg-card">
              <Button
                variant="ghost"
                onClick={() => setIsAddDialogOpen(false)}
                className="hover:bg-secondary/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubject}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg px-6 shadow-md hover:from-emerald-600"
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + perPage */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 rounded-xl border-border focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Per Page */}
        <div className="flex items-center gap-2 bg-card shadow-sm border border-border rounded-xl px-3 py-2">
          <List className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-muted-foreground">Per Page</span>

          <Select
            value={pagination.perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[80px] border-none shadow-none focus:ring-0">
              {/* <SelectValue /> */}
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-xl border bg-gradient-to-br from-card via-indigo-50/30 to-purple-50/30 shadow-md overflow-hidden">

        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-secondary/50 dark:bg-secondary/30">
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Code</TableHead>
              <TableHead className="font-semibold text-foreground">Description</TableHead>
              <TableHead className="w-[160px] text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <TableRow
                  key={subject.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  {/* Name */}
                  <TableCell className="font-medium text-foreground">
                    {subject.name}
                  </TableCell>

                  {/* Code Badge */}
                  <TableCell>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {subject.code}
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-foreground/70 max-w-[250px] truncate">
                    {subject.description || (
                      <span className="italic text-muted-foreground">No description</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex justify-end gap-2">

                      {/* Edit */}
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditSubject(subject);
                          setEditingSubjectId(subject.id);
                          setIsEditDialogOpen(true);
                        }}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 shadow-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="flex items-center gap-1 rounded-lg px-3 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">

                    <BookOpen className="w-8 h-8 text-gray-300" />

                    <p className="text-sm font-medium">No subjects found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adding a new subject or adjusting your search
                    </p>

                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 rounded-xl border bg-gradient-to-r from-card via-indigo-50/40 to-purple-50/40 shadow-sm">

        {/* Info */}
        <span className="text-sm text-foreground/70">
          Showing{" "}
          <span className="font-semibold text-indigo-600">
            {subjects.length
              ? (pagination.currentPage - 1) * pagination.perPage + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-indigo-600">
            {(pagination.currentPage - 1) * pagination.perPage + subjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-purple-600">
            {pagination.totalSubjects}
          </span>{" "}
          subjects
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">

          {/* Previous */}
          <Button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 rounded-full px-4 bg-card border shadow-sm hover:bg-secondary/50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>

          {/* Current Page Badge */}
          <div className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow">
            Page {pagination.currentPage} / {pagination.totalPages}
          </div>

          {/* Next */}
          <Button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 rounded-full px-4 bg-white border shadow-sm hover:bg-purple-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>

        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md h-[85vh] p-0 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit Subject
              </DialogTitle>
              <p className="text-xs text-white/80">
                Update subject details
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 space-y-4">

            {/* Name */}
            <div className="space-y-2">
              <Label>Name *</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={editSubject.name || ""}
                  onChange={(e) =>
                    setEditSubject({ ...editSubject, name: e.target.value })
                  }
                  className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  placeholder="Subject name"
                />
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label>Code *</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={editSubject.code || ""}
                  onChange={(e) =>
                    setEditSubject({ ...editSubject, code: e.target.value })
                  }
                  className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g. MATH101"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  value={editSubject.description || ""}
                  onChange={(e) =>
                    setEditSubject({ ...editSubject, description: e.target.value })
                  }
                  className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-400"
                  placeholder="Short description"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-between items-center px-6 py-4 border-t bg-white">

            <Button
              variant="ghost"
              onClick={() => setIsEditDialogOpen(false)}
              className="hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>

            <Button
              onClick={handleEditSubject}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 text-white rounded-lg px-6 shadow-md"
            >
              <Check className="w-4 h-4" />
              Update
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Subjects;
