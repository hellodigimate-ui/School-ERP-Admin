/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Users,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

interface AlumniRecord {
  id: string;
  admissionNumber?: string;
  studentId: string;
  branchId?: string;
  name: string;
  graduationYear: number;
  email?: string;
  phone?: string;
  address?: string;
  profession?: string;
  company?: string;
  bio?: string;
  socialLinks?: string;
  Student?: {
    class?: {
      name?: string;
    };
  };
  branch?: {
    id?: string;
    name?: string;
  };
}

interface AlumniForm {
  admissionNumber: string;
  branchId: string;
  name: string;
  graduationYear: string;
  email: string;
  phone: string;
  address: string;
  profession: string;
  company: string;
  bio: string;
  socialLinks: string;
}

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [branches, setBranches] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    distinctGraduationYears: 0,
    contactableAlumni: 0,
    employedAlumni: 0,
  });
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAlumniDialog, setShowAlumniDialog] = useState(false);
  const [form, setForm] = useState<AlumniForm>({
    admissionNumber: "",
    branchId: "",
    name: "",
    graduationYear: "",
    email: "",
    phone: "",
    address: "",
    profession: "",
    company: "",
    bio: "",
    socialLinks: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAlumniId, setEditingAlumniId] = useState<string | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(
    null,
  );

  const fetchAlumni = async (page = 1) => {
    setLoadingAlumni(true);
    try {
      const params: any = { page, perPage: 10 };
      if (searchTerm) params.name = searchTerm;
      if (batchFilter !== "all") params.graduationYear = Number(batchFilter);

      const res = await axiosInstance.get("/api/v1/alumni", { params });
      if (res.data?.success) {
        setAlumni(res.data.data || []);
        setCurrentPage(res.data.pagination?.currentPage || page);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setAlumni([]);
    } finally {
      setLoadingAlumni(false);
    }
  };

  useEffect(() => {
    fetchAlumni(1);
    fetchAlumniStats();
  }, [searchTerm, batchFilter]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const res = await axiosInstance.get("/api/v1/branches", {
        params: { page: 1, perPage: 100 },
      });
      if (res.data?.success) {
        setBranches(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchAlumniStats = async () => {
    setLoadingStats(true);
    try {
      const params: any = {};
      if (batchFilter !== "all") params.graduationYear = Number(batchFilter);
      const res = await axiosInstance.get("/api/v1/alumni/stats", { params });
      if (res.data?.success) {
        setStats(res.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching alumni stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const resetForm = () => {
    setForm({
      admissionNumber: "",
      branchId: "",
      name: "",
      graduationYear: "",
      email: "",
      phone: "",
      address: "",
      profession: "",
      company: "",
      bio: "",
      socialLinks: "",
    });
    setIsEditMode(false);
    setEditingAlumniId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowAlumniDialog(true);
  };

  const openEditDialog = (record: AlumniRecord) => {
    setForm({
      admissionNumber: record.admissionNumber || record.studentId || "",
      branchId: record.branchId || record.branch?.id || "",
      name: record.name,
      graduationYear: String(record.graduationYear),
      email: record.email || "",
      phone: record.phone || "",
      address: record.address || "",
      profession: record.profession || "",
      company: record.company || "",
      bio: record.bio || "",
      socialLinks: record.socialLinks || "",
    });
    setEditingAlumniId(record.id);
    setIsEditMode(true);
    setShowAlumniDialog(true);
  };

  const openViewDialog = (record: AlumniRecord) => {
    setSelectedAlumni(record);
    setShowViewDialog(true);
  };

  const closeViewDialog = () => {
    setSelectedAlumni(null);
    setShowViewDialog(false);
  };

  const saveAlumni = async () => {
    if (!form.admissionNumber || !form.name || !form.graduationYear) return;

    try {
      const payload = {
        admissionNumber: form.admissionNumber,
        branchId: form.branchId,
        name: form.name,
        graduationYear: Number(form.graduationYear),
        email: form.email,
        phone: form.phone,
        address: form.address,
        profession: form.profession,
        company: form.company,
        bio: form.bio,
        socialLinks: form.socialLinks,
      };
      if (isEditMode && editingAlumniId) {
        await axiosInstance.put(`/api/v1/alumni/${editingAlumniId}`, payload);
      } else {
        await axiosInstance.post("/api/v1/alumni", payload);
      }
      setShowAlumniDialog(false);
      fetchAlumni(currentPage);
      fetchAlumniStats();
      resetForm();
    } catch (error) {
      console.error("Error saving alumni:", error);
    }
  };

  const deleteAlumni = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this alumni record?"))
      return;
    try {
      await axiosInstance.delete(`/api/v1/alumni/${id}`);
      fetchAlumni(currentPage);
      fetchAlumniStats();
    } catch (error) {
      console.error("Error deleting alumni:", error);
    }
  };

  const statCards = [
    {
      label: "Total Alumni",
      value: stats.totalAlumni,
      color: "from-blue-400 to-blue-600",
      icon: Users,
    },
    {
      label: "Graduation Years",
      value: stats.distinctGraduationYears,
      color: "from-emerald-400 to-green-600",
      icon: GraduationCap,
    },
    {
      label: "Contactable Alumni",
      value: stats.contactableAlumni,
      color: "from-purple-400 to-purple-600",
      icon: UserCheck,
    },
    {
      label: "Employed Alumni",
      value: stats.employedAlumni,
      color: "from-amber-400 to-orange-500",
      icon: Calendar,
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <UserCheck size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alumni</h1>
            <p className="text-sm text-muted-foreground">
              Manage alumni records & events
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-primary-foreground shadow-card animate-fade-in`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
              <stat.icon size={28} className="opacity-40" />
            </div>
          </div>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        {/* Manage Alumni Tab */}
        <TabsContent value="manage" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search alumni..."
                  className="pl-9 w-64 bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-32 bg-card">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download size={14} /> Export
              </Button>
              <Button className="gap-2" onClick={openCreateDialog}>
                <Plus size={16} /> Add Alumni
              </Button>
            </div>
          </div>

          <Dialog
            open={showAlumniDialog}
            onOpenChange={(open) => {
              setShowAlumniDialog(open);
              if (!open) resetForm();
            }}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Alumni" : "Add New Alumni"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Admission Number</Label>
                    <Input
                      value={form.admissionNumber}
                      onChange={(e) =>
                        setForm({ ...form, admissionNumber: e.target.value })
                      }
                      placeholder="Enter admission number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input
                      type="number"
                      value={form.graduationYear}
                      onChange={(e) =>
                        setForm({ ...form, graduationYear: e.target.value })
                      }
                      placeholder="e.g. 2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select
                      value={form.branchId}
                      onValueChange={(value) =>
                        setForm({ ...form, branchId: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-card">
                        <SelectValue placeholder="Select branch" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <Input
                      value={form.profession}
                      onChange={(e) =>
                        setForm({ ...form, profession: e.target.value })
                      }
                      placeholder="Current profession"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    rows={2}
                    placeholder="Enter current address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <Input
                    value={form.socialLinks}
                    onChange={(e) =>
                      setForm({ ...form, socialLinks: e.target.value })
                    }
                    placeholder="LinkedIn / website"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAlumniDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveAlumni}>
                    {isEditMode ? "Update Alumni" : "Add Alumni"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showViewDialog}
            onOpenChange={(open) => {
              setShowViewDialog(open);
              if (!open) closeViewDialog();
            }}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>View Alumni</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="rounded-lg border border-border bg-background p-3">
                    {selectedAlumni?.name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Admission Number</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.admissionNumber ||
                        selectedAlumni?.studentId ||
                        "-"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.graduationYear || "-"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.branch?.name || "-"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.email || "-"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.phone || "-"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <div className="rounded-lg border border-border bg-background p-3">
                      {selectedAlumni?.profession || "-"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <div className="rounded-lg border border-border bg-background p-3">
                    {selectedAlumni?.company || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="rounded-lg border border-border bg-background p-3 whitespace-pre-wrap">
                    {selectedAlumni?.address || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="rounded-lg border border-border bg-background p-3">
                    {selectedAlumni?.socialLinks || "-"}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={closeViewDialog}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Batch</TableHead>
                  <TableHead className="font-semibold">Branch</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Occupation</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumni.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="p-4 text-center text-sm text-muted-foreground"
                    >
                      {loadingAlumni
                        ? "Loading alumni..."
                        : "No alumni records found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  alumni.map((record, index) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {record.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {record.graduationYear}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.branch?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Phone size={10} />
                            {record.phone || "-"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail size={10} />
                            {record.email || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.profession || "-"}</TableCell>
                      <TableCell>{record.company || "-"}</TableCell>
                      <TableCell>{record.address || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openViewDialog(record)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(record)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteAlumni(record.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchAlumni(currentPage - 1)}
                  disabled={currentPage === 1 || loadingAlumni}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchAlumni(currentPage + 1)}
                  disabled={currentPage === totalPages || loadingAlumni}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
