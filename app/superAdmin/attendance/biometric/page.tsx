/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  Fingerprint,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
  Wifi,
  RefreshCcw,
  Eye,
} from "lucide-react";

// import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";


const getStats = (data: any[]) => {
  const studentData = data.filter(a => a.user?.role === "STUDENT");
  const uniqueStudents = new Set(studentData.map(a => a.user?.email)).size;
  const presentToday = studentData.filter(a => a.status === "P").length;
  const failedScans = studentData.filter(a => a.status === "A").length;
  const percentage = uniqueStudents > 0 ? ((presentToday / uniqueStudents) * 100).toFixed(1) : 0;
  
  return [
    {
      label: "Total Enrolled",
      value: uniqueStudents.toString(),
      icon: Fingerprint,
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-secondary/50",
      change: "Students",
    },
    {
      label: "Marked Today",
      value: presentToday.toString(),
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
      bg: "bg-secondary/50",
      change: `${percentage}% present`,
    },
    {
      label: "Failed Scans",
      value: failedScans.toString(),
      icon: XCircle,
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-secondary/50",
      change: "Absent today",
    },
    {
      label: "Records Today",
      value: (presentToday + failedScans).toString(),
      icon: Wifi,
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-secondary/50",
      change: "Total scans",
    },
  ];
};



const Page = () => {

  const [externalAttendance, setExternalAttendance] = useState<any[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);

  const downloadPDF = () => {
    if (!selectedStudent) return;
    
    const studentName = selectedStudent.user?.name || "Unknown";
    const studentEmail = selectedStudent.user?.email || "N/A";
    const empCode = selectedStudent.empCode || "N/A";
    const studentRole = selectedStudent.user?.role || "Student";
    
    const studentRecords = externalAttendance.filter(
      a => a.user?.email === studentEmail
    );
    
    const presentCount = studentRecords.filter(a => a.status === "P").length;
    const absentCount = studentRecords.filter(a => a.status === "A").length;
    const totalDays = studentRecords.length;
    const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0;
    
    const doc = new jsPDF();
    let yPos = 10;
    
    // Header
    doc.setFontSize(16);
    doc.text("Student Attendance Report (Biometric)", 10, yPos);
    yPos += 10;
    
    // Student Info
    doc.setFontSize(11);
    doc.text(`Student Name: ${studentName}`, 10, yPos);
    yPos += 7;
    doc.text(`Roll Number: ${empCode}`, 10, yPos);
    yPos += 7;
    doc.text(`Email: ${studentEmail}`, 10, yPos);
    yPos += 7;
    doc.text(`Role: ${studentRole}`, 10, yPos);
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
    doc.text(`Total Records: ${totalDays}`, 10, yPos);
    yPos += 6;
    doc.text(`Attendance Percentage: ${percentage}%`, 10, yPos);
    
    // Add date
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 280);
    
    doc.save(`${studentName}_Biometric_Report.pdf`);
  };

  const fetchExternalAttendance = async () => {
  try {
    setLoadingExternal(true);
    let url = "/api/v1/attendance/external";
    const params = new URLSearchParams();
    
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };
    
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    
    if (formattedFromDate) params.append("fromDate", formattedFromDate);
    if (formattedToDate) params.append("toDate", formattedToDate);
    
    if (Array.from(params).length > 0) {
      url += "?" + params.toString();
    }

    const res = await axiosInstance.get(url);

    if (res.data.success) {
      setExternalAttendance(res.data.data);
    } else {
      console.error(res.data.message);
    }
  } catch (err) {
    console.error("Failed to fetch external attendance:", err);
  } finally {
    setLoadingExternal(false);
  }
};

useEffect(() => {
  fetchExternalAttendance();
}, []);

  return (
    <AdminLayout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">

              <span className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                <Fingerprint className="w-6 h-6" />
              </span>

              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Biometric Attendance
              </span>

            </h1>

            <p className="text-muted-foreground text-sm mt-1">
              Fingerprint-based attendance with device management
            </p>
          </div>


          <div className="flex gap-2">

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

        </div>


        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {getStats(externalAttendance).map((s, i) => (

            <Card
              key={i}
              className={`border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${s.bg}`}
            >

              <CardContent className="p-5">

                <div className="flex items-center gap-4">

                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <s.icon className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>

                </div>

                <div className="mt-3 pt-2 border-t flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {s.change}
                </div>

              </CardContent>

            </Card>

          ))}

        </div>


        {/* Scan Log */}

<Card className="border-0 shadow-xl mt-6">

  <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <CardTitle>External Biometric Attendance</CardTitle>

    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
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
      <Button onClick={fetchExternalAttendance} disabled={loadingExternal} size="sm" className="bg-blue-600 hover:bg-blue-700">
        {loadingExternal ? "Applying..." : "Apply Filter"}
      </Button>
      <Button variant="outline" size="sm" onClick={fetchExternalAttendance}>
        <RefreshCcw className="w-4 h-4 mr-1" />
        Refresh
      </Button>
    </div>
  </CardHeader>

  <CardContent>

    <Table>

      <TableHeader>
        <TableRow className="bg-secondary/50 dark:bg-secondary/30">
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

        {loadingExternal ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              Loading...
            </TableCell>
          </TableRow>
        ) : externalAttendance.filter(item => item.user?.role === "STUDENT").length > 0 ? (
          externalAttendance.filter(item => item.user?.role === "STUDENT").map((item, index) => (
            <TableRow key={index} className="hover:bg-secondary/30">

              <TableCell className="font-mono">
                {item.empCode}
              </TableCell>

              <TableCell>
                {item.user?.name || "-" }
              </TableCell>

              <TableCell>
                {item.user?.role || "-" }
              </TableCell>

              <TableCell>
                {item.user?.email || "-"}
              </TableCell>

              <TableCell>{item.date}</TableCell>

              <TableCell className="font-mono">
                {item.inTime}
              </TableCell>

              <TableCell>
                <Badge className={
                  item.status === "P"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }>
                  {item.status === "P" ? "Present" : item.status}
                </Badge>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setSelectedStudent(item);
                    setStudentDetailOpen(true);
                  }}
                >
                  <Eye size={14} />
                </Button>
              </TableCell>

            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No external attendance found
            </TableCell>
          </TableRow>
        )}

      </TableBody>

    </Table>

  </CardContent>

</Card>

      </div>

      {/* Student Detail Modal */}
      <Dialog open={studentDetailOpen} onOpenChange={setStudentDetailOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Attendance Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (() => {
            const studentName = selectedStudent.user?.name || "Unknown";
            const studentRole = selectedStudent.user?.role || "Student";
            const studentEmail = selectedStudent.user?.email || "N/A";
            const empCode = selectedStudent.empCode || "N/A";
            
            // Get all records for this student
            const studentRecords = externalAttendance.filter(
              a => a.user?.email === studentEmail
            );
            
            // Calculate statistics
            const presentCount = studentRecords.filter(a => a.status === "P").length;
            const absentCount = studentRecords.filter(a => a.status === "A").length;
            const totalDays = studentRecords.length;

            return (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Student Name</p>
                      <p className="text-lg font-bold text-blue-900">{studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Roll Number</p>
                      <p className="text-lg font-bold text-blue-900">{empCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Role</p>
                      <p className="text-lg font-bold text-blue-900">{studentRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Email</p>
                      <p className="text-sm font-bold text-blue-900">{studentEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div>
                  <p className="text-sm font-semibold mb-3 text-foreground">Attendance Summary</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p className="text-xs text-emerald-600 font-medium">Total Present</p>
                      <p className="text-2xl font-bold text-emerald-700">{presentCount}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-medium">Total Absent</p>
                      <p className="text-2xl font-bold text-red-700">{absentCount}</p>
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
            <Button variant="outline" onClick={downloadPDF} className="gap-2">
              <Download size={16} />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => setStudentDetailOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default Page;