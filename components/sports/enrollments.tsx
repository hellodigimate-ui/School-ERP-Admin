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
import { Search, Plus, Trash2, Pencil, Eye } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const statusConfig: any = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-600",
};

export default function EnrollmentTab() {
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
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
    branchId: "",
  });

const [users, setUsers] = useState<any[]>([]);
const [studentPopoverOpen, setStudentPopoverOpen] = useState(false);
const [selectedStudentName, setSelectedStudentName] = useState("");

// Fetch users by branch
const fetchUsers = async (branchId: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/users?branch=${branchId}&role=STUDENT`
    );
    if (res.data.success) setUsers(res.data.data);
  } catch (err) {
    console.error("Failed to load users", err);
    setUsers([]);
  }
};

// Optional: dynamically filter students while typing
useEffect(() => {
  if (form.branchId) fetchUsers(form.branchId);
}, [searchStudents]);  




  // 🔥 Fetch Enrollments
  const fetchEnrollments = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/enrollments", {
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

  // 🔥 Fetch Branches
  const fetchBranches = async () => {
    const res = await axiosInstance.get("/api/v1/branches");
    setBranches(res.data.data);
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
    fetchBranches();
    fetchStudents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [searchStudents]);

  // 🔥 Create Enrollment
  const handleEnroll = async () => {
    try {
      await axiosInstance.post("/api/v1/enrollments", form);
      setShowEnrollDialog(false);
      setForm({ studentId: "", sportId: "", branchId: "" });
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
        `/api/v1/enrollments/${selectedEnrollment.id}`,
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
      await axiosInstance.delete(`/api/v1/enrollments/${id}`);
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

    {/* 🔹 Branch Select */}
    <Select
      value={form.branchId}
      onValueChange={(value) => {
        setForm({ ...form, branchId: value, studentId: "" })
        fetchUsers(value) // fetch students for this branch
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Branch" />
      </SelectTrigger>
      <SelectContent>
        {branches.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

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
              <TableHead>Branch</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollmentData.map((e, i) => (
              <TableRow key={e.id} className="hover:bg-blue-50 transition">
                <TableCell>{i + 1}</TableCell>
                <TableCell>{students.find((s) => s.id === e.studentId)?.name || e.studentId}</TableCell>
                <TableCell>{sports.find((s) => s.id === e.sportId)?.name}</TableCell>
                <TableCell>{branches.find((b) => b.id === e.branchId)?.name}</TableCell>
                <TableCell>{new Date(e.enrollmentDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={statusConfig[e.status]}>{e.status}</Badge>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
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