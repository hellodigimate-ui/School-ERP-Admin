/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";


const BASE_URL = "/api/v1/admission-enquiries";

export const getEnquiries = async (params?: { name?: string; page?: number; perPage?: number }) => {
  const response = await axiosInstance.get(BASE_URL, { params });
  return response.data;
};

export const getEnquiryById = async (id: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createEnquiry = async (data: {
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  description: string;
}) => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

export const updateEnquiry = async (id: number, data: {
  studentName?: string;
  parentName?: string;
  phone?: string;
  email?: string;
  description?: string;
}) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteEnquiry = async (id: number) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const getEnquiryByReport = async (id: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/report`);
  return response.data;
};



const Page = () => {
    const [open, setOpen] = useState(false);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const perPage = 10;

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        studentName: "",
        parentName: "",
        phone: "",
        email: "",
        description: "",
    });

// Open view modal
const handleView = (enquiry: any) => {
setSelectedEnquiry(enquiry);
setViewOpen(true);
};

// Open edit modal
const handleEdit = (enquiry: any) => {
setSelectedEnquiry(enquiry);
setEditForm({
    studentName: enquiry.studentName,
    parentName: enquiry.parentName,
    phone: enquiry.phone,
    email: enquiry.email,
    description: enquiry.description,
});
setEditOpen(true);
};

// Handle changes in edit form
const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

// Save edited enquiry
const handleEditSave = async () => {
try {
    await updateEnquiry(selectedEnquiry.id, editForm); // call API
    setEditOpen(false);
    fetchEnquiries(); // refresh table
} catch (error) {
    console.error(error);
}
};



const [form, setForm] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    description: "",
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSave = async () => {
  try {
    await createEnquiry(form);
    setOpen(false);
    fetchEnquiries(); // refresh table
  } catch (error) {
    console.error(error);
  }
};

const handleDownload = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/admission-enquiries/report", {
      responseType: "blob", // important to get the file as a blob
    });

    // Create a temporary anchor tag
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admission_enquiries.xlsx";

    // Append to body and trigger click
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
    alert("Failed to download report");
  }
};


const fetchEnquiries = async () => {
    setLoading(true);
    try {
        const data = await getEnquiries({ 
            name: searchTerm, 
            page: pageNumber, 
            perPage 
        });
        setEnquiries(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
fetchEnquiries();
}, [searchTerm, pageNumber]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div className="relative flex flex-col md:flex-row md:items-center 
                        justify-between gap-6 mb-8 p-6 rounded-3xl 
                        bg-gradient-to-r from-primary/10 via-background to-pink-500/10 
                        border shadow-xl overflow-hidden">

        {/* Decorative Glow Effects */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full opacity-40"></div>

        {/* Header Section */}
        <div className="relative">
            <h1 className="text-3xl font-bold font-display tracking-tight 
                        bg-gradient-to-r from-primary to-pink-500 
                        bg-clip-text text-transparent">
            Admission Enquiry
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
            Manage student admission enquiries and follow-ups
            </p>
        </div>

        {/* Add Button */}
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button className="relative gap-2 px-6 h-11 rounded-xl 
                                bg-gradient-to-r from-primary to-pink-500 
                                hover:from-primary/90 hover:to-pink-500/90
                                text-white shadow-lg hover:shadow-xl 
                                hover:scale-[1.04] transition-all duration-200">
                <Plus className="w-4 h-4" />
                {open ? "Edit Enquiry" : "Add Enquiry"}
            </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl rounded-3xl p-8 
                        bg-background/80 backdrop-blur-xl 
                        border shadow-2xl">

            <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-semibold 
                                        bg-gradient-to-r from-primary to-pink-500 
                                        bg-clip-text text-transparent">
                {open ? "Edit Admission Enquiry" : "Add Admission Enquiry"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                Fill in the details of the admission enquiry
                </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

                {/* Student Name */}
                <div className="space-y-2">
                <Label>Student Name *</Label>
                <Input
                    placeholder="Enter student name"
                    name="studentName"
                    value={form.studentName}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            transition-all"
                />
                </div>

                {/* Parent Name */}
                <div className="space-y-2">
                <Label>Parent Name *</Label>
                <Input
                    placeholder="Enter parent name"
                    name="parentName"
                    value={form.parentName}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            transition-all"
                />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                    placeholder="Enter phone number"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            transition-all"
                />
                </div>

                {/* Email */}
                <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            transition-all"
                />
                </div>

                {/* Description */}
                <div className="col-span-full space-y-2">
                <Label>Description</Label>
                <Textarea
                    placeholder="Enter enquiry details..."
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="rounded-xl min-h-[110px] bg-muted/40 
                            border-primary/20 focus-visible:ring-2 
                            focus-visible:ring-primary/40"
                />
                </div>

                {/* Actions */}
                <div className="col-span-full flex justify-end gap-3 pt-6 border-t mt-4">
                <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="rounded-xl"
                >
                Cancel
                </Button>
                <Button
                    className="bg-gradient-to-r from-primary to-pink-500 
                            hover:from-primary/90 hover:to-pink-500/90
                            text-white rounded-xl shadow-lg hover:shadow-xl
                            transition-all duration-200"
                    onClick={handleSave}
                >
                Save Enquiry
                </Button>
                </div>
            </div>
            </DialogContent>
        </Dialog>
        </div>

            {/* Search & Filter */}
            <Card className="border-0 shadow-md bg-card rounded-2xl">
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4 items-end">

                    <div className="flex-1 min-w-[220px]">
                        <Label className="text-xs text-muted-foreground">Search</Label>
                        <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-9 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/40"
                            placeholder="Search by name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </div>
                    </div>

                    

                    <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-border hover:bg-secondary transition"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>

                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-md bg-card rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>

                    <TableHeader>
                        <TableRow className="bg-secondary hover:bg-secondary">
                        <TableHead className="font-semibold text-foreground">Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Parent`s Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Phone</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Date</TableHead>
                        <TableHead className="font-semibold text-foreground">Description</TableHead>
                        <TableHead className="font-semibold text-right text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {enquiries.map(e => (
                        <TableRow
                            key={e.id}
                            className="hover:bg-accent/10 transition-all duration-200 border-border"
                        >
                            <TableCell className="font-medium text-foreground">
                            {e.studentName}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                            {e.parentName}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                            {e.phone}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                            {e.email}
                            </TableCell>

                            

                            <TableCell className="text-muted-foreground">
                             {e.enquiryDate
                            ? new Date(e.enquiryDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "-"}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                            {e.description}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-accent/20 transition"
                                    onClick={() => handleView(e)}
                                    >
                                    <Eye className="w-4 h-4 text-accent" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-success/20 transition"
                                    onClick={() => handleEdit(e)}
                                    >
                                    <Edit className="w-4 h-4 text-success" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-destructive/20 transition"
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to delete this enquiry?")) {
                                        await deleteEnquiry(e.id);
                                        fetchEnquiries(); // refresh table
                                        }
                                    }}
                                    >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>

                                </div>

                                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl bg-background border shadow-2xl">

                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-primary to-pink-500 text-primary-foreground p-5">
                                    <DialogTitle className="text-lg font-semibold">
                                        Enquiry Details
                                    </DialogTitle>
                                    <p className="text-sm opacity-90">Student enquiry information</p>
                                    </div>

                                    {selectedEnquiry && (
                                    <div className="p-6 space-y-4">

                                        <div className="bg-secondary p-4 rounded-xl shadow-sm grid grid-cols-2 gap-3 text-sm">
                                        <p><strong className="text-foreground">Student Name:</strong> <span className="text-muted-foreground">{selectedEnquiry.studentName}</span></p>
                                        <p><strong className="text-foreground">Parent Name:</strong> <span className="text-muted-foreground">{selectedEnquiry.parentName}</span></p>
                                        <p><strong className="text-foreground">Phone:</strong> <span className="text-muted-foreground">{selectedEnquiry.phone}</span></p>
                                        <p><strong className="text-foreground">Email:</strong> <span className="text-muted-foreground">{selectedEnquiry.email}</span></p>
                                        </div>

                                        <div className="bg-accent/10 p-4 rounded-xl shadow-sm border border-accent/20">
                                        <p className="font-semibold text-foreground mb-1">Description</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedEnquiry.description}
                                        </p>
                                        </div>

                                        <div className="flex justify-end">
                                        <Button
                                            className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white"
                                            onClick={() => setViewOpen(false)}
                                        >
                                            Close
                                        </Button>
                                        </div>

                                    </div>
                                    )}

                                </DialogContent>
                                </Dialog>

                                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                <DialogContent className="max-w-2xl rounded-3xl p-8 
                                        bg-background/80 backdrop-blur-xl 
                                        border shadow-2xl">

                                    {/* Header */}
                                    <DialogHeader className="space-y-2">
                                    <DialogTitle className="text-2xl font-semibold 
                                                    bg-gradient-to-r from-primary to-pink-500 
                                                    bg-clip-text text-transparent">
                                        Edit Admission Enquiry
                                    </DialogTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Update enquiry information
                                    </p>
                                    </DialogHeader>

                                    <div className="space-y-4 pt-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="space-y-2">
                                        <Label>Student Name</Label>
                                        <Input
                                        name="studentName"
                                        value={editForm.studentName}
                                        onChange={handleEditChange}
                                        placeholder="Student Name"
                                        className="h-11 rounded-xl bg-muted/40 border-primary/20
                                                focus-visible:ring-2 focus-visible:ring-primary/40"
                                        />
                                        </div>

                                        <div className="space-y-2">
                                        <Label>Parent Name</Label>
                                        <Input
                                        name="parentName"
                                        value={editForm.parentName}
                                        onChange={handleEditChange}
                                        placeholder="Parent Name"
                                        className="h-11 rounded-xl bg-muted/40 border-primary/20
                                                focus-visible:ring-2 focus-visible:ring-primary/40"
                                        />
                                        </div>

                                        <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        placeholder="Phone"
                                        className="h-11 rounded-xl bg-muted/40 border-primary/20
                                                focus-visible:ring-2 focus-visible:ring-primary/40"
                                        />
                                        </div>

                                        <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        placeholder="Email"
                                        className="h-11 rounded-xl bg-muted/40 border-primary/20
                                                focus-visible:ring-2 focus-visible:ring-primary/40"
                                        />
                                        </div>

                                    </div>

                                    <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        placeholder="Description"
                                        className="rounded-xl min-h-[100px] bg-muted/40 
                                                border-primary/20 focus-visible:ring-2 
                                                focus-visible:ring-primary/40"
                                    />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t mt-4">

                                        <Button
                                        variant="outline"
                                        onClick={() => setEditOpen(false)}
                                        className="rounded-xl"
                                        >
                                        Cancel
                                        </Button>

                                        <Button
                                        className="bg-gradient-to-r from-primary to-pink-500 
                                                hover:from-primary/90 hover:to-pink-500/90
                                                text-white rounded-xl shadow-lg hover:shadow-xl
                                                transition-all duration-200"
                                        onClick={handleEditSave}
                                        >
                                        Save Changes
                                        </Button>

                                    </div>

                                    </div>

                                </DialogContent>
                                </Dialog>


                            </TableCell>

                        </TableRow>
                        ))}
                    </TableBody>

                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center p-4 bg-card border-t border-border rounded-b-2xl">
                <span className="text-muted-foreground text-sm">
                    Page {pageNumber} of {totalPages}
                </span>
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageNumber}
                    onChange={(e) => setPageNumber(Number(e.target.value))}
                    className="border border-border rounded px-2 py-1 w-16 text-center bg-background text-foreground"
                />
                <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    >
                    Previous
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === totalPages}
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                    >
                    Next
                    </Button>
                </div>
            </div>

      </div>
    </AdminLayout>
  );
};

export default Page;