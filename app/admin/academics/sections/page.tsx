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
import { Plus, MoreHorizontal, Search, Filter, LayoutGrid, Layers, Users, GitBranch, GraduationCap, Pencil, Trash2, Inbox, Save } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Branch {
  id: string;
  name: string;
}

interface SectionData {
  [x: string]: any;
  id: string;
  name: string;
  classId: string;
  className: string;
  branch?: Branch;
  capacity: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalSections: number;
}

export default function Sections() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string; branchId: string; }[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");


  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalSections: 0,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    classId: "",
    capacity: "",
  });

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  /* ---------------- FETCH DATA ---------------- */

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data?.data || []);
    } catch {
      toast.error("Failed to load branches");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", {
        params: { perPage: 100,
            branchId:formData.branchId
         },
      });

      console.log("Fetched classes:", res.data);

      const classData =
        res.data?.data?.map((cls: any) => ({
          id: cls.id,              // ✅ IMPORTANT
          name: cls.name,
          branchId: cls.branchId,
        })) || [];

      setClasses(classData);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const fetchSections = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/api/v1/sections", {
        params: {
          page,
          perPage: pagination.perPage,
          search: searchQuery || undefined,
          branchId: filterBranch !== "all" ? filterBranch : undefined,
        },
      });

      setSections(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
    } catch {
      toast.error("Failed to load sections");
    }
  };

useEffect(() => {
  fetchClasses();
}, [filterBranch,formData.branchId]);

useEffect(() => {
  fetchSections(1);
  fetchBranches();
}, [searchQuery, filterBranch]);

  /* ---------------- ADD SECTION ---------------- */

  const handleAddSection = async () => {
    if (!formData.name || !formData.branchId || !formData.classId || !formData.capacity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/sections", {
        ...formData,
        capacity: Number(formData.capacity),
      });

      toast.success("Section created successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", branchId: "", classId: "", capacity: "" });
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create section");
    }
  };

  /* ---------------- EDIT SECTION ---------------- */

  const handleEditSection = async () => {
    if (!editingSection) return;

    try {
      await axiosInstance.put(`/api/v1/sections/${editingSection.id}`, {
        ...formData,
        capacity: Number(formData.capacity),
      });

      toast.success("Section updated successfully");
      setIsEditDialogOpen(false);
      setEditingSection(null);
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/sections/${id}`);
      toast.success("Section deleted successfully");
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete section");
    }
  };

  const openEditDialog = (section: SectionData) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      branchId: section.branch?.id || "",
      classId: section.classId,
      capacity: section.capacity.toString(),
    });
    setIsEditDialogOpen(true);
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">

          <main className="flex-1 p-6 space-y-6">

            {/* ================= Header ================= */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-6">

              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <LayoutGrid className="text-white" size={20} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sections
                </h1>
              </div>

              {/* Add Section */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90">
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </DialogTrigger>

                {/* ===== Dialog ===== */}
                <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden border border-border/40 shadow-xl">

                  {/* Header */}
                  <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <Plus size={18} />
                      Add New Section
                    </DialogTitle>
                  </DialogHeader>

                  {/* Form */}
                  <div className="space-y-5 px-6 py-5">

                    {/* Section Name */}
                    <div>
                      <Label>Section Name</Label>
                      <div className="relative mt-1">
                        <Layers className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-9 focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    {/* Capacity */}
                    <div>
                      <Label>Student Count</Label>
                      <div className="relative mt-1">
                        <Users className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) =>
                            setFormData({ ...formData, capacity: e.target.value })
                          }
                          className="pl-9 focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    {/* Branch */}
                    <div>
                      <Label>Branch</Label>
                      <div className="relative mt-1">
                        <GitBranch className="absolute left-3 top-3 text-muted-foreground" size={16} />
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

                    {/* Class */}
                    <div>
                      <Label>Class</Label>
                      <div className="relative mt-1">
                        <GraduationCap className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Select
                          value={formData.classId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, classId: value })
                          }
                        >
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="z-50">
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
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
                      onClick={handleAddSection}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    >
                      Create Section
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
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 focus:ring-2 focus:ring-purple-400"
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

            {/* ================= Sections Table ================= */}
            <div className="rounded-2xl border border-border/40 bg-card shadow-lg overflow-hidden">

              <Table>

                {/* ===== Header ===== */}
                <TableHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <TableRow>
                    <TableHead className="font-semibold">Section</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Branch</TableHead>
                    <TableHead className="font-semibold">Students</TableHead>
                    <TableHead className="text-center font-semibold">Actions</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                {/* ===== Body ===== */}
                <TableBody>
                  {sections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <div className="p-3 rounded-full bg-muted">
                            <Inbox size={20} />
                          </div>
                          <p className="text-sm">No sections found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sections.map((section) => (
                      <TableRow
                        key={section.id}
                        className="group hover:bg-muted/50 transition-all duration-200"
                      >

                        {/* Section */}
                        <TableCell className="flex items-center gap-2 font-medium">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
                            <Layers size={14} />
                          </div>
                          {section.name}
                        </TableCell>

                        {/* Class */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-600">
                              <GraduationCap size={14} />
                            </div>
                            {section.class.name || "N/A"}
                          </div>
                        </TableCell>

                        {/* Branch */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                              <GitBranch size={14} />
                            </div>
                            {section.class.branch?.name || "N/A"}
                          </div>
                        </TableCell>

                        {/* Students */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-amber-100 text-amber-600">
                              <Users size={14} />
                            </div>
                            <span className="font-medium">{section.capacity}</span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-muted"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl shadow-xl border border-border/40 p-2"
                            >
                              <DropdownMenuItem
                                onClick={() => openEditDialog(section)}
                                className="gap-2 cursor-pointer"
                              >
                                <Pencil className="h-4 w-4 text-indigo-500" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={() => handleDelete(section.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        <TableCell />
                      </TableRow>
                    ))
                  )}
                </TableBody>

              </Table>
            </div>
          </main>
        </div>
      </div>

      {/* ================= Edit Section Dialog ================= */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden border border-border/40 shadow-xl">

          {/* ===== Header ===== */}
          <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Pencil className="h-5 w-5" />
              Edit Section
            </DialogTitle>
          </DialogHeader>

          {/* ===== Form ===== */}
          <div className="space-y-5 px-6 py-5">

            {/* Section Name */}
            <div>
              <Label>Section Name</Label>
              <div className="relative mt-1">
                <Layers className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-9 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <Label>Student Count</Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="pl-9 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <Label>Branch</Label>
              <div className="relative mt-1">
                <GitBranch className="absolute left-3 top-3 text-muted-foreground" size={16} />
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

            {/* Class */}
            <div>
              <Label>Class</Label>
              <div className="relative mt-1">
                <GraduationCap className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Select
                  value={formData.classId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, classId: value })
                  }
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-50">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
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
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>

            <Button
              onClick={handleEditSection}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
