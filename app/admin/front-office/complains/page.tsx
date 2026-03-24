// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";


// const API = axiosInstance.create({
//   baseURL: "/api/v1/complaints",
// });

const API_URl = "/api/v1/complaints";

const Page = () => {

  const emptyForm = {
    name: "",
    phone: "",
    type: "",
    source: "",
    assignTo: "",
    date: "",
    description: "",
  };

  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [formData, setFormData] = useState(emptyForm);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    title: "",
    status: "",
    type: "",
  });



  // ================= FETCH =================

  const fetchComplaints = async () => {
    try {
      // const { data } = await API.get("", {
      const { data } = await axiosInstance.get(API_URl, {
        params: {
          page,
          perPage: 10,
          title: filters.title,
          status: filters.status,
          type: filters.type,
        },
      });

      setComplaints(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch complaints error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // const { data } = await API.get("/stats");
      const { data } = await axiosInstance.get(`${API_URl}/stats`);
      setStats(data.data);
      console.log("stas",data.data)
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [page, filters.title, filters.status, filters.type]);



  // ================= CREATE =================
  
  const handleCreate = async () => {
    try {
      // await API.post("", {
      await axiosInstance.post(API_URl, {
        ...formData,
        date: new Date(formData.date).toISOString(),
      });

      setFormData(emptyForm);
      setOpen(false);
      fetchComplaints();
      fetchStats();
    } catch (error) {
      console.error("Create error:", error);
    }
  };  



  // ================= VIEW =================

  const handleView = async (id: string) => {
    try {
      // const { data } = await API.get(`/${id}`);
      const { data } = await axiosInstance.get(`${API_URl}/${id}`);
      setSelectedComplaint(data.data);
      setViewOpen(true);
    } catch (error) {
      console.error("View error:", error);
    }
  };



  // ================= UPDATE =================

  const handleUpdate = async () => {
    try {
      // await API.put(`/${selectedComplaint.id}`, editData);
      await axiosInstance.put(`${API_URl}/${selectedComplaint.id}`, editData);

      setEditOpen(false);
      fetchComplaints();
      fetchStats();
    } catch (error) {
      console.error("Update error:", error);
    }
  };



  // ================= DELETE =================

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      // await API.delete(`/${id}`);
      await axiosInstance.delete(`${API_URl}/${id}`);
      fetchComplaints();
      fetchStats();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };




  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        
        <div className="relative flex flex-col md:flex-row md:items-center 
                        justify-between gap-6 mb-8 p-6 rounded-3xl 
                        bg-gradient-to-r from-background via-background to-primary/10 
                        shadow-2xl overflow-hidden">

          {/* Decorative Glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 blur-3xl rounded-full opacity-40"></div>

          {/* Header */}
          <div className="relative">
            <h1 className="text-3xl font-bold font-display tracking-tight 
                          bg-gradient-to-r from-primary to-purple-500 
                          bg-clip-text text-transparent">
              Complaints
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Manage and resolve complaints from parents, students & staff
            </p>
          </div>

          {/* Add Complaint Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 px-6 h-11 rounded-xl 
                                bg-gradient-to-r from-primary to-purple-500
                                text-white shadow-lg hover:shadow-xl
                                hover:scale-[1.05] transition-all duration-300">
                <Plus className="w-4 h-4" />
                Add Complaint
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl rounded-3xl p-8 
                                      bg-background/80 backdrop-blur-xl 
                                      border shadow-2xl">

              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-semibold 
                                        bg-gradient-to-r from-primary to-purple-500 
                                        bg-clip-text text-transparent">
                  Register Complaint
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in the details of the complaint
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

                {/* Complainant Name */}
                <div className="space-y-2">
                  <Label>Complainant Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Full name"
                    className="h-11 rounded-xl bg-muted/40 border-purple-400/20
                              focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    className="h-11 rounded-xl bg-muted/40 border-purple-400/20
                              focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-all"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  >
                    <SelectTrigger className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-purple-400/40">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="discipline">Discipline</SelectItem>
                      <SelectItem value="canteen">Canteen</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                  >
                    <SelectTrigger className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-purple-400/40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Assign To */}
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Input
                    value={formData.assignTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignTo: e.target.value })
                    }
                    placeholder="Person/Department"
                    className="h-11 rounded-xl bg-muted/40 border-purple-400/20
                              focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-all"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    type="date"
                    className="h-11 rounded-xl bg-purple-500/5 border-purple-400/30
                              focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="col-span-full space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the complaint..."
                    className="rounded-xl min-h-[110px] bg-muted/40 border-purple-400/20
                              focus-visible:ring-2 focus-visible:ring-purple-400/40 transition-all"
                  />
                </div>

      

                {/* Actions */}
                <div className="col-span-full flex justify-end gap-3 pt-6 border-t mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="rounded-xl h-11 px-6 hover:bg-muted transition-all"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="rounded-xl h-11 px-6 text-white
                              bg-gradient-to-r from-primary to-purple-500
                              hover:from-primary/90 hover:to-purple-500/90
                              shadow-md hover:shadow-lg hover:scale-[1.03]
                              transition-all duration-200"
                    onClick={handleCreate}
                  >
                    Submit
                  </Button>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

          {[
            { label: "Total", value: stats.totalComplaints, icon: AlertCircle, gradient: "bg-gradient-to-r from-purple-500 to-indigo-500", text: "text-purple-600" },
            { label: "Pending", value: stats.pendingComplaints, icon: Clock, gradient: "bg-gradient-to-r from-pink-500 to-pink-400", text: "text-pink-600" },
            { label: "In Progress", value: stats.openComplaints, icon: Clock, gradient: "bg-gradient-to-r from-blue-500 to-cyan-400", text: "text-blue-600" },
            { label: "Resolved", value: stats.resolvedComplaints, icon: CheckCircle, gradient: "bg-gradient-to-r from-green-500 to-emerald-400", text: "text-green-600" },
          ].map(s => (
            <Card
              key={s.label}
              className="relative overflow-hidden border-0 rounded-3xl
                        bg-white/50 backdrop-blur-xl
                        shadow-md hover:shadow-2xl
                        hover:-translate-y-2 hover:scale-[1.02]
                        transition-all duration-300"
            >
              {/* Soft Glow Background */}
              <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full ${s.gradient} opacity-10 blur-3xl`} />

              <CardContent className="relative p-6 flex items-center gap-5">

                {/* Icon with gradient */}
                <div
                  className={`${s.gradient} w-16 h-16 rounded-2xl
                            flex items-center justify-center
                            shadow-lg ring-4 ring-white`}
                >
                  <s.icon className="w-6 h-6 text-white" />
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground tracking-wide">
                    {s.label}
                  </p>
                  <p className={`text-3xl font-extrabold font-display ${s.text}`}>
                    {s.value}
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>

        <Card className="relative border-0 rounded-3xl bg-white/50 backdrop-blur-xl
                        shadow-md hover:shadow-2xl
                        hover:-translate-y-1 hover:scale-[1.02]
                        transition-all duration-300">

          {/* Soft Glow Background */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-gradient-to-r from-pink-400 to-red-400 opacity-10 blur-3xl" />

          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                  className="pl-9 h-11 rounded-xl bg-muted/40 border-muted
                            focus:ring-2 focus:ring-primary/40 transition-all"
                  placeholder="Search complaints..." 
                />
              </div>

              {/* Status Filter */}
              <Select
                onValueChange={(value) =>
                setFilters({ ...filters, status: value === "all" ? "" : value })
              }
              >
                <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/40 border-muted
                                          focus:ring-2 focus:ring-primary/40 transition-all">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="OPEN">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select
                onValueChange={(value) =>
                setFilters({ ...filters, type: value === "all" ? "" : value })
              }
              >
                <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/40 border-muted
                                          focus:ring-2 focus:ring-primary/40 transition-all">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="discipline">Discipline</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </CardContent>
        </Card>

        <Card className="relative border-0 shadow-lg rounded-3xl overflow-hidden
                        bg-white/50 backdrop-blur-xl
                        hover:shadow-2xl transition-all duration-300">

          {/* Soft Glow Background */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-gradient-to-r from-pink-400 to-red-400 opacity-10 blur-3xl" />

          <CardContent className="p-0 relative">

            <Table>
              {/* Table Header */}
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm">
                  {/* <TableHead className="font-semibold text-foreground">#</TableHead> */}
                  <TableHead className="font-semibold text-foreground">Complainant</TableHead>
                  <TableHead className="font-semibold text-foreground">Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Source</TableHead>
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="font-semibold text-foreground">Assigned To</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>
                {complaints.map(c => (
                  <TableRow 
                    key={c.id} 
                    className="hover:bg-muted/40 hover:shadow-sm transition-all duration-200"
                  >
                    {/* <TableCell className="font-medium text-muted-foreground">{c.id}</TableCell> */}
                    <TableCell className="font-semibold text-foreground">{c.name}</TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {c.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{c.source}</TableCell>
                    <TableCell className="text-muted-foreground">{c.date.slice(0,10)}</TableCell>
                    <TableCell className="text-muted-foreground">{c.assignTo}</TableCell>

                    <TableCell>
                      <Badge 
                        className={
                          c.status === "RESOLVED" 
                            ? "gradient-green text-primary-foreground shadow-sm"
                            : c.status === "In Progress" 
                            ? "bg-blue-100 text-blue-700 shadow-sm"
                            : "bg-amber-100 text-amber-700 shadow-sm"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition"
                        onClick={() => handleView(c.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 transition"
                        onClick={() => {
                          setSelectedComplaint(c);
                          setEditData(c);
                          setEditOpen(true);
                        }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 transition"
                        onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>


                        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                          <DialogContent className="sm:max-w-xl rounded-3xl p-8 bg-background/90 backdrop-blur-xl shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                Complaint Details
                              </DialogTitle>
                            </DialogHeader>

                            {selectedComplaint && (
                              <div className="space-y-4 mt-6">
                                <div><strong>Name:</strong> {selectedComplaint.name}</div>
                                <div><strong>Type:</strong> {selectedComplaint.type}</div>
                                <div><strong>Source:</strong> {selectedComplaint.source}</div>
                                <div><strong>Date:</strong> {selectedComplaint.date}</div>
                                <div><strong>Assigned To:</strong> {selectedComplaint.assignTo}</div>
                                <div><strong>Status:</strong> {selectedComplaint.status}</div>
                                <div><strong>Description:</strong></div>
                                <div className="p-4 rounded-xl bg-muted/40 text-sm">
                                  {selectedComplaint.description}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end mt-6">
                              <Button onClick={() => setViewOpen(false)} className="rounded-xl">
                                Close
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                          <DialogContent className="sm:max-w-2xl rounded-3xl p-8 bg-background/90 backdrop-blur-xl shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                Edit Complaint
                              </DialogTitle>
                            </DialogHeader>

                            {selectedComplaint && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input value={editData.name}
                                        onChange={(e) =>
                                          setEditData({ ...editData, name: e.target.value })
                                        }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Type</Label>
                                  <Input value={editData.type}
                                        onChange={(e) =>
                                          setEditData({ ...editData, type: e.target.value })
                                        } 
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Source</Label>
                                  <Input value={editData.source}
                                        onChange={(e) =>
                                          setEditData({ ...editData, source: e.target.value })
                                        } />
                                </div>

                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select  
                                  value={editData.status}
                                  onValueChange={(value) =>
                                    setEditData({ ...editData, status: value })   // ✅ FIXED
                                  }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PENDING">Pending</SelectItem>
                                      <SelectItem value="OPEN">In Progress</SelectItem>
                                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-full space-y-2">
                                  <Label>Description</Label>
                                  <Textarea value={editData.description}
                                        onChange={(e) =>
                                          setEditData({ ...editData, description: e.target.value })
                                        } />
                                </div>

                                <div className="col-span-full flex justify-end gap-3 pt-4 border-t mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditOpen(false)}
                                    className="rounded-xl"
                                  >
                                    Cancel
                                  </Button>

                                  <Button
                                    className="rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white"
                                    onClick={handleUpdate}
                                  >
                                    Update Complaint
                                  </Button>
                                </div>

                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>
        </Card>

        <div className="flex justify-between items-center p-4">
              <Button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
              >
                  Previous
              </Button>

              <span>
                  Page {page} of {totalPages}
              </span>

              <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
              >
                  Next
              </Button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Page;
