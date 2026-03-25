/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
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
  Calendar
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
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

export default function Page() {
  const [activeTab, setActiveTab] = useState("staff-directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch,setSelectedBranch] = useState("")
  const [branchList, setBranchList] = useState<any[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [staffData, setStaffData] = useState<any[]>([])
  const [addOpen, setAddOpen] = useState(false)


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
}, [])

useEffect(() => {

  fetchStaff()

}, [selectedBranch, roleFilter, searchTerm])




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
                    <Button size="sm"><Plus size={16} className="mr-1" /> Add Staff</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Staff Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">

                      {/* Branch */}
                      <div >
                        <label className="font-semibold">Branch *</label>
                        <Select 
                          value={formData.branchId}
                          onValueChange={(val) =>
                            setFormData({ ...formData, branchId: val })
                          }
                        >
                          <SelectTrigger>
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

                      <div>
                        <Label>Full Name *</Label>
                        <Input placeholder="Enter full name" 
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                        />
                      </div>

                      <div>
                        <Label>Role *</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(val) =>
                            setFormData({ ...formData, role: val })
                          }
                        >
                          <SelectTrigger>
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

                      <div>
                        <Label>Designation</Label>
                        <Input placeholder="Designation" 
                          onChange={(e) =>
                            setFormData({ ...formData, designation: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Qualification</Label>
                        <Input placeholder="e.g. M.Sc., B.Ed." 
                          onChange={(e) =>
                            setFormData({ ...formData, qualification: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Phone *</Label>
                        <Input
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Email *</Label>
                        <Input placeholder="Enter email" type="email" 
                            onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }/>
                      </div>

                      <div>
                        <Label>Password *</Label>
                        <Input placeholder="Enter password" type="password"
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Date of Joining</Label>
                        <Input type="date" 
                          onChange={(e) => {
                            const date = e.target.value
                            setFormData({
                              ...formData,
                              joinDate: date.concat("T10:00:00.000Z"),
                            })
                          }}
                        />
                      </div>

                      <div>
                        <Label>Experience</Label>
                        <Input placeholder="e.g. 5 years" 
                          onChange={(e) =>
                            setFormData({ ...formData, experienceYears: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <Label>Address *</Label>
                        <Textarea placeholder="Enter full address" 
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-span-2">
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
                        />
                      </div>

                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose>
                        <Button variant="outline" >Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleCreateStaff} >Save Staff</Button>
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
                    <TableRow key={staff.id}>
                      
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

                        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Staff Details</DialogTitle>
                            </DialogHeader>

                            {selectedStaff && (
                              <div className="space-y-5">

                                {/* Staff Image */}
                                <div className="flex justify-center">
                                  {selectedStaff.photo ? (
                                    <img
                                      src={selectedStaff.photo}
                                      alt={selectedStaff.name}
                                      className="size-32 rounded-full object-fill border shadow"
                                    />
                                  ) : (
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                                      {selectedStaff.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>

                                {/* Staff Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">

                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedStaff.name}</p>
                                  </div>

                                  <div>
                                    <Label>Role</Label>
                                    <p>{selectedStaff.role}</p>
                                  </div>

                                  <div>
                                    <Label>Designation</Label>
                                    <p>{selectedStaff.designation}</p>
                                  </div>

                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedStaff.phone}</p>
                                  </div>

                                  <div>
                                    <Label>Email</Label>
                                    <p>{selectedStaff.email}</p>
                                  </div>

                                  <div>
                                    <Label>Join Date</Label>
                                    <p>{new Date(selectedStaff.joinDate).toLocaleDateString()}</p>
                                  </div>

                                  <div>
                                    <Label>Status</Label>
                                    <p>{selectedStaff.isActive ? "Active" : "Inactive"}</p>
                                  </div>

                                  <div>
                                    <Label>Address</Label>
                                    <p>{selectedStaff.address}</p>
                                  </div>

                                </div>

                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Staff</DialogTitle>
                            </DialogHeader>

                            {editData && (
                              <div className="grid grid-cols-2 gap-4 mt-4">

                                {/* Name */}
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    value={editData.name}
                                    onChange={(e) =>
                                      setEditData({ ...editData, name: e.target.value })
                                    }
                                  />
                                </div>


                                {/* Designation */}
                                <div>
                                  <Label>Designation</Label>
                                  <Input
                                    value={editData.designation}
                                    onChange={(e) =>
                                      setEditData({ ...editData, designation: e.target.value })
                                    }
                                  />
                                </div>

                                {/* Phone */}
                                <div>
                                  <Label>Phone</Label>
                                  <Input
                                    value={editData.phone}
                                    onChange={(e) =>
                                      setEditData({ ...editData, phone: e.target.value })
                                    }
                                  />
                                </div>

                                {/* Status Dropdown */}
                                <div>
                                  <Label>Status</Label>
                                  <Select
                                    value={editData.status}
                                    onValueChange={(value) =>
                                      setEditData({ ...editData, status: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Active">Active</SelectItem>
                                      <SelectItem value="InActive">InActive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Address */}
                                <div className="col-span-2">
                                  <Label>Address</Label>
                                  <Textarea
                                    value={editData.address}
                                    onChange={(e) =>
                                      setEditData({ ...editData, address: e.target.value })
                                    }
                                  />
                                </div>

                              </div>
                            )}

                            <div className="flex justify-end mt-4">
                              <Button
                                onClick={handleUpdateStaff}
                              >
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
          </div>
        </TabsContent>


        {/* ===== Staff Attendance ===== */}
        <TabsContent value="staff-attendance">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-foreground">Staff Attendance</h2>
              <div className="flex items-center gap-2">
                <Input type="date" className="w-44" defaultValue="2026-02-15" />
                
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Present", count: staffAttendanceData.filter(a => a.status === "Present").length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
                { label: "Absent", count: staffAttendanceData.filter(a => a.status === "Absent").length, icon: XCircle, color: "text-red-600 bg-red-50" },
                { label: "On Leave", count: staffAttendanceData.filter(a => a.status === "On Leave").length, icon: Calendar, color: "text-amber-600 bg-amber-50" },
                { label: "Late", count: staffAttendanceData.filter(a => a.status === "Late").length, icon: Clock, color: "text-orange-600 bg-orange-50" },
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
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Department</TableHead> */}
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="flex justify-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffAttendanceData.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                    {/* <TableCell>{a.department}</TableCell> */}
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{a.checkIn}</TableCell>
                    <TableCell>{a.checkOut}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(a.status)}>{a.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Eye size={14} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                          <Trash2 size={14} />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>


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
