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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-white/40">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Admission Enquiry
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Manage student admission enquiries and follow-ups
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-all duration-300 gap-2 rounded-xl px-5 py-2">
                        <Plus className="w-4 h-4" /> Add Enquiry
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl">
                        <DialogHeader>
                        <DialogTitle className="font-display text-xl font-semibold text-gray-800">
                            New Admission Enquiry
                        </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-5 pt-6">

                        <div className="space-y-2">
                            <Label className="text-gray-600">Student Name *</Label>
                            <Input
                            name="studentName"
                            value={form.studentName}
                            onChange={handleInputChange}
                            className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Enter student name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-600">Parent Name *</Label>
                            <Input
                            name="parentName"
                            value={form.parentName}
                            onChange={handleInputChange}
                            className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Enter Parent name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600">Phone *</Label>
                            <Input
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Enter phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-600">Email</Label>
                            <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Enter email"
                            />
                        </div>

                        

                        <div className="col-span-2 space-y-2">
                            <Label className="text-gray-600">Description</Label>
                            <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Enter enquiry details..."
                            />
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <Button
                            variant="outline"
                            className="rounded-xl border-gray-300 hover:bg-gray-100"
                            onClick={() => setOpen(false)}
                            >
                            Cancel
                            </Button>
                            <Button
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
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
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl">
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4 items-end">

                    <div className="flex-1 min-w-[220px]">
                        <Label className="text-xs text-gray-500">Search</Label>
                        <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            className="pl-9 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            placeholder="Search by name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </div>
                    </div>

                    

                    <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>

                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>

                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <TableHead className="font-semibold text-gray-700">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Parent`s Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Description</TableHead>
                        <TableHead className="font-semibold text-right text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {enquiries.map(e => (
                        <TableRow
                            key={e.id}
                            className="hover:bg-indigo-50/50 transition-all duration-200"
                        >
                            <TableCell className="font-medium text-gray-800">
                            {e.studentName}
                            </TableCell>
                            <TableCell className="font-medium text-gray-800">
                            {e.parentName}
                            </TableCell>

                            <TableCell className="text-gray-600">
                            {e.phone}
                            </TableCell>
                            <TableCell className="text-gray-600">
                            {e.email}
                            </TableCell>

                            

                            <TableCell className="text-gray-600">
                             {e.enquiryDate
                            ? new Date(e.enquiryDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "-"}
                            </TableCell>

                            <TableCell className="text-gray-600">
                            {e.description}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                                    onClick={() => handleView(e)}
                                    >
                                    <Eye className="w-4 h-4 text-indigo-600" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                    onClick={() => handleEdit(e)}
                                    >
                                    <Edit className="w-4 h-4 text-emerald-600" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to delete this enquiry?")) {
                                        await deleteEnquiry(e.id);
                                        fetchEnquiries(); // refresh table
                                        }
                                    }}
                                    >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>

                                </div>

                                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">

                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-5">
                                    <DialogTitle className="text-lg font-semibold">
                                        Enquiry Details
                                    </DialogTitle>
                                    <p className="text-sm opacity-90">Student enquiry information</p>
                                    </div>

                                    {selectedEnquiry && (
                                    <div className="p-6 space-y-4">

                                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm grid grid-cols-2 gap-3 text-sm">
                                        <p><strong>Student Name:</strong> {selectedEnquiry.studentName}</p>
                                        <p><strong>Parent Name:</strong> {selectedEnquiry.parentName}</p>
                                        <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                                        <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                                        <p className="font-semibold text-gray-700 mb-1">Description</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedEnquiry.description}
                                        </p>
                                        </div>

                                        <div className="flex justify-end">
                                        <Button
                                            className="bg-indigo-600 hover:bg-indigo-700"
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
                                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">

                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5">
                                    <DialogTitle className="text-lg font-semibold">
                                        Edit Enquiry
                                    </DialogTitle>
                                    <p className="text-sm opacity-90">
                                        Update enquiry information
                                    </p>
                                    </div>

                                    <div className="p-6 space-y-4">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <Input
                                        name="studentName"
                                        value={editForm.studentName}
                                        onChange={handleEditChange}
                                        placeholder="Student Name"
                                        />

                                        <Input
                                        name="parentName"
                                        value={editForm.parentName}
                                        onChange={handleEditChange}
                                        placeholder="Parent Name"
                                        />

                                        <Input
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        placeholder="Phone"
                                        />

                                        <Input
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        placeholder="Email"
                                        />

                                    </div>

                                    <Textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        placeholder="Description"
                                        className="min-h-[100px]"
                                    />

                                    <div className="flex justify-end gap-3 pt-2">

                                        <Button
                                        variant="outline"
                                        onClick={() => setEditOpen(false)}
                                        >
                                        Cancel
                                        </Button>

                                        <Button
                                        className="bg-indigo-600 hover:bg-indigo-700"
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

            <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200">
                <span className="text-gray-600 text-sm">
                    Page {pageNumber} of {totalPages}
                </span>
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageNumber}
                    onChange={(e) => setPageNumber(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-16 text-center"
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

      </div>
    </AdminLayout>
  );
};

export default Page;