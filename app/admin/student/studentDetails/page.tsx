/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);


// ================= GET STUDENTS =================
const fetchStudents = async () => {
  setLoading(true);

  try {
    const params: any = {
      page,
      perPage,
    };

    if (searchTerm) params.name = searchTerm;
    if (classFilter !== "all") params.classId = classFilter;
    if (selectedBranch !== "all") params.branch = Number(selectedBranch);

    const res = await axiosInstance.get("/api/v1/students", { params });

    const response = res?.data;
    const data = response?.data;

    console.log("API RESPONSE:", response);

    // ✅ STRICT BACKEND PAGINATION HANDLING (FIXED)
    const studentsList = data?.students || [];
    const pagination = data?.pagination || {};

    setStudents(studentsList);

    setTotalPages(pagination.totalPages || 1);

    setPage((prev) =>
      prev > (pagination.totalPages || 1)
        ? (pagination.totalPages || 1)
        : prev
    );

  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load students",
      variant: "destructive",
    });

    setStudents([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
};



// ================= VIEW STUDENT =================
  const handleView = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/api/v1/students/${id}`);
      setSelectedStudent(res.data.data);
      setViewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student details",
        variant: "destructive",
      });
    }
  };


// ================= EDIT STUDENT =================
  const handleEdit = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/api/v1/students/${id}`);
      setSelectedStudent(res.data.data);
      setEditData(res.data.data);
      setEditOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student details",
        variant: "destructive",
      });
    }
  };

// ================= DELETE STUDENT =================
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    await axiosInstance.delete(`/api/v1/students/${id}`);

    toast({
      title: "Success",
      description: "Student deleted successfully",
    });

    fetchStudents(); // refresh list
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete student",
      variant: "destructive",
    });
  }
};  


// ================= UPDATE STUDENT =================

const handleUpdate = async () => {
  try {
    await axiosInstance.put(
      `/api/v1/students/${selectedStudent.id}`,
      editData
    );

    toast({
      title: "Success",
      description: "Student updated successfully",
    });

    setEditOpen(false);
    fetchStudents(); // refresh table
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update student",
      variant: "destructive",
    });
  }
};

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
    toast({
    title: "Error",
    description: "Failed to load branches",
    variant: "destructive",
  });
  }
};

const handleImport = async (file: File) => {
  setImportLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
      "/api/v1/students/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = res.data?.data;

    toast({
      title: "Import Completed",
      description: `✅ Success: ${data?.successCount || 0}, ❌ Failed: ${
        data?.failedCount || 0
      }`,
    });

    // 🔁 Refresh student list
    fetchStudents();

    // Optional: log failed rows
    if (data?.failed?.length > 0) {
      console.log("Failed Rows:", data.failed);
    }
  } catch (error: any) {
    toast({
      title: "Import Failed",
      description:
        error?.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setImportLoading(false);
    setImportFile(null);
  }
};

const handleExport = async () => {
  try {
    const params: any = {};

    // ✅ Apply same filters as table (important)
    if (searchTerm) params.name = searchTerm;
    if (classFilter !== "all") params.classId = classFilter;
    if (selectedBranch !== "all") params.branch = Number(selectedBranch);

    const res = await axiosInstance.get(
      "/api/v1/students/export",
      {
        params,
        responseType: "blob", // 🔥 important for file download
      }
    );

    // ✅ Create file download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Dynamic filename
    link.setAttribute(
      "download",
      `students_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    toast({
      title: "Export Failed",
      description:
        error?.response?.data?.message || "Unable to export data",
      variant: "destructive",
    });
  }
};

useEffect(() => {
  fetchBranches();
}, []);

useEffect(() => {
  const delay = setTimeout(() => {
    fetchStudents();
  }, 300);

  return () => clearTimeout(delay);
}, [searchTerm, classFilter, selectedBranch, page, perPage]);

useEffect(() => {
  setPage(1);
}, [searchTerm, classFilter, selectedBranch]);


  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl shadow-sm border border-border">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Information
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage student records and admissions
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={importLoading}
              onClick={() => {
                document.getElementById("student-import-file")?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-1.5" />
              {importLoading ? "Importing..." : "Import"}
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport} disabled={exportLoading}>
              <Download className="w-4 h-4 mr-1.5" />
              {exportLoading ? "Exporting..." : "Export"}
            </Button>

            <Button
              onClick={() =>
                router.push("/admin/student/studentAdmission")
              }
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Admission
            </Button>
          </div>
        </div>

        <input
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          id="student-import-file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImportFile(e.target.files[0]);
              handleImport(e.target.files[0]); // auto upload after select
            }
          }}
        />

        {/* ================= FILTERS ================= */}
        <div className="rounded-2xl border border-border shadow-sm bg-card p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-secondary/50 px-3 rounded-xl border border-border">
              <Search className="w-4 h-4 text-indigo-500" />
              <Input
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-9 text-sm"
              />
            </div>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Branch</SelectItem>

                {branchList.map((branch: any) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          
          {/* LEFT: Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page:</span>

            <Select
              value={String(perPage)}
              onValueChange={(val) => { setPerPage(Number(val));
              setPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RIGHT: Page Controls */}
          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Admission No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: any) => {
                  // ✅ Safe field extraction (handles different backend formats)

                  const admissionNumber =
                    student.admissionNumber ||
                    student.admission_number ||
                    student.admissionNo ||
                    "-";

                  const className =
                    student?.section?.class?.name ||

                    "-";

                  const sectionName =
                    student.sectionName ||
                    student.section_name ||
                    student.class?.section ||
                    "";

                  return (
                    <TableRow
                      key={student.id || student._id}
                      className="hover:bg-secondary/30 transition"
                    >
                      <TableCell className="font-mono text-indigo-600">
                        {student.admissionNumber}
                      </TableCell>

                      <TableCell className="font-semibold">
                        {student.name || student.studentName || "-"}
                      </TableCell>

                      <TableCell>
                        { `${student?.section?.class?.name} - ${student?.section?.name}`}
                      </TableCell>

                      <TableCell>{student.gender || "-"}</TableCell>

                      <TableCell className="text-slate-500">
                        {student.dateOfBirth ||
                          student.dob ||
                          "-"}
                      </TableCell>

                      <TableCell>{student.phone || "-"}</TableCell>

                      <TableCell>
                          <div className="gap-2">

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                              onClick={() => handleView(student.id)}
                              >
                              <Eye className="w-4 h-4 text-indigo-600" />
                              </Button>

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                              onClick={() => handleEdit(student.id)}
                              >
                              <Edit className="w-4 h-4 text-emerald-600" />
                              </Button>

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                              onClick={() => handleDelete(student.id)}
                              >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                          </div>

                          {/* ================= VIEW MODAL ================= */}
                          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl">

                              {selectedStudent && (
                                <div>

                                  {/* ================= HEADER ================= */}
                                  <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-white p-6 flex flex-col items-center">

                                    <img
                                      src={selectedStudent.photo || "/student.png"}
                                      alt="student"
                                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                    />

                                    <h2 className="text-xl font-semibold mt-3">
                                      {selectedStudent.name}
                                    </h2>

                                    <p className="text-sm opacity-90">
                                      Admission No: {selectedStudent.admissionNumber || "-"}
                                    </p>

                                    <Badge className="mt-2 bg-white text-indigo-600 font-medium">
                                      {selectedStudent?.section?.class?.name || "-"} -{" "}
                                      {selectedStudent?.section?.name || "-"}
                                    </Badge>
                                  </div>

                                  {/* ================= BODY ================= */}
                                  <div className="p-6 space-y-6 bg-gray-50">

                                    {/* ================= BASIC INFO ================= */}
                                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        📋 Basic Information
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Roll No:</strong> {selectedStudent.rollNumber || "-"}</p>
                                        <p><strong>Gender:</strong> {selectedStudent.gender || "-"}</p>
                                        <p><strong>DOB:</strong> {selectedStudent.dateOfBirth || "-"}</p>
                                        <p><strong>Phone:</strong> {selectedStudent.phone || "-"}</p>

                                        <p className="col-span-2">
                                          <strong>Email:</strong> {selectedStudent.email || "-"}
                                        </p>
                                      </div>
                                    </div>

                                    {/* ================= FEE DETAILS ================= */}
                                    <div className="bg-green-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                                        💰 Fee Details
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4 text-sm">

                                        <p>Admission Fee: ₹{selectedStudent?.fee?.admissionFee || 0}</p>
                                        <p>Tuition Fee: ₹{selectedStudent?.fee?.tutionFee || 0}</p>

                                        <p>Transport Fee: ₹{selectedStudent?.fee?.transportFee || 0}</p>
                                        <p>Hostel Fee: ₹{selectedStudent?.fee?.hostelFee || 0}</p>

                                        <p>Other Fee: ₹{selectedStudent?.fee?.otherFee || 0}</p>

                                        <p className="font-semibold text-green-800">
                                          Total Fee: ₹{selectedStudent?.fee?.totalFee || 0}
                                        </p>

                                        <p className="font-semibold text-blue-600">
                                          Deposited: ₹{selectedStudent?.fee?.depositFee || 0}
                                        </p>

                                        <p>Installments: {selectedStudent?.fee?.installments || 1}</p>

                                        <p>
                                          Due Date:{" "}
                                          {selectedStudent?.fee?.dueDate
                                            ? new Date(selectedStudent.fee.dueDate).toLocaleDateString()
                                            : "-"}
                                        </p>
                                      </div>

                                      <div className="mt-4">
                                        <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                                          {selectedStudent?.fee?.status || "PENDING"}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* ================= DISCOUNT ================= */}
                                    <div className="bg-purple-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                                        🎯 Discount
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p>
                                          <strong>Name:</strong>{" "}
                                          {selectedStudent?.discount?.Discount?.name || "-"}
                                        </p>

                                        <p>
                                          <strong>Type:</strong>{" "}
                                          {selectedStudent?.discount?.Discount?.type || "-"}
                                        </p>

                                        <p>
                                          <strong>Value:</strong>{" "}
                                          {selectedStudent?.discount?.Discount?.value || 0}
                                          {selectedStudent?.discount?.Discount?.type === "PERCENTAGE"
                                            ? "%"
                                            : "₹"}
                                        </p>

                                        <p className="font-semibold text-purple-700">
                                          Amount: ₹{selectedStudent?.discount?.amount || 0}
                                        </p>
                                      </div>
                                    </div>

                                    {/* ================= PARENT DETAILS ================= */}
                                    <div className="bg-orange-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                                        👨‍👩‍👧 Parent Details
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Father Name:</strong> {selectedStudent?.parent?.fatherName || "-"}</p>
                                        <p><strong>Father Phone:</strong> {selectedStudent?.parent?.fatherPhone || "-"}</p>

                                        <p><strong>Mother Name:</strong> {selectedStudent?.parent?.motherName || "-"}</p>
                                        <p><strong>Mother Phone:</strong> {selectedStudent?.parent?.motherPhone || "-"}</p>

                                        <p className="col-span-2">
                                          <strong>Address:</strong> {selectedStudent?.currentAddress || "-"}
                                        </p>
                                      </div>
                                    </div>

                                    {/* ================= GUARDIAN DETAILS ================= */}
                                    <div className="bg-cyan-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-cyan-700 mb-4 flex items-center gap-2">
                                        🛡 Guardian Details
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Name:</strong> {selectedStudent?.parent?.guardianName || "-"}</p>
                                        <p><strong>Relation:</strong> {selectedStudent?.parent?.guardianRelation || "-"}</p>

                                        <p><strong>Phone:</strong> {selectedStudent?.parent?.guardianPhone || "-"}</p>
                                        
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* ================= EDIT MODAL ================= */}
                          <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl">

                              {editData && (
                                <div>

                                  {/* ================= HEADER ================= */}
                                  <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-white p-6 flex flex-col items-center">

                                    <img
                                      src={editData.image || "/student.png"}
                                      alt="student"
                                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                    />

                                    <h2 className="text-xl font-semibold mt-3">
                                      ✏️ Edit Student
                                    </h2>

                                    <p className="text-sm opacity-90">
                                      Admission No: {editData.admissionNumber || "-"}
                                    </p>
                                  </div>

                                  {/* ================= BODY ================= */}
                                  <div className="p-6 space-y-6 bg-gray-50">

                                    {/* ================= BASIC INFO ================= */}
                                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-gray-700 mb-4">📋 Basic Info</h3>

                                      <div className="grid grid-cols-2 gap-4">

                                        <Input
                                          placeholder="Student Name"
                                          value={editData.name || ""}
                                          onChange={(e) =>
                                            setEditData({ ...editData, name: e.target.value })
                                          }
                                        />

                                        <Input
                                          placeholder="Phone"
                                          value={editData.phone || ""}
                                          onChange={(e) =>
                                            setEditData({ ...editData, phone: e.target.value })
                                          }
                                        />

                                        <Input
                                          placeholder="Email"
                                          value={editData.email || ""}
                                          onChange={(e) =>
                                            setEditData({ ...editData, email: e.target.value })
                                          }
                                        />

                                        <Input
                                          type="date"
                                          value={editData.dateOfBirth || ""}
                                          onChange={(e) =>
                                            setEditData({ ...editData, dateOfBirth: e.target.value })
                                          }
                                        />

                                        <Select
                                          value={editData.gender || ""}
                                          onValueChange={(value) =>
                                            setEditData({ ...editData, gender: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>

                                        <Select
                                          value={editData.status || ""}
                                          onValueChange={(value) =>
                                            setEditData({ ...editData, status: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                          </SelectContent>
                                        </Select>

                                      </div>
                                    </div>

                                    {/* ================= PARENT DETAILS ================= */}
                                    <div className="bg-orange-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-orange-700 mb-4">
                                        👨‍👩‍👧 Parent Details
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4">

                                        <Input
                                          placeholder="Father Name"
                                          value={editData?.parent?.fatherName || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              parent: {
                                                ...editData.parent,
                                                fatherName: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Father Phone"
                                          value={editData?.parent?.fatherPhone || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              parent: {
                                                ...editData.parent,
                                                fatherPhone: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Mother Name"
                                          value={editData?.parent?.motherName || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              parent: {
                                                ...editData.parent,
                                                motherName: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Mother Phone"
                                          value={editData?.parent?.motherPhone || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              parent: {
                                                ...editData.parent,
                                                motherPhone: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          className="col-span-2"
                                          placeholder="Address"
                                          value={editData?.parent?.address || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              parent: {
                                                ...editData.parent,
                                                address: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* ================= GUARDIAN ================= */}
                                    <div className="bg-cyan-50 p-5 rounded-xl shadow-sm border">
                                      <h3 className="font-semibold text-cyan-700 mb-4">
                                        🛡 Guardian Details
                                      </h3>

                                      <div className="grid grid-cols-2 gap-4">

                                        <Input
                                          placeholder="Guardian Name"
                                          value={editData?.guardian?.name || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              guardian: {
                                                ...editData.guardian,
                                                name: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Relation"
                                          value={editData?.guardian?.relation || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              guardian: {
                                                ...editData.guardian,
                                                relation: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Phone"
                                          value={editData?.guardian?.phone || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              guardian: {
                                                ...editData.guardian,
                                                phone: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          placeholder="Email"
                                          value={editData?.guardian?.email || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              guardian: {
                                                ...editData.guardian,
                                                email: e.target.value,
                                              },
                                            })
                                          }
                                        />

                                        <Input
                                          className="col-span-2"
                                          placeholder="Address"
                                          value={editData?.guardian?.address || ""}
                                          onChange={(e) =>
                                            setEditData({
                                              ...editData,
                                              guardian: {
                                                ...editData.guardian,
                                                address: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* ================= ACTIONS ================= */}
                                    <div className="flex justify-end gap-3 pt-4">

                                      <Button
                                        variant="outline"
                                        onClick={() => setEditOpen(false)}
                                        className="rounded-lg"
                                      >
                                        Cancel
                                      </Button>

                                      <Button
                                        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:shadow-lg rounded-lg"
                                        onClick={handleUpdate}
                                      >
                                        💾 Update Student
                                      </Button>

                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
