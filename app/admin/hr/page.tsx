/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react";

export const dynamic = 'force-dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, ClipboardCheck, FilePlus, Star } from "lucide-react"
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
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCog,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Download
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import jsPDF from "jspdf";
import { toast } from "sonner";


// --- Mock Data ---

const staffAttendanceData = [
  { id: 1, name: "Rajesh Kumar", department: "Mathematics", date: "2026-02-15", status: "Present", checkIn: "08:00 AM", checkOut: "03:30 PM" },
  { id: 2, name: "Sunita Verma", department: "Science", date: "2026-02-15", status: "Present", checkIn: "07:55 AM", checkOut: "03:45 PM" },
  { id: 3, name: "Amit Singh", department: "Accounts", date: "2026-02-15", status: "Present", checkIn: "09:00 AM", checkOut: "05:00 PM" },
  { id: 4, name: "Pooja Sharma", department: "Library", date: "2026-02-15", status: "Absent", checkIn: "-", checkOut: "-" },
  { id: 5, name: "Vikram Joshi", department: "English", date: "2026-02-15", status: "On Leave", checkIn: "-", checkOut: "-" },
  { id: 6, name: "Neha Gupta", department: "Front Office", date: "2026-02-15", status: "Late", checkIn: "09:30 AM", checkOut: "04:00 PM" },
];

const teacherRatings = [
  { id: 1, name: "Rajesh Kumar", department: "Mathematics", rating: 4.5, totalReviews: 120, punctuality: 4.8, teaching: 4.6, behavior: 4.2, knowledge: 4.5 },
  { id: 2, name: "Sunita Verma", department: "Science", rating: 4.8, totalReviews: 150, punctuality: 4.9, teaching: 4.9, behavior: 4.7, knowledge: 4.8 },
  { id: 3, name: "Vikram Joshi", department: "English", rating: 4.2, totalReviews: 85, punctuality: 4.0, teaching: 4.3, behavior: 4.4, knowledge: 4.1 },
];


// --- Component ---

function HRPage({ highlightId }: { highlightId: string | null }) {
  const [activeTab, setActiveTab] = useState("staff-directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch,setSelectedBranch] = useState("")
  const [branchList, setBranchList] = useState<any[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [attendanceRoleFilter, setAttendanceRoleFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [staffData, setStaffData] = useState<any[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState<any>(null);
  const [attendanceDetailOpen, setAttendanceDetailOpen] = useState(false);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  // const searchParams = useSearchParams();
  // const highlightId = searchParams.get('id');

  useEffect(() => {
    if (highlightId) {
      // Scroll to the highlighted row
      const element = document.getElementById(`staff-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightId, staffData]);

  const downloadAttendancePDF = () => {
    if (!selectedAttendanceRecord) return;
    
    const empName = selectedAttendanceRecord.user?.name || "Unknown";
    const empEmail = selectedAttendanceRecord.user?.email || "N/A";
    const empCode = selectedAttendanceRecord.empCode || "N/A";
    const empRole = selectedAttendanceRecord.user?.role || "Unknown";
    
    const empRecords = attendanceData.filter(
      a => a.user?.email === empEmail
    );
    
    const presentCount = empRecords.filter(a => a.status === "P").length;
    const absentCount = empRecords.filter(a => a.status === "A").length;
    const leaveCount = empRecords.filter(a => a.status === "L").length;
    const lateCount = empRecords.filter(a => a.status === "LT").length;
    const totalDays = empRecords.length;
    const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0;
    
    const doc = new jsPDF();
    let yPos = 10;
    
    // Header
    doc.setFontSize(16);
    doc.text("Staff Attendance Report", 10, yPos);
    yPos += 10;
    
    // Employee Info
    doc.setFontSize(11);
    doc.text(`Employee Name: ${empName}`, 10, yPos);
    yPos += 7;
    doc.text(`Employee Code: ${empCode}`, 10, yPos);
    yPos += 7;
    doc.text(`Role: ${empRole}`, 10, yPos);
    yPos += 7;
    doc.text(`Email: ${empEmail}`, 10, yPos);
    yPos += 10;
    
    // Statistics
    doc.setFontSize(12);
    doc.text("Attendance Summary:", 10, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.text(`Total Present: ${presentCount}`, 10, yPos);
    yPos += 6;
    doc.text(`Total Absent: ${absentCount}`, 10, yPos);
    yPos += 6;
    doc.text(`Total Leave: ${leaveCount}`, 10, yPos);
    yPos += 6;
    doc.text(`Total Late: ${lateCount}`, 10, yPos);
    yPos += 6;
    doc.text(`Total Records: ${totalDays}`, 10, yPos);
    yPos += 6;
    doc.text(`Attendance Percentage: ${percentage}%`, 10, yPos);
    
    // Add date
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 280);
    
    doc.save(`${empName}_Attendance_Report.pdf`);
  };

  const [loadingStaff, setLoadingStaff] = useState(false)

const [formData, setFormData] = useState<any>({
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  designation: "",
  branchId: "",
  qualification: "",
  experienceYears: 0,
  joinDate: "",
  address: "",
  file: null,
})


  const statusColor = (s: string) => {
    switch (s) {
      case "Active": case "Present": case "Approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "On Leave": case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Absent": case "Rejected": case "Inactive": return "bg-red-100 text-red-700 border-red-200";
      case "Late": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-muted text-muted-foreground";
    }
  };



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
    ));
  };


const fetchStaff = async () => {

  try {

    setLoadingStaff(true)

    const res = await axiosInstance.get("/api/v1/staff", {
      params: {
        page: 1,
        perPage: 50,
        name: searchTerm || undefined,
        branchId: selectedBranch || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      },
    })

    setStaffData(res.data?.data || [])

  } catch (error) {

    toast.error("Failed to load staff")

  } finally {

    setLoadingStaff(false)

  }
}

const handleCreateStaff = async () => {

  try {

    const fd = new FormData()

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        fd.append(key, formData[key])
      }
    })

    await axiosInstance.post("/api/v1/staff", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    toast.success("Staff created successfully")

    fetchStaff()

  } catch (error) {

    toast.error("Failed to create staff")

  }
}


const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/branches", {
      params: { page: 1, perPage: 100 },
    });

    const branches = res.data.data || []
    setBranchList(branches);

    // Set default branch if not selected
    if(branches.length > 0 && !selectedBranch){
      setSelectedBranch(branches[0].id)
    }


  } catch (error) {
    toast.error("Failed to load branches");
  }
};

const handleUpdateStaff = async () => {

  try {

    await axiosInstance.put(`/api/v1/staff/${editData.id}`, {
      name: editData.name,
      designation: editData.designation,
      phone: editData.phone,
      address: editData.address,
      isActive: editData.status === "Active",
    })

    toast.success("Staff updated")

    fetchStaff()

    setEditOpen(false)

  } catch (error) {

    toast.error("Update failed")

  }
}

const handleDeleteStaff = async (id: string) => {

  try {

    await axiosInstance.delete(`/api/v1/staff/${id}`)

    toast.success("Staff deleted")

    fetchStaff()

  } catch (error) {

    toast.error("Delete failed")

  }
}

useEffect(()=>{
  fetchBranches();
  fetchAttendance();
}, [])

useEffect(() => {

  fetchStaff()

}, [selectedBranch, roleFilter, searchTerm])

const fetchAttendance = async () => {
  try {
    setLoadingAttendance(true);
    let url = "/api/v1/attendance/external";
    const params = new URLSearchParams();
    
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };
    
    // Always append dates (even if empty, backend will handle)
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    
    if (formattedFromDate) params.append("fromDate", formattedFromDate);
    if (formattedToDate) params.append("toDate", formattedToDate);
    
    // Build URL with params
    if (Array.from(params).length > 0) {
      url += "?" + params.toString();
    }
    
    console.log("Request URL:", url);
    console.log("From Date:", formattedFromDate);
    console.log("To Date:", formattedToDate);
    
    const res = await axiosInstance.get(url);
    if (res.data?.success && Array.isArray(res.data.data)) {
      setAttendanceData(res.data.data);
      console.log("Data fetched successfully:", res.data.data);
    } else if (Array.isArray(res.data?.data)) {
      setAttendanceData(res.data.data);
      console.log("Data fetched successfully:", res.data.data);
    } else {
      setAttendanceData([]);
      console.log("No data returned or error:", res.data);
    }
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    setAttendanceData([]);
  } finally {
    setLoadingAttendance(false);
  }
};

  return (
    <AdminLayout>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">

        {/* Decorative background blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl"></div>

        <div className="relative flex flex-wrap items-center justify-between gap-6">

          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserCog size={30} className="text-yellow-300" />
              Human Resource
            </h1>

            <p className="text-white/80 mt-2 max-w-xl">
              Manage staff directory, attendance, leave requests, departments and designations in one place.
            </p>
          </div>

        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex flex-wrap h-auto gap-2 p-2 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border shadow-sm">

          <TabsTrigger
            value="staff-directory"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all 
            data-[state=active]:bg-indigo-500 data-[state=active]:text-white 
            hover:bg-indigo-100"
          >
            <Users size={16} />
            Staff Directory
          </TabsTrigger>

          <TabsTrigger
            value="staff-attendance"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            data-[state=active]:bg-green-500 data-[state=active]:text-white
            hover:bg-green-100"
          >
            <CalendarCheck size={16} />
            Staff Attendance
          </TabsTrigger>

          <TabsTrigger
            value="teacher-rating"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
            data-[state=active]:bg-pink-500 data-[state=active]:text-white
            hover:bg-pink-100"
          >
            <Star size={16} />
            Teacher Rating
          </TabsTrigger>

        </TabsList>

        {/* ===== Staff Directory ===== */}
        <TabsContent value="staff-directory">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-foreground">Staff Directory</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  size={16} 
                  />

                  <Input placeholder="Search staff name..." 
                  className="pl-9 w-56" 
                  value={searchTerm} 
                  onChange={e => 
                    setSearchTerm(e.target.value)
                  } 
                  />
                </div>

                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchList.map((branch: any) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                    <SelectItem value="LIBRAIAN">Librarian</SelectItem>
                    <SelectItem value="SCANNER">Scanner</SelectItem>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700">
                      <Plus size={16} className="mr-1" /> Add Staff
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-gradient-to-br from-white to-indigo-50 shadow-xl">

                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                        👤 Add New Staff Member
                      </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                      {/* Branch */}
                      <div className="flex flex-col gap-1">
                        <Label className="text-sm text-gray-600">Branch *</Label>
                        <Select 
                          value={formData.branchId}
                          onValueChange={(val) =>
                            setFormData({ ...formData, branchId: val })
                          }
                        >
                          <SelectTrigger className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branchList.map((branch: any) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Role */}
                      <div className="flex flex-col gap-1">
                        <Label>Role *</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(val) =>
                            setFormData({ ...formData, role: val })
                          }
                        >
                          <SelectTrigger className="rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                            <SelectItem value="LIBRAIAN">Librarian</SelectItem>
                            <SelectItem value="SCANNER">Scanner</SelectItem>
                            <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                            <SelectItem value="COACH">Coach</SelectItem>
                            <SelectItem value="DRIVER">Driver</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Designation */}
                      <div className="flex flex-col gap-1">
                        <Label>Designation</Label>
                        <Input
                          placeholder="Designation"
                          onChange={(e) =>
                            setFormData({ ...formData, designation: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Qualification */}
                      <div className="flex flex-col gap-1">
                        <Label>Qualification</Label>
                        <Input
                          placeholder="e.g. M.Sc., B.Ed."
                          onChange={(e) =>
                            setFormData({ ...formData, qualification: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1">
                        <Label>Phone *</Label>
                        <Input
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <Label>Email *</Label>
                        <Input
                          placeholder="Enter email"
                          type="email"
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Password */}
                      <div className="flex flex-col gap-1">
                        <Label>Password *</Label>
                        <Input
                          placeholder="Enter password"
                          type="password"
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Join Date */}
                      <div className="flex flex-col gap-1">
                        <Label>Date of Joining</Label>
                        <Input
                          type="date"
                          onChange={(e) => {
                            const date = e.target.value;
                            setFormData({
                              ...formData,
                              joinDate: date.concat("T10:00:00.000Z"),
                            });
                          }}
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Experience */}
                      <div className="flex flex-col gap-1">
                        <Label>Experience</Label>
                        <Input
                          placeholder="e.g. 5 years"
                          onChange={(e) =>
                            setFormData({ ...formData, experienceYears: e.target.value })
                          }
                          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2 flex flex-col gap-1">
                        <Label>Address *</Label>
                        <Textarea
                          placeholder="Enter full address"
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="rounded-xl min-h-[100px] focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Photo */}
                      <div className="md:col-span-2 flex flex-col gap-1">
                        <Label>Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              file: e.target.files?.[0],
                            })
                          }
                          className="rounded-xl"
                        />
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                      <DialogClose>
                        <Button variant="outline" className="rounded-xl">
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        onClick={handleCreateStaff}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700"
                      >
                        💾 Save Staff
                      </Button>
                    </div>

                  </DialogContent>
                </Dialog>

              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData
                  ?.filter(s => (departmentFilter === "all" || s?.department === departmentFilter) && (roleFilter === "all" || s?.role === roleFilter) && (searchTerm === "" || s?.name?.toLowerCase().includes(searchTerm.toLowerCase())))
                  .map(staff => (
                    <TableRow key={staff.id} id={`staff-${staff.userId}`} className={staff.userId === highlightId ? "bg-green-100 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-900" : ""}>
                      
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.designation}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell>{new Date(staff.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(staff.isActive ? "true" : "false")}>
                          {staff.isActive ? "Active" : "InActive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedStaff(staff)
                              setViewOpen(true)
                            }}
                          >
                            <Eye size={14} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                           onClick={() => {
                            setEditOpen(true)
                            setEditData(staff)
                           }}
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteStaff(staff.id)}
                          >
                            <Trash2 size={14} />
                          </Button>

                        </div>

                      <Dialog  open={viewOpen} onOpenChange={setViewOpen}  >

                        {/* Content */}
                        <DialogContent className="z-50 max-w-2xl p-6 rounded-2xl bg-white shadow-xl">

                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                              👤 Staff Details
                            </DialogTitle>
                          </DialogHeader>

                          {selectedStaff && (
                            <div className="space-y-6 mt-4">

                              {/* Profile Section */}
                              <div className="flex flex-col items-center gap-3">
                                {selectedStaff.photo ? (
                                  <img
                                    src={selectedStaff.photo}
                                    alt={selectedStaff.name}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                                  />
                                ) : (
                                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                    {selectedStaff.name?.charAt(0)}
                                  </div>
                                )}

                                <h2 className="text-xl font-semibold text-gray-800">
                                  {selectedStaff.name}
                                </h2>

                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    selectedStaff.isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {selectedStaff.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>

                              {/* Info Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                  <p className="text-xs text-gray-500">Role</p>
                                  <p className="font-medium text-gray-800">{selectedStaff.role}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                  <p className="text-xs text-gray-500">Designation</p>
                                  <p className="font-medium text-gray-800">{selectedStaff.designation}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                  <p className="text-xs text-gray-500">Phone</p>
                                  <p className="font-medium text-gray-800">{selectedStaff.phone}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p className="font-medium text-gray-800 break-all">
                                    {selectedStaff.email}
                                  </p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                  <p className="text-xs text-gray-500">Join Date</p>
                                  <p className="font-medium text-gray-800">
                                    {new Date(selectedStaff.joinDate).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border md:col-span-2">
                                  <p className="text-xs text-gray-500">Address</p>
                                  <p className="font-medium text-gray-800">
                                    {selectedStaff.address}
                                  </p>
                                </div>

                              </div>

                            </div>
                          )}

                        </DialogContent>
                      </Dialog>

                      <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogContent className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 shadow-xl">

                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                              ✏️ Edit Staff
                            </DialogTitle>
                          </DialogHeader>

                          {editData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                              {/* Name */}
                              <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">Name</Label>
                                <Input
                                  value={editData.name}
                                  onChange={(e) =>
                                    setEditData({ ...editData, name: e.target.value })
                                  }
                                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                              {/* Designation */}
                              <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">Designation</Label>
                                <Input
                                  value={editData.designation}
                                  onChange={(e) =>
                                    setEditData({ ...editData, designation: e.target.value })
                                  }
                                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                              {/* Phone */}
                              <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">Phone</Label>
                                <Input
                                  value={editData.phone}
                                  onChange={(e) =>
                                    setEditData({ ...editData, phone: e.target.value })
                                  }
                                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                              {/* Status */}
                              <div className="flex flex-col gap-1">
                                <Label className="text-sm text-gray-600">Status</Label>
                                <Select
                                  value={editData.status}
                                  onValueChange={(value) =>
                                    setEditData({ ...editData, status: value })
                                  }
                                >
                                  <SelectTrigger className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">🟢 Active</SelectItem>
                                    <SelectItem value="InActive">🔴 InActive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Address */}
                              <div className="flex flex-col gap-1 md:col-span-2">
                                <Label className="text-sm text-gray-600">Address</Label>
                                <Textarea
                                  value={editData.address}
                                  onChange={(e) =>
                                    setEditData({ ...editData, address: e.target.value })
                                  }
                                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                />
                              </div>

                            </div>
                          )}

                          {/* Footer Button */}
                          <div className="flex justify-end mt-6">
                            <Button
                              onClick={handleUpdateStaff}
                              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 
                              hover:from-indigo-700 hover:to-blue-700 text-white shadow-md transition-all"
                            >
                              💾 Save Changes
                            </Button>
                          </div>

                        </DialogContent>
                      </Dialog>

                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>


        {/* ===== Staff Attendance ===== */}
        <TabsContent value="staff-attendance">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-foreground">Staff Attendance</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <label>From</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="From Date"
                  className="w-40"
                />
                  <label>To</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="To Date"
                  className="w-40"
                />
                <Button onClick={fetchAttendance} disabled={loadingAttendance} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {loadingAttendance ? "Applying..." : "Apply Filter"}
                </Button>
                <Select value={attendanceRoleFilter} onValueChange={setAttendanceRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                    <SelectItem value="LIBRAIAN">Librarian</SelectItem>
                    <SelectItem value="SCANNER">Scanner</SelectItem>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="COACH">Coach</SelectItem>
                    <SelectItem value="DRIVER">Driver</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchAttendance} disabled={loadingAttendance} size="sm">
                  {loadingAttendance ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Filtered Data */}
            {(() => {
              const filtered = attendanceData.filter(a => 
                a.user?.role !== "STUDENT" && (attendanceRoleFilter === "all" ? true : a.user?.role === attendanceRoleFilter)
              );
              
              return (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Present", count: filtered.filter(a => a.status === "P").length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
                      { label: "Absent", count: filtered.filter(a => a.status === "A").length, icon: XCircle, color: "text-red-600 bg-red-50" },
                      { label: "On Leave", count: filtered.filter(a => a.status === "L").length, icon: Calendar, color: "text-amber-600 bg-amber-50" },
                      { label: "Late", count: filtered.filter(a => a.status === "LT").length, icon: Clock, color: "text-orange-600 bg-orange-50" },
                    ].map(s => (
                      <div key={s.label} className={`rounded-xl p-4 flex items-center gap-3 ${s.color}`}>
                        <s.icon size={24} />
                        <div>
                          <p className="text-2xl font-bold">{s.count}</p>
                          <p className="text-sm">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Emp Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>In Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="flex justify-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length > 0 ? filtered.map((a, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{a.empCode || "-"}</TableCell>
                          <TableCell className="font-medium text-foreground">{a.user?.name || "-"}</TableCell>
                          <TableCell>{a.user?.role || "-"}</TableCell>
                          <TableCell className="text-sm">{a.user?.email || "-"}</TableCell>
                          <TableCell>{a.date || "-"}</TableCell>
                          <TableCell className="font-mono">{a.inTime || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              a.status === "P" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                              a.status === "A" ? "bg-red-100 text-red-700 border-red-200" :
                              a.status === "L" ? "bg-amber-100 text-amber-700 border-amber-200" :
                              a.status === "LT" ? "bg-orange-100 text-orange-700 border-orange-200" :
                              "bg-gray-100 text-gray-700"
                            }>
                              {a.status === "P" ? "Present" :
                               a.status === "A" ? "Absent" :
                               a.status === "L" ? "Leave" :
                               a.status === "LT" ? "Late" : a.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => {
                                  setSelectedAttendanceRecord(a);
                                  setAttendanceDetailOpen(true);
                                }}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            {loadingAttendance ? "Loading..." : "No attendance records found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </>
              );
            })()}
          </div>
        </TabsContent>

        {/* Attendance Detail Modal */}
        <Dialog open={attendanceDetailOpen} onOpenChange={setAttendanceDetailOpen}>
          <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
            </DialogHeader>
            {selectedAttendanceRecord && (() => {
              const empName = selectedAttendanceRecord.user?.name || "Unknown";
              const empRole = selectedAttendanceRecord.user?.role || "Unknown";
              const empEmail = selectedAttendanceRecord.user?.email || "N/A";
              const empCode = selectedAttendanceRecord.empCode || "N/A";
              
              // Get all records for this employee
              const employeeRecords = attendanceData.filter(
                a => a.user?.email === empEmail
              );
              
              // Calculate statistics
              const presentCount = employeeRecords.filter(a => a.status === "P").length;
              const absentCount = employeeRecords.filter(a => a.status === "A").length;
              const leaveCount = employeeRecords.filter(a => a.status === "L").length;
              const lateCount = employeeRecords.filter(a => a.status === "LT").length;
              const totalDays = employeeRecords.length;

              return (
                <div className="space-y-6">
                  {/* Employee Info */}
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Employee Name</p>
                        <p className="text-lg font-bold text-blue-900">{empName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Employee Code</p>
                        <p className="text-lg font-bold text-blue-900">{empCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Role</p>
                        <p className="text-lg font-bold text-blue-900">{empRole}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Email</p>
                        <p className="text-sm font-bold text-blue-900">{empEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div>
                    <p className="text-sm font-semibold mb-3 text-foreground">Overall Statistics</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-xs text-emerald-600 font-medium">Total Present</p>
                        <p className="text-2xl font-bold text-emerald-700">{presentCount}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-600 font-medium">Total Absent</p>
                        <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-600 font-medium">Total Leave</p>
                        <p className="text-2xl font-bold text-amber-700">{leaveCount}</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-xs text-orange-600 font-medium">Total Late</p>
                        <p className="text-2xl font-bold text-orange-700">{lateCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                    <p className="text-sm font-bold mb-2 text-gray-900">Summary</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Total Attendance Records: <span className="font-bold text-gray-900">{totalDays}</span></p>
                      <p>Attendance Percentage: <span className="font-bold text-gray-900">{totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0}%</span></p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={downloadAttendancePDF} className="gap-2">
                <Download size={16} />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => setAttendanceDetailOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== Teacher Rating ===== */}
        <TabsContent value="teacher-rating">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Teacher Ratings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherRatings.map(t => (
                <div key={t.id} className="border border-border rounded-xl p-5 hover:shadow-card transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(t.rating)}</div>
                    <span className="font-bold text-foreground">{t.rating}</span>
                    <span className="text-xs text-muted-foreground">({t.totalReviews} reviews)</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Punctuality", value: t.punctuality },
                      { label: "Teaching", value: t.teaching },
                      { label: "Behavior", value: t.behavior },
                      { label: "Knowledge", value: t.knowledge },
                    ].map(metric => (
                      <div key={metric.label} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20">{metric.label}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(metric.value / 5) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground w-6 text-right">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HRPageWrapper />
    </Suspense>
  );
}

function HRPageWrapper() {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setHighlightId(urlParams.get('id'));
  }, []);

  return <HRPage highlightId={highlightId} />;
}