"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, MoreHorizontal, Mail, Phone, Loader2, X } from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/apiHome/axiosInstanc";

// Modal Component for Student Details
function StudentDetailsModal({ student, isOpen, onClose }: { student: any; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Gradient Background */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-4 ring-white">
                <AvatarImage src={student.photo} />
                <AvatarFallback className="bg-white text-primary font-bold text-lg">
                  {student.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-white/80 text-sm">{student.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="flex gap-3 flex-wrap">
            <Badge className="bg-success/10 text-success border border-success/30">Active</Badge>
            <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30">
              {student.section?.class?.name || "N/A"}
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/30">
              Roll: {student.rollNumber || "N/A"}
            </Badge>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded"></div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Roll Number</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.rollNumber || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Admission Number</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.admissionNumber || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.dateOfBirth || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gender</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.gender || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Blood Group</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.bloodGroup || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.category || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</p>
                <p className="text-lg font-bold text-foreground mt-1">{student.phone || "N/A"}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Section</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {student.section?.name ? `Section ${student.section.name}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Current Address</p>
                <p className="text-sm text-foreground mt-2 leading-relaxed">{student.currentAddress || "Not provided"}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Permanent Address</p>
                <p className="text-sm text-foreground mt-2 leading-relaxed">{student.permanentAddress || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          {student.parent && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-green-500 rounded"></div>
                Parent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Father Section */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-bold text-green-700 mb-3">👨 Father's Details</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Name</p>
                      <p className="font-semibold text-foreground">{student.parent.fatherName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Occupation</p>
                      <p className="text-sm text-foreground">{student.parent.fatherOccupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Phone</p>
                      <p className="font-mono text-sm text-foreground">{student.parent.fatherPhone || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Mother Section */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <p className="text-sm font-bold text-pink-700 mb-3">👩 Mother's Details</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Name</p>
                      <p className="font-semibold text-foreground">{student.parent.motherName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Occupation</p>
                      <p className="text-sm text-foreground">{student.parent.motherOccupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Phone</p>
                      <p className="font-mono text-sm text-foreground">{student.parent.motherPhone || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Guardian Section */}
                {student.parent.guardianName && (
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 md:col-span-2">
                    <p className="text-sm font-bold text-amber-700 mb-3">👥 Guardian Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Name</p>
                        <p className="font-semibold text-foreground">{student.parent.guardianName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Relation</p>
                        <p className="text-sm text-foreground">{student.parent.guardianRelation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Phone</p>
                        <p className="font-mono text-sm text-foreground">{student.parent.guardianPhone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} className="flex-1 h-10 rounded-lg">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Parent Modal
function ContactParentModal({ student, isOpen, onClose }: { student: any; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !student) return null;

  const fatherPhone = student.parent?.fatherPhone;
  const motherPhone = student.parent?.motherPhone;
  const parentEmail = student.parent?.email;
  const fatherName = student.parent?.fatherName;
  const motherName = student.parent?.motherName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header - Gradient Background */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Contact Parent</h2>
              <p className="text-blue-100 text-sm mt-1">{student.name}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Father Contact */}
          {fatherName && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">👨</span>
                Father - {fatherName}
              </h4>
              <div className="space-y-2">
                {fatherPhone && (
                  <a
                    href={`tel:${fatherPhone}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition duration-200 border border-blue-200"
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="font-mono font-semibold text-foreground">{fatherPhone}</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Call</span>
                  </a>
                )}
                {!fatherPhone && (
                  <p className="text-sm text-blue-600 p-2 italic">No phone number available</p>
                )}
              </div>
            </div>
          )}

          {/* Mother Contact */}
          {motherName && (
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border-2 border-pink-200">
              <h4 className="font-bold text-pink-900 mb-3 flex items-center gap-2">
                <span className="text-xl">👩</span>
                Mother - {motherName}
              </h4>
              <div className="space-y-2">
                {motherPhone && (
                  <a
                    href={`tel:${motherPhone}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition duration-200 border border-pink-200"
                  >
                    <Phone className="w-5 h-5 text-pink-600" />
                    <span className="font-mono font-semibold text-foreground">{motherPhone}</span>
                    <span className="ml-auto text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Call</span>
                  </a>
                )}
                {!motherPhone && (
                  <p className="text-sm text-pink-600 p-2 italic">No phone number available</p>
                )}
              </div>
            </div>
          )}

          {/* Email Contact */}
          {parentEmail && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📧</span>
                Email Address
              </h4>
              <a
                href={`mailto:${parentEmail}`}
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition duration-200 border border-purple-200"
              >
                <Mail className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-foreground break-all text-sm">{parentEmail}</span>
                <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Send</span>
              </a>
            </div>
          )}

          {/* No Contact Info */}
          {!fatherPhone && !motherPhone && !parentEmail && (
            <div className="text-center py-8">
              <p className="text-6xl mb-3">📵</p>
              <p className="text-muted-foreground font-semibold">
                No contact information available for this parent.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onClose} 
              className="flex-1 h-10 rounded-lg bg-gray-200 text-foreground hover:bg-gray-300"
            >
              Close
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            💡 Click phone numbers to call directly, or email address to send message
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    perPage: 10,
  });
  const [classes, setClasses] = useState<Set<string>>(new Set());
  
  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching teacher's section students...");
      const response = await axiosInstance.get("/api/v1/teachers/section/students");
      
      console.log("Response:", response.data);
      
      if (response.data.success) {
        const students = response.data.data;
        setStudentsList(students);
        setPagination(response.data.pagination);

        // Extract unique class names for filter
        const uniqueClasses = new Set<string>();
        students.forEach((student: any) => {
          if (student.section?.class?.name) {
            uniqueClasses.add(student.section.class.name);
          }
        });
        setClasses(uniqueClasses);
      } else {
        setError("Failed to fetch students: " + (response.data.message || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Error fetching students:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      
      // Provide specific error messages based on status code
      let errorMessage = "Failed to load students";
      if (err.response?.status === 403) {
        errorMessage = "Access denied (403): You don't have permission to view these students. Please ensure you are logged in and have the teacher role.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed (401): Please login again.";
      } else if (err.response?.status === 404) {
        errorMessage = "Not found (404): Teacher profile not found or not assigned to any section.";
      } else if (err.response?.data?.message) {
        errorMessage = "Error: " + err.response.data.message;
      } else {
        errorMessage = "Error: " + (err.message || "Unknown error");
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search and class
  const filteredStudents = studentsList.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const studentClass = student.section?.class?.name || "";
    const matchesClass = classFilter === "all" || studentClass === classFilter;
    return matchesSearch && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Active</Badge>;
      case "inactive":
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">At Risk</Badge>;
      default:
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Active</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader teacherName="Jane Doe" />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Students</h1>
              <p className="text-muted-foreground">
                {loading ? "Loading..." : `Manage and view all your ${pagination.totalStudents} students`}
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-between">
              <p>{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchStudents}
                disabled={loading}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading students...</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
              </div>

              {/* Students Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class / Section</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={student.photo} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {student.section?.class?.name || "N/A"}
                            {student.section?.name && ` - ${student.section.name}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {student.parent?.fatherName || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{student.phone || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge("active")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowProfileModal(true);
                                }}
                              >
                                View Profile
                              </DropdownMenuItem>
                             
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowContactModal(true);
                                }}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Parent
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Info */}
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {pagination.totalStudents} students
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <StudentDetailsModal 
        student={selectedStudent} 
        isOpen={showProfileModal} 
        onClose={() => {
          setShowProfileModal(false);
          setSelectedStudent(null);
        }}
      />
      
      <ContactParentModal 
        student={selectedStudent} 
        isOpen={showContactModal} 
        onClose={() => {
          setShowContactModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
