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
import { Plus, Search, Edit, Trash2, Phone, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";


interface Call {
  id: string;
  callerName: string;
  phoneNumber: string;
  callType: "INCOMING" | "OUTGOING";
  callTime: string; 
  purpose?: string;
}

const API_BASE = "/api/v1/phone/logs";

const Page = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [stats, setStats] = useState({ totalCalls: 0, incomingCalls: 0, outgoingCalls: 0 });
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
    id: null,
    callerName: "",
    phoneNumber: "",
    callType: "",
    purpose: "",
    date: "",
    time: "",
    });


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleEdit = (call: Call) => {
        setIsEditing(true);

        const dateTime = new Date(call.callTime);

        setFormData({
            id: call.id,
            callerName: call.callerName,
            phoneNumber: call.phoneNumber,
            callType: call.callType,
            purpose: call.purpose || "",
            date: dateTime.toISOString().split("T")[0],
            time: dateTime.toTimeString().slice(0, 5),
        });

        setOpen(true);
    };

    const handleSave = async () => {
        if (!formData.callerName || !formData.phoneNumber || !formData.callType || !formData.date || !formData.time) {
            alert("Please fill all required fields");
            return;
        }

        const payload = {
            callerName: formData.callerName,
            phoneNumber: formData.phoneNumber,
            callType: formData.callType.toUpperCase(),
            callTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
            purpose: formData.purpose || "",
        };

        try {
            let res;

            if (isEditing) {
            // ✅ UPDATE
            res = await axiosInstance.put(`${API_BASE}/${formData.id}`, payload);
            } else {
            // ✅ CREATE
            res = await axiosInstance.post(API_BASE, payload);
            }

            if (res.data.success) {
            await fetchCalls();
            await fetchStats();

            setOpen(false);
            setIsEditing(false);

            setFormData({
                id: null,
                callerName: "",
                phoneNumber: "",
                callType: "",
                purpose: "",
                date: "",
                time: "",
            });
            }
        } catch (err) {
            console.error("Failed to save call", err);
        }
    };

    const fetchCalls = async () => {
        try {
            const res = await axiosInstance.get(API_BASE, {
            params: {
                page,
                perPage,
                type: filterType || undefined ,
                name: search || undefined ,
            },
            });

            if (res.data.success) {
            setCalls(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            }
        } catch (err) {
            console.error("Failed to fetch calls", err);
        }
    };



    const fetchStats = async () => {
    try {
        const res = await axiosInstance(`${API_BASE}/stats`);
        const data = res.data;
        if (data.success) setStats(data.data);
    } catch (err) {
        console.error("Failed to fetch stats", err);
    }
    };
    
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this call?")) return;
        try {
            const res = await axiosInstance.delete(`${API_BASE}/${id}`);
            const data = res.data;
            if (data.success) {
            fetchCalls();
            fetchStats();
            }
        } catch (err) {
            console.error("Failed to delete call", err);
        }
    };  

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        fetchCalls();
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [page, search, filterType]);

    useEffect(() => {
        fetchStats();
    }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-border/50 dark:bg-gray-900">
                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent dark:bg-gray-900 ">
                    Phone Call Log
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                    Record and track all incoming & outgoing phone calls
                </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-all duration-300 gap-2 rounded-xl px-5 py-2 dark:bg-gray-900">
                        <Plus className="w-4 h-4" /> Add Call
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg rounded-2xl bg-card/90 backdrop-blur-xl shadow-2xl border border-border/50 dark:bg-gray-900">
                        <DialogHeader>
                        <DialogTitle className="font-display text-xl font-semibold text-foreground">
                            Log Phone Call
                        </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-5 pt-6 dark:bg-gray-900">

                            <div className="space-y-2 dark:bg-gray-900">
                                <Label className="text-foreground/70">Name *</Label>
                                <Input className="rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/40 dark:bg-gray-900   " name="callerName" value={formData.callerName} onChange={handleInputChange} placeholder="Caller/Receiver name" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground/70">Phone *</Label>
                                <Input className="rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/40" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}  placeholder="Phone number" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground/70">Call Type *</Label>
                                <Select
                                name="callType"
                                value={formData.callType}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        callType: value,
                                    }))
                                }
                                >
                                <SelectTrigger className="rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/40">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="incoming">Incoming</SelectItem>
                                    <SelectItem value="outgoing">Outgoing</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-foreground/70">Purpose</Label>
                                <Input className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400" name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="Call purpose" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-600">Date</Label>
                                <Input type="date" name="date" value={formData.date} onChange={handleInputChange} className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400" />
                            </div>


                            <div className="space-y-2">
                                <Label className="text-gray-600">Call Time</Label>
                                <Input type="time" name="time" value={formData.time} onChange={handleInputChange} className="rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400" />
                            </div>

                    

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <Button variant="outline" className="rounded-xl hover:bg-gray-100" onClick={() => setOpen(false)}>
                                Cancel
                                </Button>
                                <Button
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
                                onClick={handleSave}
                                >
                                Save
                                </Button>
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                {[
                    { label: "Total Calls", value: stats.totalCalls, icon: Phone, bg: "bg-indigo-100 ", text: "text-indigo-600" },
                    { label: "Incoming", value: stats.incomingCalls, icon: PhoneIncoming, bg: "bg-blue-100", text: "text-blue-600" },
                    { label: "Outgoing", value: stats.outgoingCalls, icon: PhoneOutgoing, bg: "bg-emerald-100", text: "text-emerald-600" },
                    ].map(s => (
                <Card key={s.label} className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-md hover:shadow-xl transition dark:bg-gray-900">
                    <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${s.text}`}>{s.value}</p>
                    </div>

                    <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                        <s.icon className={`w-6 h-6 ${s.text}`} />
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>


            {/* Search */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl dark:bg-gray-900">
                <CardContent className="p-6">
                <div className="flex gap-4 items-end">

                    <div className="flex-1 relative dark:bg-gray-900">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 dark:bg-gray-900"
                        placeholder="Search calls..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />
                    </div>

                    <Select
                    value={filterType}
                    onValueChange={(value) => {
                        setPage(1);
                        setFilterType(value === "all" ? "" : value);
                    }}
                    >
                    <SelectTrigger className="w-[160px] rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 dark:bg-gray-900">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="INCOMING">Incoming</SelectItem>
                        <SelectItem value="OUTGOING">Outgoing</SelectItem>
                    </SelectContent>
                    </Select>

                </div>
                </CardContent>
            </Card>


            {/* Table */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden dark:bg-gray-900">
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-900">
                        <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-400">Phone</TableHead>
                        <TableHead className="font-semibold text-gray-700  dark:text-gray-400">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-400">Purpose</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-400">Date</TableHead>
                        
                        <TableHead className="font-semibold text-right text-gray-700  dark:text-gray-400">Actions</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {calls.map(c => (
                        <TableRow key={c.id} className="hover:bg-indigo-50/50 transition dark:text-gray-400">

                            <TableCell className="font-medium text-gray-800 dark:text-gray-400">
                                {c.callerName}
                            </TableCell>

                            <TableCell className="text-gray-600 dark:text-gray-400">
                                {c.phoneNumber}
                            </TableCell>

                            <TableCell>
                                <Badge
                                className={
                                    c.callType  === "INCOMING"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full px-3 flex items-center gap-1"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 flex items-center gap-1"
                                }
                                >
                                {c.callType  === "INCOMING"
                                    ? <PhoneIncoming className="w-3 h-3" />
                                    : <PhoneOutgoing className="w-3 h-3" />
                                }
                                {c.callType }
                                </Badge>
                            </TableCell>

                            <TableCell className="text-gray-600 dark:text-gray-400">
                                {c.purpose}
                            </TableCell>

                            <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(c.callTime).toLocaleDateString()} 
                            </TableCell>


                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                                    onClick={() => handleEdit(c)}
                                >
                                    <Edit className="w-4 h-4 text-indigo-600" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>

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

      </div>
    </AdminLayout>
  );
};

export default Page;
