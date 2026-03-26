/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal, MapPin, Building2, Phone, Mail } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Branch {
  id: number;
  name: string;
  schoolId: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  school?: {
    id: string;
    name: string;
  };
}

interface School {
  id: number;
  name: string;
}

const Branches = () => {
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalBranches, setTotalBranches] = useState(0);

  

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);

  const [branchForm, setBranchForm] = useState({
    name: "",
    schoolId: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [currentPage, itemsPerPage, searchQuery, schoolFilter]);

  const fetchBranches = async () => {
    try {
      const params: any = {
        page: currentPage,
        perPage: itemsPerPage,
      };
      if (searchQuery) params.name = searchQuery;
      if (schoolFilter !== "all") params.schoolId = schoolFilter;

      const res = await axiosInstance.get("/api/v1/branches", { params });
      setBranches(res.data.data);
      setTotalBranches(res.data.total || res.data.data.length);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/schools");
      setSchools(res.data.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load schools",
        variant: "destructive",
      });
    }
  };

  const handleCreateBranch = async () => {
    if (!branchForm.name || !branchForm.schoolId || !branchForm.address) {
      toast({
        title: "Missing fields",
        description: "Name, School, and Address are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/branches", branchForm);
      toast({ title: "Success", description: "Branch created successfully" });
      setIsCreateOpen(false);
      resetForm();
      fetchBranches();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const openEdit = async (id: number) => {
    try {
      const res = await axiosInstance.get(`/api/v1/branches/${id}`);
      const b = res.data.data;
      setBranchForm({
        name: b.name,
        schoolId: b.schoolId,
        address: b.address,
        city: b.city,
        phone: b.phone,
        email: b.email,
      });
      setEditingBranchId(id);
      setIsEditOpen(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load branch details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBranch = async () => {
    if (!editingBranchId) return;
    try {
      await axiosInstance.put(`/api/v1/branches/${editingBranchId}`, branchForm);
      toast({ title: "Updated", description: "Branch updated successfully" });
      setIsEditOpen(false);
      setEditingBranchId(null);
      resetForm();
      fetchBranches();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBranch = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/v1/branches/${id}`);
      toast({ title: "Deleted", description: "Branch deleted successfully" });
      fetchBranches();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setBranchForm({
      name: "",
      schoolId: "",
      address: "",
      city: "",
      phone: "",
      email: "",
    });
  };

  const totalPages = Math.ceil(totalBranches / itemsPerPage);

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Branches
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage school branches
          </p>
        </div>

        {/* Add Branch */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-xl rounded-xl px-5 py-2 transition-all duration-300">
              <Plus className="w-4 h-4" /> Add Branch
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] h-[90vh] p-0 rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4 flex items-center justify-between shadow-md">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-semibold tracking-wide">
                  Add Branch
                </DialogTitle>
                <p className="text-xs text-white/80">
                  Fill in the details to create a new branch
                </p>
              </DialogHeader>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-br from-card via-indigo-50/40 to-purple-50/40 backdrop-blur-sm">

              {/* Optional top glow card */}
              <div className="bg-card rounded-xl shadow-md p-4 border border-border">
                <BranchForm
                  form={branchForm}
                  setForm={setBranchForm}
                  schools={schools}
                />
              </div>

            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between items-center px-6 py-4 border-t bg-card">

              <Button
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-lg"
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateBranch}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg px-6 shadow-lg transition-all duration-300"
              >
                Create Branch
              </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-card/60 backdrop-blur-md border border-border shadow-sm rounded-2xl p-4">

        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition" />

          <Input
            placeholder="Search branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 rounded-xl border-border bg-card/80 focus:bg-card focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
        </div>

        {/* School Filter */}
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-full lg:w-[220px] rounded-xl border-border bg-card/80 shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
            <SelectValue placeholder="School" />
          </SelectTrigger>

          <SelectContent className="rounded-xl shadow-lg">
            <SelectItem value="all">All Schools</SelectItem>
            {schools.map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Items Per Page */}
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(v) => {
            setItemsPerPage(Number(v));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full lg:w-[140px] rounded-xl border-border bg-card/80 shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-400">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-lg shadow-md">
            {[5, 10, 20].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-md overflow-hidden">

        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-secondary/50 dark:bg-secondary/30">
              <TableHead className="text-foreground font-semibold">Branch</TableHead>
              <TableHead className="text-foreground font-semibold">School</TableHead>
              <TableHead className="text-foreground font-semibold">City</TableHead>
              <TableHead className="text-foreground font-semibold text-end">Action</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {branches.map((branch) => (
              <TableRow
                key={branch.id}
                className="group hover:bg-secondary/30 transition-all duration-200"
              >
                {/* Branch */}
                <TableCell>
                  <p className="font-semibold text-foreground group-hover:text-indigo-600 transition">
                    {branch.name}
                  </p>
                </TableCell>

                {/* School */}
                <TableCell>
                  <span className="text-foreground/70 font-medium">
                    {branch.school?.name}
                  </span>
                </TableCell>

                {/* City */}
                <TableCell>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">{branch.city}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full hover:bg-indigo-100 transition"
                      >
                        <MoreHorizontal className="w-4 h-4 text-foreground/70" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl shadow-lg border border-border"
                    >
                      <DropdownMenuItem
                        className="hover:bg-indigo-50 cursor-pointer"
                        onClick={() => openEdit(branch.id)}
                      >
                        ✏️ Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="hover:bg-red-50 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        🗑 Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 rounded-2xl border border-border bg-gradient-to-r from-indigo-50/60 to-purple-50/60 shadow-sm">

        {/* Left Text */}
        <p className="text-sm text-foreground/70 font-medium">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(currentPage * itemsPerPage, totalBranches)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-indigo-600">
            {totalBranches}
          </span>{" "}
          branches
        </p>

        {/* Pagination Controls */}
        <Pagination>
          <PaginationContent className="flex items-center gap-1">

            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`rounded-lg transition ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer hover:bg-secondary/50"
                }`}
              />
            </PaginationItem>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                      : "hover:bg-secondary/50 text-foreground cursor-pointer"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={`rounded-lg transition ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer hover:bg-secondary/50"
                }`}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit Branch
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Form */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5 bg-white/70 backdrop-blur-sm">
            <BranchForm
              form={branchForm}
              setForm={setBranchForm}
              schools={schools}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="rounded-lg hover:bg-gray-100"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateBranch}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg px-6 shadow-md"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const BranchForm = ({ form, setForm, schools }: any) => (
  <div className="space-y-6 py-4">

    {/* Section: Basic Info */}
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
        Basic Information
      </h3>

      {/* Branch Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Branch Name</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Branch name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 bg-white/80"
          />
        </div>
      </div>

      {/* School Select */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select School</label>
        <Select
          value={form.schoolId}
          onValueChange={(v) => setForm({ ...form, schoolId: v })}
        >
          <SelectTrigger className="rounded-xl border-gray-200 bg-white/80 focus:ring-2 focus:ring-indigo-400">
            <SelectValue placeholder="Select school" />
          </SelectTrigger>

          <SelectContent className="rounded-xl shadow-lg">
            {schools.map((s: School) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Section: Location */}
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-purple-600 tracking-wide uppercase">
        Location Details
      </h3>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <Textarea
          placeholder="Enter full address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-400 bg-white/80"
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">City</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-400 bg-white/80"
          />
        </div>
      </div>
    </div>

    {/* Section: Contact */}
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">
        Contact Details
      </h3>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-400 bg-white/80"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-400 bg-white/80"
          />
        </div>
      </div>
    </div>

  </div>
);

export default Branches;
