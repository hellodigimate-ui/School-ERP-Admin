/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Plus, Search, Edit, Trash2, LogIn, LogOut, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";


const API_URL = "/api/v1/visitor-book";

// GET Visitors
export const getVisitors = async (page = 1, perPage = 5, name = "", date = "") => {
  const res = await axiosInstance.get(API_URL, {
    params: { page, perPage, name, date },
  });
  return res.data;
};

// ADD Visitor
export const addVisitor = async (data: any) => {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
};

// UPDATE Visitor
export const updateVisitor = async (id: string, data: any) => {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
};

// DELETE Visitor
export const deleteVisitor = async (id: string) => {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
};

// API call to get visitor stats
export const getVisitorStats = async () => {
  const res = await axiosInstance.get("/api/v1/visitor-book/stats");
  return res.data; // Expected format: { totalToday: 12, inCampus: 3, checkedOut: 9 }
};


const Page = () => {
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;
    const [editOpen, setEditOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
    const [visitors, setVisitors] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedVisitorView, setSelectedVisitorView] = useState<any>(null);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
    const [editForm, setEditForm] = useState({
    visitorName: "",
    phone: "",
    purpose: "",
    visitingTo: "",
    entryTime: "",
    exitTime: "",
    idProof: "",
    idNumber: "",
    visitDate: "",
    personToMeet:"",
    status: "",
    });

    const [form, setForm] = useState({
    visitorName: "",
    phone: "",
    purpose: "",
    visitingTo: "",
    entryTime: "",
    exitTime: "",
    idProof: "",
    idNumber: "",
    visitDate: "",
    status: "",
    });

    // Open view modal
    const handleView = (visitor: any) => {
        setSelectedVisitorView(visitor);
        setViewOpen(true);
    };

    const [stats, setStats] = useState({
    totalVisitors: 0,
    visitorsToday: 0,
    checkInVisitors: 0,
    checkOutVisitors: 0,
    });
  
    // const totalPages = Math.ceil(visitors.length / itemsPerPage);
    const paginatedVisitors = visitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );



    const entryTimestamp = form.entryTime
  ? new Date(`${form.visitDate}T${form.entryTime}`).toISOString()
  : null;

    const exitTimestamp = form.exitTime
    ? new Date(`${form.visitDate}T${form.exitTime}`).toISOString()
    : null;

const handleEdit = (visitor: any) => {
  setSelectedVisitor(visitor);

  setEditForm({
    ...visitor,
    entryTime: visitor.entryTime
      ? visitor.entryTime.slice(11, 16)
      : "",
    exitTime: visitor.exitTime
      ? visitor.exitTime.slice(11, 16)
      : "",
    visitDate: visitor.visitDate
      ? visitor.visitDate.split("T")[0]
      : "",
  });

  setEditOpen(true);
};

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

const handleEditSave = async () => {
  try {
    const updatedData = {
      ...editForm,
      entryTime: editForm.entryTime
        ? new Date(`${editForm.visitDate}T${editForm.entryTime}`).toISOString()
        : null,
      exitTime: editForm.exitTime
        ? new Date(`${editForm.visitDate}T${editForm.exitTime}`).toISOString()
        : null,
    };

    await updateVisitor(selectedVisitor.id, updatedData);

    setEditOpen(false);
    fetchVisitors();
  } catch (error) {
    console.error("Update failed", error);
  }
};

    const handleAddVisitor = async () => {
    try {
        const entryTimestamp = new Date(
        `${form.visitDate}T${form.entryTime}`
        ).toISOString();

        await addVisitor({
        ...form,
        visitDate:entryTimestamp,
        entryTime: entryTimestamp,
        exitTime: exitTimestamp,

        status: "In Campus",
        });

        setOpen(false);
        fetchVisitors();
    } catch (error) {
        console.error("Error adding visitor", error);
    }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchVisitors = async () => {
    try {
        setLoading(true);
        const res = await getVisitors(currentPage, itemsPerPage, search, filterDate);
        setVisitors(res.data);
        setTotalPages(res.pagination.totalPages);
    } catch (error) {
        console.error("Failed to fetch visitors", error);
    } finally {
        setLoading(false);
    }
    };

    const fetchStats = async () => {
    try {
        const data = await getVisitorStats();
        setStats(data.data);
    } catch (error) {
        console.error("Failed to fetch stats", error);
    }
    };


    useEffect(() => {
    fetchStats();
    }, []);

    useEffect(() => {
    fetchVisitors();
    }, [currentPage, search , filterDate]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40">
                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    Visitor Book
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                    Track all visitors entering the school premises
                </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-all duration-300 gap-2 rounded-2xl px-6 py-3 font-semibold">
                    <Plus className="w-5 h-5" /> Add Visitor
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/40 p-6">
                    <DialogHeader className="mb-4 border-b border-purple-200 pb-2">
                    <DialogTitle className="font-display text-2xl font-bold text-purple-700">
                        Register New Visitor
                    </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-6 pt-6">

                    {[
                        { label: "Visitor Name *", name: "visitorName", placeholder: "Full name" },
                        { label: "Phone *", name: "phone", placeholder: "Phone number" },
                        { label: "ID Number", name: "idNumber", placeholder: "ID number" },
                        { label: "Purpose *", name: "purpose", placeholder: "Purpose of visit" },
                        { label: "Person to Meet", name: "visitingTo", placeholder: "Name of person" },
                    ].map((field) => (
                        <div className="space-y-2" key={field.name}>
                        <Label className="text-purple-600 font-medium">{field.label}</Label>
                        <Input
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="rounded-2xl bg-purple-50/50 focus:ring-2 focus:ring-purple-400 border border-purple-100 placeholder-purple-400"
                        />
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label className="text-purple-600 font-medium">ID Proof</Label>
                        <Select
                        name="idProof"
                        value={form.idProof}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, idProof: value }))}
                        >
                        <SelectTrigger className="rounded-2xl bg-purple-50/50 focus:ring-2 focus:ring-purple-400 border border-purple-100">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                            <SelectItem value="dl">Driving License</SelectItem>
                            <SelectItem value="voter">Voter ID</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-purple-600 font-medium">Date</Label>
                        <Input
                        type="date"
                        name="visitDate"
                        value={form.visitDate}
                        onChange={handleInputChange}
                        className="rounded-2xl bg-purple-50/50 focus:ring-2 focus:ring-purple-400 border border-purple-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-purple-600 font-medium">In Time</Label>
                        <Input
                        type="time"
                        name="entryTime"
                        value={form.entryTime}
                        onChange={handleInputChange}
                        className="rounded-2xl bg-purple-50/50 focus:ring-2 focus:ring-purple-400 border border-purple-100"
                        />
                    </div>

                    <div className="col-span-2 flex justify-end gap-4 mt-6">
                        <Button
                        variant="outline"
                        className="rounded-2xl hover:bg-purple-100 transition-colors px-6 py-2 font-medium text-purple-700"
                        onClick={() => setOpen(false)}
                        >
                        Cancel
                        </Button>
                        <Button
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all px-6 py-2 font-semibold"
                        onClick={handleAddVisitor}
                        >
                        Register Visitor
                        </Button>
                    </div>

                    </div>
                </DialogContent>
                </Dialog>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
                {[
                    { label: "Today's Visitors", value: stats.visitorsToday, bg: "bg-indigo-100", text: "text-indigo-600" },
                    { label: "In Campus", value: stats.checkInVisitors, bg: "bg-green-100", text: "text-green-600" },
                    { label: "Checked Out", value: stats.checkOutVisitors, bg: "bg-emerald-100", text: "text-emerald-600" },
                    { label: "Total Visitors", value: stats.totalVisitors, bg: "bg-emerald-100", text: "text-emerald-600" },
                ].map((s) => (
                    <Card key={s.label} className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-md hover:shadow-xl transition">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${s.text}`}>{s.value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                        <span className={`text-xl font-bold ${s.text}`}>{s.value}</span>
                        </div>
                    </CardContent>
                    </Card>
                ))}
            </div>


            {/* Search */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl">
                <CardContent className="p-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1 min-w-[220px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                        placeholder="Search visitors..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // reset to first page on new search
                        }}  
                    />
                    </div>
                    
                </div>
                </CardContent>
            </Card>


            {/* Table */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <TableHead className="font-semibold text-gray-700">Visitor</TableHead>
                        <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                        <TableHead className="font-semibold text-gray-700">Purpose</TableHead>
                        <TableHead className="font-semibold text-gray-700">To Meet</TableHead>
                        <TableHead className="font-semibold text-gray-700">In Time</TableHead>
                        <TableHead className="font-semibold text-gray-700">Out Time</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-right text-gray-700">Actions</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {visitors.map(v => (
                        <TableRow key={v.id} className="hover:bg-indigo-50/50 transition">

                        <TableCell className="font-medium text-gray-800">
                            {v.visitorName}
                        </TableCell>

                        <TableCell className="text-gray-600">
                            {v.phone}
                        </TableCell>

                        <TableCell className="text-gray-600">
                            {v.purpose}
                        </TableCell>

                        <TableCell className="text-gray-600">
                            {v.visitingTo}
                        </TableCell>

                        <TableCell>
                            {v.entryTime && v.entryTime !== "-" ? (
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                <LogIn className="w-3 h-3" />
                                {new Date(v.entryTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                </span>
                            ) : (
                                "-"
                            )}
                        </TableCell>

                        <TableCell>
                            {v?.exitTime && v?.exitTime !== "-" ? (
                                <span className="flex items-center gap-1 text-red-500 font-medium">
                                <LogOut className="w-3 h-3" />
                                {v?.exitTime?.slice(11,16)??"-"}
                                </span>
                            ) : (
                                "-"
                            )}
                        </TableCell>

                        <TableCell>
                            <Badge
                            className={
                                !v.exitTime
                                ? "bg-green-100 text-green-700 hover:bg-green-100 rounded-full px-3"
                                : "bg-gray-100 text-gray-600 rounded-full px-3"
                            }
                            >
                            {v.exitTime ?"Checked Out":"In Campus" }
                            </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                            
                                <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                                onClick={() => handleView(v)}
                                >
                                    <Eye className="w-4 h-4 text-indigo-600" />
                                </Button>

                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                                onClick={() => handleEdit(v)}
                                >
                                    <Edit className="w-4 h-4 text-indigo-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                onClick={async () => {
                                    await deleteVisitor(v.id);
                                    fetchVisitors();
                                }}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>

                            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                            <DialogContent className="max-w-xl rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
                                <DialogHeader className="mb-6 border-b border-indigo-200 pb-3 sticky top-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 z-10">
                                <DialogTitle className="text-2xl font-bold text-indigo-800">
                                    View Enquiry
                                </DialogTitle>
                                </DialogHeader>

                                {selectedVisitorView && (
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                    { label: "Visitor Name", value: selectedVisitorView.visitorName, color: "bg-indigo-100" },
                                    { label: "Phone", value: selectedVisitorView.phone, color: "bg-purple-100" },
                                    { label: "ID Proof", value: selectedVisitorView.idProof, color: "bg-pink-100" },
                                    { label: "ID Number", value: selectedVisitorView.idNumber, color: "bg-yellow-100" },
                                    { label: "Purpose", value: selectedVisitorView.purpose, color: "bg-green-100" },
                                    { label: "Person to Meet", value: selectedVisitorView.visitingTo, color: "bg-teal-100" },
                                    { label: "Date", value: selectedVisitorView.visitDate ? new Date(selectedVisitorView.visitDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-", color: "bg-indigo-50" },
                                    { label: "In Time", value: selectedVisitorView.entryTime.slice(11,16), color: "bg-purple-50" },
                                    { label: "Out Time", value: selectedVisitorView?.exitTime?.slice(11,16) ?? "-", color: "bg-pink-50" },
                                    { label: "Status", value: selectedVisitorView?.status ?? "-", color: "bg-yellow-50" },
                                    ].map((item) => (
                                    <div
                                        key={item.label}
                                        className={`${item.color} rounded-2xl p-4 shadow-md flex justify-between items-center`}
                                    >
                                        <span className="font-semibold text-gray-700">{item.label}:</span>
                                        <span className="text-gray-800 font-medium">{item.value}</span>
                                    </div>
                                    ))}
                                </div>
                                )}

                                <div className="flex justify-end mt-6">
                                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-2xl px-6 py-2 font-medium" onClick={() => setViewOpen(false)}>
                                    Close
                                </Button>
                                </div>
                            </DialogContent>
                            </Dialog>

                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogContent className="max-w-2xl rounded-3xl bg-gradient-to-br from-pink-50 via-white to-yellow-50 shadow-xl p-6">
                                <DialogHeader className="mb-4 border-b border-pink-300 pb-2">
                                <DialogTitle className="text-2xl font-bold text-pink-700">Edit Visitor</DialogTitle>
                                </DialogHeader>

                                {selectedVisitor && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {["visitorName", "phone", "purpose", "visitingTo"].map((field) => (
                                    <Input
                                        key={field}
                                        name={field}
                                        value={editForm[field]}
                                        onChange={handleEditChange}
                                        placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-300"
                                    />
                                    ))}

                                    <Input
                                    type="time"
                                    name="entryTime"
                                    value={editForm.entryTime}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-300"
                                    />
                                    <Input
                                    type="time"
                                    name="exitTime"
                                    value={editForm.exitTime === "-" ? "" : editForm.exitTime}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-300"
                                    />
                                    <Input
                                    type="date"
                                    name="visitDate"
                                    value={editForm.visitDate}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-300 col-span-2"
                                    />
                                </div>
                                )}

                                <div className="flex justify-end gap-3 mt-6">
                                <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors rounded-lg px-6 py-2" onClick={() => setEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="bg-pink-600 text-white hover:bg-pink-700 transition-colors rounded-lg px-6 py-2" onClick={handleEditSave}>
                                    Save Changes
                                </Button>
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

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl">
                <CardContent className="p-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                    </span>

                    <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                    >
                        Next
                    </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;