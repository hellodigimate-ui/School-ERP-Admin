/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Eye,  Trash2, FileText, Image, Film, File, HardDrive, FolderUp, Share2, Users, Calendar, User  } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";


const typeIcons: Record<string, React.ElementType> = { PDF: FileText, Image: Image, Video: Film, Document: File };

const Page = () => {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState({
    totalContent: 0,
    uploadedThisMonth: 0,
    todayUploads: 0,
    });

    const statsData = [
    {
        label: "Total Files",
        value: stats.totalContent,
        icon: HardDrive,
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50",
        text: "text-blue-600",
    },
    {
        label: "Uploaded This Month",
        value: stats.uploadedThisMonth,
        icon: FolderUp,
        gradient: "from-green-500 to-emerald-500",
        bg: "bg-green-50",
        text: "text-green-600",
    },
    {
        label: "Today Uploads",
        value: stats.todayUploads,
        icon: Share2,
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50",
        text: "text-purple-600",
    },
    ];

    const [branches, setBranches] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    branchId: "",
    classId: "",
    file: null as File | null,
    });

const fetchStats = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/content/stats");
    setStats(res.data?.data);
  } catch {
    toast.error("Failed to load stats");
  }
};

const fetchContents = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/v1/content", {
      params: {
        title: search || undefined,
        branchId: formData.branchId || undefined,
        classId: formData.classId || undefined,
        page: 1,
        perPage: 10,
      },
    });

    console.log("CONTENT DATA:", res.data);

    setContents(res.data?.data || []);
  } catch (err) {
    toast.error("Failed to load content");
  } finally {
    setLoading(false);
  }
};

const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/branches");
    setBranches(res.data?.data || []);
  } catch {
    toast.error("Failed to load branches");
  }
};

const fetchClasses = async (branchId: string) => {
  try {
    const res = await axiosInstance.get("/api/v1/classes", {
      params: { branchId },
    });

    setClasses(res.data?.data || []);
  } catch {
    toast.error("Failed to load classes");
  }
};

useEffect(() => {
  fetchStats();
  fetchContents();
  fetchBranches();
}, []);

useEffect(() => {
  if (formData.branchId) {
    fetchClasses(formData.branchId);
  }
}, [formData.branchId]);

useEffect(() => {
  fetchContents();
}, [search]);



const handleUpload = async () => {
  if (!formData.title || !formData.description || !formData.category || !formData.branchId || !formData.file) {
    toast.error("All required fields must be filled");
    return;
  }

  try {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("branchId", formData.branchId);

    if (formData.classId) {
      data.append("classId", formData.classId);
    }

    data.append("file", formData.file);

    await axiosInstance.post("/api/v1/content", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Content uploaded successfully");

    setShowForm(false);
    fetchContents();
    fetchStats();

  } catch (err: any) {
    toast.error(err.response?.data?.message || "Upload failed");
  }
};

const handleDelete = async (id: string) => {
  try {
    await axiosInstance.delete(`/api/v1/content/${id}`);
    toast.success("Deleted successfully");
    fetchContents();
    fetchStats();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Delete failed");
  }
};

const handleDownload = (url: string) => {
  window.open(url, "_blank");
};



  return (
    <AdminLayout>
        <div className="space-y-6">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Title Section */}
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Upload className="text-white" size={22} />
                </div>

                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Upload / Share Content
                </h1>
                <p className="text-muted-foreground text-sm">
                    Upload and share study materials, documents, and media
                </p>
                </div>
            </div>

            {/* Button */}
            <Button
                onClick={() => setShowForm(!showForm)}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90"
            >
                <Upload className="h-4 w-4" />
                Upload Content
            </Button>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsData.map((s) => (
                <Card
                key={s.label}
                className="relative overflow-hidden rounded-2xl border border-border/40 shadow-md hover:shadow-2xl transition-all duration-300 group"
                >
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-gradient-to-br ${s.gradient}`} />

                <CardContent className="p-5 flex items-center justify-between relative z-10">

                    {/* Left */}
                    <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold tracking-tight">
                        {s.value}
                    </p>
                    </div>

                    {/* Icon */}
                    <div
                    className={`h-14 w-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.gradient} text-white shadow-lg group-hover:scale-110 transition`}
                    >
                    <s.icon className="h-6 w-6" />
                    </div>

                </CardContent>

                {/* Bottom Gradient Line */}
                <div className={`h-1 w-full bg-gradient-to-r ${s.gradient}`} />
                </Card>
            ))}
            </div>

            {showForm && (
                <Card className="rounded-2xl border border-border/40 shadow-xl overflow-hidden">

                    {/* ===== Header ===== */}
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Upload size={18} />
                        Upload New Content
                    </CardTitle>
                    </CardHeader>

                    {/* ===== Content ===== */}
                    <CardContent className="p-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Title */}
                        <div className="space-y-1.5">
                        <label className="text-sm font-medium">Content Title</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <Input
                            value={formData.title}
                            placeholder="Enter title..."
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="pl-9 focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                        <label className="text-sm font-medium">Content Category</label>
                        <div className="relative">
                            <File className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <Input
                            value={formData.category}
                            placeholder="e.g. Notes, Video..."
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="pl-9 focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        </div>

                        {/* Branch */}
                        <div className="space-y-1.5">
                        <label className="text-sm font-medium">Branch</label>
                        <div className="relative">
                            <Share2 className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <select
                            className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-purple-400"
                            onChange={(e) =>
                                setFormData({ ...formData, branchId: e.target.value })
                            }
                            >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                {b.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        </div>

                        {/* Class */}
                        <div className="space-y-1.5">
                        <label className="text-sm font-medium">Class</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <select
                            className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-purple-400"
                            onChange={(e) =>
                                setFormData({ ...formData, classId: e.target.value })
                            }
                            >
                            <option value="">All Classes</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                {c.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <Input
                            value={formData.description}
                            placeholder="Enter description..."
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="pl-9 focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Upload File</label>

                            <div
                            className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center hover:bg-purple-50 transition cursor-pointer"
                            onClick={() => document.getElementById("fileInput")?.click()} // trigger input click
                            >
                            <Upload className="mx-auto mb-2 text-purple-500" />
                            <p className="text-sm text-muted-foreground">
                                Click to upload or drag file
                            </p>

                            <Input
                                id="fileInput" 
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    file: e.target.files?.[0] || null,
                                })
                                }
                            />
                            </div>

                            {formData.file && (
                                <p className="text-xs text-green-600 mt-1">
                                Selected: {formData.file.name}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* ===== Actions ===== */}
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <Button
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="rounded-lg"
                        >
                        Cancel
                        </Button>

                        <Button
                        onClick={handleUpload}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 flex items-center gap-2"
                        >
                        <Upload className="h-4 w-4" />
                        Upload & Share
                        </Button>

                    </div>

                    </CardContent>
                </Card>
            )}

            <Card className="rounded-2xl border border-border/40 shadow-lg overflow-hidden">

            {/* ===== Header ===== */}
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="text-purple-500" size={18} />
                    Content List
                </CardTitle>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search content..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                </div>
            </CardHeader>

            {/* ===== Table ===== */}
            <CardContent className="p-0">
                <Table>

                {/* Header */}
                <TableHeader className="bg-muted/40">
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                    {contents
                    .filter((c) =>
                        c.title?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item) => {
                        const TypeIcon = typeIcons[item.type] || File;

                        return (
                        <TableRow
                            key={item.id}
                            className="hover:bg-muted/50 transition-all duration-200 group"
                        >

                            {/* Title */}
                            <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
                                <TypeIcon size={14} />
                                </div>
                                {item.title}
                            </div>
                            </TableCell>

                            {/* Type */}
                            <TableCell>
                            <Badge className="bg-purple-100 text-purple-600">
                                {item.type}
                            </Badge>
                            </TableCell>

                            {/* Category */}
                            <TableCell>
                            <Badge className="bg-blue-100 text-blue-600">
                                {item.category}
                            </Badge>
                            </TableCell>

                            {/* Branch */}
                            <TableCell>
                            <div className="flex items-center gap-2">
                                <Share2 size={14} className="text-emerald-500" />
                                {item.branch?.name || "N/A"}
                            </div>
                            </TableCell>

                            {/* Class */}
                            <TableCell>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-indigo-500" />
                                {item.class?.name || "All Classes"}
                            </div>
                            </TableCell>

                            {/* Uploaded By */}
                            <TableCell>
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-orange-500" />
                                {item.user?.name || "Admin"}
                            </div>
                            </TableCell>

                            {/* Date */}
                            <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar size={14} />
                                {item.createdAt?.slice(0, 10)}
                            </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                            <div className="flex justify-center gap-2">

                                {/* View */}
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-blue-100"
                                onClick={() => handleDownload(item.file)}
                                >
                                <Eye className="h-4 w-4 text-blue-500" />
                                </Button>

                                {/* Delete */}
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-red-100"
                                onClick={() => handleDelete(item.id)}
                                >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>

                            </div>
                            </TableCell>

                        </TableRow>
                        );
                    })}
                </TableBody>

                </Table>
            </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
};

export default Page;