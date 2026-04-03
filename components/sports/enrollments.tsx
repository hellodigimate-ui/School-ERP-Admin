/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2, Pencil, Eye, Edit2, MapPin, User, Activity, CheckCircle, Calendar } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

// const statusConfig: any = {
//   ACTIVE: "bg-green-100 text-green-700",
//   INACTIVE: "bg-gray-100 text-gray-600",
// };

const statusConfig: any = {
  ENROLLED: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  INACTIVE: "bg-red-100 text-red-700",
};

interface SportsTabProps {
  branchId?: string;
}

export default function EnrollmentTab({ branchId }: SportsTabProps) {
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [searchEnrollments, setSearchEnrollments] = useState("");
  const [searchStudents, setSearchStudents] = useState("");
  const [pageEnrollments, setPageEnrollments] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [viewEnrollment, setViewEnrollment] = useState<any>(null);

  const [form, setForm] = useState({
    studentId: "",
    sportId: "",
  });

const [users, setUsers] = useState<any[]>([]);
const [studentPopoverOpen, setStudentPopoverOpen] = useState(false);
const [selectedStudentName, setSelectedStudentName] = useState("");

// Fetch users from profile branch
const fetchUsers = async () => {
  try {
    const branchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
    if (!branchId) {
      setUsers([]);
      return;
    }

    const res = await axiosInstance.get(`/api/v1/students`, {
      params: { branch: branchId, search: searchStudents || undefined },
    });
    if (res.data.success) setUsers(res.data.data.students || []);
  } catch (err) {
    console.error("Failed to load users", err);
    setUsers([]);
  }
};

// Optional: dynamically filter students while typing
useEffect(() => {
  fetchUsers();
}, [searchStudents]);



  // 🔥 Fetch Enrollments
  const fetchEnrollments = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/sports/enrollments", {
        params: {
          page: pageEnrollments,
          limit: 10,
          studentId: searchEnrollments || undefined,
        },
      });
      setEnrollmentData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Fetch enrollments error", err);
    }
  };

  // 🔥 Fetch Sports
  const fetchSports = async () => {
    const res = await axiosInstance.get("/api/v1/sports");
    setSports(res.data.data);
  };

  // 🔥 Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/students", {
        params: { search: searchStudents || undefined, limit: 50 },
      });
      setStudents(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch students error", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [pageEnrollments, searchEnrollments]);

  useEffect(() => {
    fetchSports();
    fetchStudents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [searchStudents]);

  // 🔥 Create Enrollment
  const handleEnroll = async () => {
    const branchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
    if (!branchId) {
      console.warn("branchId not found in localStorage");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/sports/enrollments", {
        ...form,
        branchId,
      });
      setShowEnrollDialog(false);
      setForm({ studentId: "", sportId: "" });
      fetchEnrollments();
    } catch (err) {
      console.error("Enroll error", err);
    }
  };

  // 🔥 Update Enrollment
  const handleUpdate = async () => {
    if (!selectedEnrollment) return;
    try {
      await axiosInstance.put(
        `/api/v1/sports/enrollments/${selectedEnrollment.id}`,
        selectedEnrollment
      );
      setSelectedEnrollment(null);
      fetchEnrollments();
    } catch (err) {
      console.error("Update enrollment error", err);
    }
  };

  // 🔥 Delete Enrollment
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/sports/enrollments/${id}`);
      fetchEnrollments();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔥 Top Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input
            className="pl-9 w-64"
            placeholder="Search by Student ID..."
            value={searchEnrollments}
            onChange={(e) => {
              setSearchEnrollments(e.target.value);
              setPageEnrollments(1);
            }}
          />
        </div>

      {/* 🔥 Enroll Modal */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus size={16} /> Enroll Student
          </Button>
        </DialogTrigger>

        <DialogContent className="space-y-4">
          <DialogTitle className="text-xl font-bold text-blue-600">
            Enroll Student
          </DialogTitle>

          {/* Branch is set automatically from profile branchId in localStorage */}
          <p className="text-sm text-gray-600">Branch is auto-selected</p>

          {/* 🔹 Student Search & Select using Popover */}
          <div className="space-y-2">
            <label>Select Student</label>
            <Popover open={studentPopoverOpen} onOpenChange={setStudentPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  {selectedStudentName || "Search student..."}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-full max-h-60 overflow-y-auto">
                <Command>
                  <CommandInput
                    placeholder="Search student..."
                    value={searchStudents}
                    onValueChange={setSearchStudents}
                  />
                  <CommandList>
                    <CommandEmpty>No students found</CommandEmpty>
                    {users.map((u) => (
                      <CommandItem
                        key={u.id}
                        value={u.name}
                        onSelect={() => {
                          setForm({ ...form, studentId: u.id })
                          setSelectedStudentName(u.name)
                          setStudentPopoverOpen(false)
                        }}
                      >
                        {u.name} ({u.studentId})
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 🔹 Sport Select */}
          <Select
            value={form.sportId}
            onValueChange={(value) => setForm({ ...form, sportId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🔹 Enroll Button */}
          <Button
            onClick={handleEnroll}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Enroll
          </Button>
        </DialogContent>
      </Dialog>
      </div>

{/* 🔥 Table */}
<div className="bg-white rounded-xl shadow overflow-hidden border">
  <Table>
    <TableHeader>
      <TableRow className="bg-blue-50">
        <TableHead>#</TableHead>
        <TableHead>Student</TableHead>
        <TableHead>Sport</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {enrollmentData.map((e, i) => (
        <TableRow key={e.id} className="hover:bg-blue-50 transition">
          <TableCell>{i + 1}</TableCell>
          <TableCell>{students.find((s) => s.id === e.studentId)?.name || e.Student.name}</TableCell>
          <TableCell>{sports.find((s) => s.id === e.sportId)?.name}</TableCell>

          <TableCell>{new Date(e.enrollmentDate).toLocaleDateString()}</TableCell>
          <TableCell>
            <Badge className={statusConfig[e.status]}>{e.status}</Badge>
          </TableCell>
          <TableCell className="text-right flex gap-2 justify-end">


            {/* 🔹 View Modal */}
            <Dialog open={!!viewEnrollment} onOpenChange={() => setViewEnrollment(null)}>
              <DialogContent className="space-y-6 w-[400px]">
                <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                  <Eye size={24} /> Enrollment Details
                </DialogTitle>

                {viewEnrollment && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="text-blue-500" size={20} />
                      <span className="font-semibold">Student:</span>
                      <span>{students.find((s) => s.id === viewEnrollment.studentId)?.name || viewEnrollment.Student?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity className="text-green-500" size={20} />
                      <span className="font-semibold">Sport:</span>
                      <span>{sports.find((s) => s.id === viewEnrollment.sportId)?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="text-purple-500" size={20} />
                      <span className="font-semibold">Branch:</span>
                      <span>{typeof window !== "undefined" ? localStorage.getItem("branchId") || "-" : "-"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="text-orange-500" size={20} />
                      <span className="font-semibold">Enrollment Date:</span>
                      <span>{new Date(viewEnrollment.enrollmentDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-700" size={20} />
                      <span className="font-semibold">Status:</span>
                      <span className="capitalize">{viewEnrollment.status}</span>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

{/* 🔹 Edit Modal */}
<Dialog open={!!selectedEnrollment} onOpenChange={() => setSelectedEnrollment(null)}>
  <DialogContent className="space-y-6 w-[400px]">
    <DialogTitle className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
      <Edit2 size={24} /> Edit Enrollment
    </DialogTitle>

    {selectedEnrollment && (
      <div className="space-y-4">
        {/* 🔹 Read-only Branch */}
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <MapPin size={18} /> Branch:
          <span className="text-gray-900">
            {typeof window !== "undefined" ? localStorage.getItem("branchId") || "-" : "-"}
          </span>
        </div>

        {/* 🔹 Read-only Student */}
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <User size={18} /> Student:
          <span className="text-gray-900">
            {students.find(s => s.id === selectedEnrollment.studentId)?.name || selectedEnrollment.Student?.name }
          </span>
        </div>

        {/* 🔹 Sport Select (Editable) */}
        <label className="flex items-center gap-2 font-semibold text-gray-700">
          <Activity size={18} /> Sport
        </label>
        <Select
          value={selectedEnrollment.sportId || ""}
          onValueChange={(value) => setSelectedEnrollment({ ...selectedEnrollment, sportId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Sport" />
          </SelectTrigger>
          <SelectContent>
            {sports.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 🔹 Status Select (Editable) */}
        <label className="flex items-center gap-2 font-semibold text-gray-700">
          <CheckCircle size={18} /> Status
        </label>
        <Select
          value={selectedEnrollment.status || ""}
          onValueChange={(value) => setSelectedEnrollment({ ...selectedEnrollment, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusConfig).map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 🔹 Update Button */}
        <Button
          onClick={async () => {
            try {
              // Send only the editable fields to the API
              await axiosInstance.put(
                `/api/v1/sports/enrollments/${selectedEnrollment.id}`,
                {
                  sportId: selectedEnrollment.sportId,
                  status: selectedEnrollment.status,
                }
              );
              setSelectedEnrollment(null);
              fetchEnrollments();
            } catch (err) {
              console.error("Update error", err);
            }
          }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-2"
        >
          <Edit2 size={18} /> Update Enrollment
        </Button>
      </div>
    )}
  </DialogContent>
</Dialog>

            {/* 🔹 Buttons to open modals */}
            <Button
              size="icon"
              variant="ghost"
              className="text-blue-600"
              onClick={() => setViewEnrollment(e)}
            >
              <Eye size={16} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-yellow-500"
              onClick={() => setSelectedEnrollment(e)}
            >
              <Pencil size={16} />
            </Button>

            {/* Delete Button */}
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500"
              onClick={() => handleDelete(e.id)}
            >
              <Trash2 size={16} />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

      {/* 🔥 Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Page {pageEnrollments} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pageEnrollments === 1}
            onClick={() => setPageEnrollments(pageEnrollments - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pageEnrollments === totalPages}
            onClick={() => setPageEnrollments(pageEnrollments + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}