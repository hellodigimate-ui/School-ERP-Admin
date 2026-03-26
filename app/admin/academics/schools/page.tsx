/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  MapPin,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  type: string;
  principalName: string;
  studentCount: number;
  teacherCount: number;
  isActive?: boolean;
  logo: string;
}

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    active: { variant: "default", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
  };
  const { variant, label } = variants[status] || variants.active;
  return <Badge variant={variant}>{label}</Badge>;
};

const Schools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [newSchool, setNewSchool] = useState({
    name: "",
    pincode: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    principalName: "",
    state: "",
  });
  const [editSchool, setEditSchool] = useState<Partial<School>>({});
  const pageSizeOptions = [5, 10, 20, 50];
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const params: any = {
          page: currentPage,
          perPage: itemsPerPage,
        };

        if (searchQuery) {
          params.name = searchQuery;
        }

        if (statusFilter !== "all") {
          params.isActive = statusFilter === "active";
        }

        const res = await axiosInstance.get("/api/v1/schools", { params });

        const formattedSchools = res.data.data.map((school: any) => ({
          ...school,
          status: school.isActive ? "active" : "inactive",
        }));

        setSchools(formattedSchools);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load schools",
          variant: "destructive",
        });
      }
    };

    fetchSchools();
  }, [searchQuery, statusFilter, currentPage, itemsPerPage]);



  // Filtering
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.pincode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || school.type === typeFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? school.isActive : !school.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add school
  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await axiosInstance.post("/api/v1/schools", newSchool);
      setSchools((prev) => [...prev, res.data.data]);
      setIsDialogOpen(false);
      toast({ title: "Success", description: "School added successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to add school",
        variant: "destructive",
      });
    }
  };

  // Edit school
  const handleUpdateSchool = async () => {
    if (!editingSchoolId) return;
    try {
      const res = await axiosInstance.put(`/api/v1/schools/${editingSchoolId}`, editSchool);
      setSchools((prev) =>
        prev.map((s) => (s.id === editingSchoolId ? res.data.data : s))
      );
      setIsEditOpen(false);
      setEditingSchoolId(null);
      toast({ title: "Updated", description: "School updated successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update school",
        variant: "destructive",
      });
    }
  };

  // Delete school
  const handleDeleteSchool = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/v1/schools/${id}`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Deleted", description: "School deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete school", variant: "destructive" });
    }
  };

  
  const [stats, setStats] = useState({
  totalSchools: 0,
  activeSchools: 0,
  totalTeachers: 0,
  totalStudents: 0,
  });

  const fetchStats = async () => {
  const res = await axiosInstance.get("/api/v1/schools/stats");
  setStats(res.data.data);
};

  useEffect(() => {
    fetchStats();
  }, []);


  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Schools
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all schools in the network
          </p>
        </div>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg rounded-xl px-5 py-2 transition-all">
              <Plus className="w-4 h-4" />
              Add School
            </Button>
          </DialogTrigger>

          {/* Dialog */}
          <DialogContent className="sm:max-w-[650px] rounded-2xl shadow-2xl border border-border dark:border-border bg-card dark:bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-foreground dark:text-foreground">
                Add New School
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
                Enter the details of the new school.
              </DialogDescription>
            </DialogHeader>

            {/* Form */}
            <div className="grid gap-5 py-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    value={newSchool.name}
                    onChange={(e) =>
                      setNewSchool({ ...newSchool, name: e.target.value })
                    }
                    placeholder="Springfield Elementary"
                    className="rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={newSchool.pincode}
                    onChange={(e) =>
                      setNewSchool({ ...newSchool, pincode: e.target.value })
                    }
                    placeholder="302001"
                    className="rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSchool.email}
                    onChange={(e) =>
                      setNewSchool({ ...newSchool, email: e.target.value })
                    }
                    className="rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input
                    id="principal"
                    value={newSchool.principalName}
                    onChange={(e) =>
                      setNewSchool({
                        ...newSchool,
                        principalName: e.target.value,
                      })
                    }
                    className="rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newSchool.address}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, address: e.target.value })
                  }
                  rows={2}
                  className="rounded-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newSchool.city}
                    onChange={(e) =>
                      setNewSchool({ ...newSchool, city: e.target.value })
                    }
                    className="rounded-lg focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newSchool.phone}
                    onChange={(e) =>
                      setNewSchool({ ...newSchool, phone: e.target.value })
                    }
                    className="rounded-lg focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newSchool.state}
                  onChange={(e) =>
                    setNewSchool({ ...newSchool, state: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-lg border-border hover:bg-secondary/50"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddSchool}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md px-6"
              >
                Add School
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Total Schools */}
        <div className="group relative bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300">
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition"></div>

          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-500/10">
            <Building2 className="w-7 h-7 text-indigo-600" />
          </div>

          <div>
            <p className="text-3xl font-bold text-foreground">{stats.totalSchools}</p>
            <p className="text-sm text-muted-foreground">Total Schools</p>
          </div>
        </div>

        {/* Active Schools */}
        <div className="group relative bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300">
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition"></div>

          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-green-500/10">
            <Building2 className="w-7 h-7 text-green-600" />
          </div>

          <div>
            <p className="text-3xl font-bold text-foreground">{stats.activeSchools}</p>
            <p className="text-sm text-muted-foreground">Active Schools</p>
          </div>
        </div>

        {/* Total Students */}
        <div className="group relative bg-gradient-to-br from-blue-500/10 to-sky-600/5 border border-blue-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300">
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition"></div>

          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-500/10">
            <Users className="w-7 h-7 text-blue-600" />
          </div>

          <div>
            <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-600/5 border border-purple-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-300">
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition"></div>

          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-500/10">
            <GraduationCap className="w-7 h-7 text-purple-600" />
          </div>

          <div>
            <p className="text-3xl font-bold text-foreground">{stats.totalTeachers}</p>
            <p className="text-sm text-muted-foreground">Total Teachers</p>
          </div>
        </div>

      </div>

      {/* Filters + Items per page */}
      <div className="flex flex-col lg:flex-row gap-5 mb-8 justify-between items-center bg-card/60 backdrop-blur-md border border-border shadow-sm rounded-2xl p-4">

        {/* Left Section */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">

          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition" />

            <Input
              placeholder="Search schools by name, pincode, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 rounded-xl border-border bg-card/80 focus:bg-card focus:ring-2 focus:ring-primary/40 shadow-sm transition-all"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-border bg-card/80 shadow-sm hover:border-primary focus:ring-2 focus:ring-primary/40 transition">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="rounded-xl shadow-lg border border-border dark:border-border bg-card dark:bg-card">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right Section - Pagination Control */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">

          <span className="text-sm text-foreground/100 font-medium text-black">Show</span>

          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[90px] rounded-lg bg-card shadow-sm border border-border focus:ring-2 focus:ring-primary/40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-lg shadow-md">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-foreground/70 font-medium">per page</span>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-md overflow-hidden">

        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-secondary/50 dark:bg-secondary/30">
              <TableHead className="text-foreground font-semibold">School</TableHead>
              <TableHead className="text-foreground font-semibold">Location</TableHead>
              <TableHead className="text-foreground font-semibold">Principal</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Action</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {paginatedSchools.map((school) => (
              <TableRow
                key={school.id}
                className="group hover:bg-secondary/30 transition-all duration-200"
              >
                {/* School */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border dark:border-border shadow-sm">
                      <AvatarImage src={school.logo} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 text-sm font-semibold">
                        {school.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition">
                        {school.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{school.pincode}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">
                      {school.city}, {school.state}
                    </span>
                  </div>
                </TableCell>

                {/* Principal */}
                <TableCell>
                  <span className="text-foreground font-medium">
                    {school.principalName || "-"}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex items-center">
                    {getStatusBadge(school.isActive ? "active" : "inactive")}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-full hover:bg-indigo-100 transition"
                      >
                        <MoreHorizontal className="w-4 h-4 text-foreground/70" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl shadow-lg border border-border dark:border-border bg-card dark:bg-card"
                    >
                      <DropdownMenuItem
                        className="hover:bg-indigo-50 cursor-pointer"
                        onClick={() => {
                          setIsEditOpen(true);
                          setEditingSchoolId(school.id);
                          setEditSchool(school);
                        }}
                      >
                        ✏️ Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="hover:bg-red-50 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteSchool(school.id)}
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-2xl shadow-2xl border border-border dark:border-border p-0 overflow-hidden bg-card dark:bg-card">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit School
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5 bg-card/70 backdrop-blur-sm">

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">School Name</Label>
                <Input
                  id="edit-name"
                  value={editSchool.name || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, name: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pincode">Pincode</Label>
                <Input
                  id="edit-pincode"
                  value={editSchool.pincode || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, pincode: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editSchool.email || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, email: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-principal">Principal Name</Label>
                <Input
                  id="edit-principal"
                  value={editSchool.principalName || ""}
                  onChange={(e) =>
                    setEditSchool({
                      ...editSchool,
                      principalName: e.target.value,
                    })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={editSchool.address || ""}
                onChange={(e) =>
                  setEditSchool({ ...editSchool, address: e.target.value })
                }
                rows={2}
                className="rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editSchool.city || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, city: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editSchool.phone || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, phone: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={editSchool.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditSchool({
                      ...editSchool,
                      isActive: value === "active",
                    })
                  }
                >
                  <SelectTrigger className="rounded-lg focus:ring-2 focus:ring-indigo-400">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="rounded-lg shadow-md">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={editSchool.state || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, state: e.target.value })
                  }
                  className="rounded-lg focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>
          </div>

          {/* Footer (Sticky) */}
          <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t bg-card sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="rounded-lg hover:bg-secondary/50"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateSchool}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg px-6 shadow-md"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 shadow-sm">

        {/* Left Text */}
        <p className="text-sm text-gray-600 font-medium">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {paginatedSchools.length
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-800">
            {Math.min(currentPage * itemsPerPage, filteredSchools.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-indigo-600">
            {filteredSchools.length}
          </span>{" "}
          schools
        </p>

        {/* Pagination */}
        <Pagination>
          <PaginationContent className="flex items-center gap-1">

            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`rounded-lg transition ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer hover:bg-indigo-100"
                }`}
              />
            </PaginationItem>

            {/* Page Numbers */}
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
                    : "cursor-pointer hover:bg-indigo-100"
                }`}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>
    </AdminLayout>
  );
};

export default Schools;
