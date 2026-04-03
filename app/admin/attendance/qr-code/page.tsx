/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command"
import { useEffect } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label";
import {
  QrCode, RefreshCw, Download, CheckCircle, XCircle, Clock,
  TrendingUp, Scan, Smartphone, Monitor
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import html2canvas from "html2canvas";
import { axiosInstance } from "@/apiHome/axiosInstanc";

type StudentProfile = {
  className?: string
  sectionId?: string
  rollNumber?: string
  dateOfBirth?: string
  bloodGroup?: string
  admissionNumber?: string
  currentAddress?: string
  fatherPhone?: string
}

type Student = {
  id?: string
  name?: string
  photo?: string
  profile?: StudentProfile
  // Direct fields (flat structure)
  className?: string
  class?: string
  classId?: string
  sectionId?: string
  section?: string
  sectionName?: string
  rollNumber?: string
  dateOfBirth?: string
  dob?: string
  bloodGroup?: string
  admissionNumber?: string
  currentAddress?: string
  address?: string
  fatherPhone?: string
  phone?: string
  [key: string]: any // Allow any other fields from API
}

const Page = () => {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [branch, setBranch] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loadingScans, setLoadingScans] = useState(false);

  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [generatedCard, setGeneratedCard] = useState("")

  const [student, setStudent] = useState<Student | null>(null)

  // **Live Attendance Stats**
  const [stats, setStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null)

  /* Download QR */
  const downloadQR = async () => {
    if (!qrRef.current) return

    const canvas = await html2canvas(qrRef.current)
    const link = document.createElement("a")
    link.download = "qr-code.png"
    link.href = canvas.toDataURL()
    link.click()
  }



useEffect(() => {
  fetchBranches()
}, [])

const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/branches")

    if (res.data.success) {
      setBranches(res.data.data)
    }
  } catch (err) {
    console.error("Failed to load branches", err)
  }
}

useEffect(() => {
  if (branch) {
    fetchUsers(branch)
  }
}, [branch])

const fetchUsers = async (branchId: string) => {
  try {
    const res = await axiosInstance.get(`/api/v1/users?branch=${branchId}&role=STUDENT`)

    if (res.data.success) {
      setUsers(res.data.data)
    }
  } catch (err) {
    console.error("Failed to load users", err)
  }
}

// 🔥 NEW: Fetch student data automatically when user is selected
const fetchStudentData = async (id: string) => {
  try {
    // Use the working /api/v1/attendance/qr endpoint to fetch student data
    const res = await axiosInstance.post("/api/v1/attendance/qr", {
      userId: id,
    })
    console.log("Student Data Fetched:", res.data);

    if (res.data.success) {
      setStudent(res.data.data.student)
      // Don't set QR image yet - only store the student data
      console.log("Student profile loaded:", res.data.data.student)
    } else {
      console.error(res.data.message)
    }
  } catch (err) {
    console.error("Error fetching student data:", err)
  }
}

// 🔥 NEW: Auto-fetch student data when userId changes
useEffect(() => {
  if (userId) {
    fetchStudentData(userId)
  } else {
    setStudent(null) // Clear student data if no user selected
  }
}, [userId])

const generateQR = async () => {
  if (!userId) {
    alert("Please select user")
    return
  }

  try {
    setLoadingQR(true)

    const res = await axiosInstance.post("/api/v1/attendance/qr", {
      userId: userId,
    })
    console.log(res);

    if (res.data.success) {
      setQrImage(res.data.data.qrCode)
      const studentData = res.data.data.student
      setStudent(studentData)
      
      // 🔥 Debug: Log the entire student object structure
      console.log("===== STUDENT DATA =====")
      console.log("Full Student:", studentData)
      console.log("Keys:", Object.keys(studentData || {}))
      console.log("className:", studentData?.className)
      console.log("class:", studentData?.class)
      console.log("Class (capital C):", studentData?.Class)
      console.log("Section:", studentData?.section)
      console.log("======================")
      
      setQrGenerated(true)
    } else {
      alert(res.data.message)
    }
  } catch (err) {
    console.error(err)
  } finally {
    setLoadingQR(false)
  }
}

const generateIdCard = () => {

  if (!student) {
    alert("Please select a user first")
    return
  }

  // Get class and section info
  let className = ""
  let sectionId = ""
  
  if (student?.section) {
    className = (student.section as any)?.class?.name || ""
    sectionId = (student.section as any)?.name || ""
  }
  
  if (!className) {
    className = student?.className || student?.class || ""
  }
  
  const classAndSection = className && sectionId 
    ? `${className} - ${sectionId}` 
    : className || sectionId || "N/A"

  const validTill = new Date()
  validTill.setFullYear(validTill.getFullYear() + 1)
  const validTillFormatted = validTill.toLocaleDateString()

  const photoUrl = student?.photo || "https://via.placeholder.com/120x120?text=Photo"
  const qrCodeHtml = qrImage ? `<img src="${qrImage}" width="120" height="120" style="border: 1px solid #ddd;"/>` : "<p style='color: #999;'>No QR Code</p>"

  // 🔥 NEW: Check if custom template is selected
  let cardContent = ""
  let templateUsed = "default"
  let printContent = ""
  
  if (selectedTemplate && selectedTemplate.template) {
    // Use selected custom template EXACTLY as-is
    console.log("Using custom template:", selectedTemplate.name)
    templateUsed = selectedTemplate.name
    let customTemplate = selectedTemplate.template
    
    // Replace placeholders with actual data
    const templateData = {
      "{{school_name}}": "ABC Public School",
      "{{school_address}}": "Hingona, Rajasthan",
      "{{student_name}}": student?.name || "N/A",
      "{{roll_no}}": student?.rollNumber || "N/A",
      "{{class}}": classAndSection,
      "{{admission_no}}": student?.admissionNumber || "N/A",
      "{{dob}}": student?.dateOfBirth || student?.dob || "N/A",
      "{{blood_group}}": student?.bloodGroup || "N/A",
      "{{contact}}": student?.fatherPhone || student?.phone || "N/A",
      "{{address}}": student?.currentAddress || student?.address || "N/A",
      "{{valid_till}}": validTillFormatted,
      "{{photo_url}}": photoUrl,
      "{{qr_code}}": qrCodeHtml,
    }
    
    Object.entries(templateData).forEach(([key, value]) => {
      customTemplate = customTemplate.replaceAll(key, String(value))
    })
    
    console.log("Template rendered successfully")
    
    // Generate print content with template rendered directly
    printContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student ID Card - ${templateUsed}</title>
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      background: #ffffff;
      font-family: Arial, sans-serif;
      padding: 20px;
    }

    .print-header {
      text-align: center;
      margin-bottom: 20px;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .print-header h3 {
      margin: 0 0 10px 0;
      color: #004aad;
      font-size: 14px;
    }

    .print-header button {
      padding: 10px 20px;
      background: #004aad;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
    }

    .print-header button:hover {
      background: #003380;
    }

    .template-content {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    @media print {
      .print-header {
        display: none;
      }
      body {
        background: white;
        padding: 10px;
      }
    }
    </style>
    </head>

    <body>
    <div class="print-header">
      <h3>📋 Template: ${templateUsed}</h3>
      <button onclick="window.print()">🖨️ Print / Download ID Card</button>
    </div>

    <div class="template-content">
      ${customTemplate}
    </div>

    </body>
    </html>
    `
  } else {
    // Use default template
    console.log("Using default template")
    cardContent = `
    <div class="card-container">
      <div class="id-card">
        <div class="school-header">
          <h2>ABC Public School</h2>
          <p>Hingona, Rajasthan</p>
          <p><strong>STUDENT ID CARD</strong></p>
        </div>
        <div class="student-photo">
          <img src="${photoUrl}" alt="Student Photo" style="width: 100px; height: 120px; object-fit: cover; border: 2px solid #004aad; border-radius: 4px;"/>
        </div>
        <div class="student-info">
          <p><b>Name:</b> ${student?.name || "N/A"}</p>
          <p><b>Roll No:</b> ${student?.rollNumber || "N/A"}</p>
          <p><b>Class:</b> ${classAndSection}</p>
          <p><b>Admission No:</b> ${student?.admissionNumber || "N/A"}</p>
          <p><b>Date of Birth:</b> ${student?.dateOfBirth || student?.dob || "N/A"}</p>
          <p><b>Blood Group:</b> ${student?.bloodGroup || "N/A"}</p>
          <p><b>Contact:</b> ${student?.fatherPhone || student?.phone || "N/A"}</p>
          <p><b>Address:</b> ${student?.currentAddress || student?.address || "N/A"}</p>
        </div>
        <div class="id-footer">Valid Till: ${validTillFormatted}</div>
      </div>
      <div class="back">
        <div class="school-header">
          <h2>ABC Public School</h2>
          <p><strong>ID CARD - BACK</strong></p>
        </div>
        <div class="qr">
          ${qrCodeHtml}
        </div>
        <div class="back-info">
          <p><b>In case of emergency, contact:</b></p>
          <p>Phone: +91-XXXXXXXXXX</p>
          <p>Email: contact@school.com</p>
          <p style="margin-top: 10px; font-size: 10px; color: #666;">If found, please return to the school office.</p>
        </div>
      </div>
    </div>
    `
  }

  // Generate print window content
  if (!printContent) {
    // Default template print content
    printContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student ID Card</title>
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      background: #ffffff;
      font-family: Arial, sans-serif;
      padding: 20px;
    }

    .print-header {
      text-align: center;
      margin-bottom: 20px;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .print-header h3 {
      margin: 0 0 10px 0;
      color: #004aad;
      font-size: 14px;
    }

    .print-header button {
      padding: 10px 20px;
      background: #004aad;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: bold;
    }

    .print-header button:hover {
      background: #003380;
    }

    .template-content {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin: 20px 0;
    }

    .card-container {
      display: flex;
      gap: 30px;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      width: 100%;
    }

    .id-card, .back {
      width: 350px;
      background: #ffffff;
      border: 2px solid #004aad;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .school-header {
      background: linear-gradient(135deg, #004aad 0%, #0066cc 100%);
      color: white;
      padding: 12px;
      text-align: center;
    }

    .school-header h2 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: bold;
    }

    .school-header p {
      margin: 2px 0;
      font-size: 11px;
    }

    .student-photo {
      text-align: center;
      padding: 15px;
      background: #f9f9f9;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .student-photo img {
      max-width: 100px;
      max-height: 120px;
      border: 2px solid #004aad;
      border-radius: 4px;
      object-fit: cover;
    }

    .student-info {
      padding: 12px;
    }

    .student-info p {
      margin: 6px 0;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
    }

    .student-info b {
      color: #004aad;
      font-weight: 600;
    }

    .id-footer {
      background: #004aad;
      color: white;
      padding: 12px;
      text-align: center;
      font-size: 11px;
      font-weight: bold;
    }

    .qr {
      text-align: center;
      padding: 15px;
      background: #f9f9f9;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr img {
      max-width: 120px;
      height: auto;
      border: 1px solid #ddd;
    }

    .back-info {
      padding: 12px;
      text-align: center;
      color: #333;
      font-size: 12px;
      line-height: 1.6;
    }

    .back-info p {
      margin: 6px 0;
    }

    .back-info b {
      color: #004aad;
    }

    @media print {
      .print-header {
        display: none;
      }
      body {
        background: white;
        padding: 10px;
      }
      .id-card, .back {
        width: 95mm;
        height: auto;
        page-break-inside: avoid;
        margin: 5mm;
      }
    }
    </style>
    </head>

    <body>
    <div class="print-header">
      <h3>📋 Default Template</h3>
      <button onclick="window.print()">🖨️ Print / Download ID Card</button>
    </div>

    <div class="template-content">
      ${cardContent}
    </div>

    </body>
    </html>
    `
  }

  const newTab = window.open("", "_blank")
  if (!newTab) {
    alert("Please allow pop-ups to open print preview")
    return
  }

  // Use proper DOM methods for reliable rendering
  newTab.document.open()
  newTab.document.write(printContent)
  newTab.document.close()
  
  console.log("ID Card generated successfully")
}

const fetchRecentScans = async () => {
  try {
    setLoadingScans(true);
    const res = await axiosInstance.get("/api/v1/attendance");

    if (res.data.success) {
      setRecentScans(res.data.data);
    } else {
      console.error("Failed to fetch recent scans:", res.data.message);
    }
  } catch (err) {
    console.error("Error fetching recent scans:", err);
  } finally {
    setLoadingScans(false);
  }
};

const fetchTemplates = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/templates?type=ID_CARD")

    if (res.data.success) {
      setTemplates(res.data.data)
    }
  } catch (err) {
    console.error("Failed to load templates", err)
  }
}

useEffect(() => {
  fetchRecentScans();
}, []);

useEffect(() => {
  fetchTemplates()
}, [])


  const fetchAttendanceStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axiosInstance.get("/api/v1/attendance/stats?type=QR");

      if (res.data.success) {
        const data = res.data.data;
        setStats([
          {
            label: "Total Attendance",
            value: data.totalAttendance,
            icon: Scan,
            gradient: "from-indigo-500 to-purple-500",
            bg: "bg-secondary/50",
            change: "",
            changeColor: "text-foreground",
          },
          {
            label: "Present",
            value: data.presentCount,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-green-500",
            bg: "bg-secondary/50",
            change: `${((data.presentCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-foreground",
          },
          {
            label: "Absent",
            value: data.absentCount,
            icon: XCircle,
            gradient: "from-pink-500 to-rose-500",
            bg: "bg-secondary/50",
            change: `${((data.absentCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-foreground",
          },
          {
            label: "Late",
            value: data.lateCount,
            icon: Clock,
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-secondary/50",
            change: `${((data.lateCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-foreground",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch attendance stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchAttendanceStats();
    fetchRecentScans();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
              <QrCode className="w-7 h-7 text-primary" /> QR Code Attendance
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Generate & scan QR codes for quick attendance marking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
          </div>
        </div>

        {/* --- Attendance Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loadingStats ? (
            <p className="text-center col-span-4">Loading stats...</p>
          ) : (
            stats.map((s, i) => (
              <Card
                key={i}
                className={`group relative overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${s.bg}`}
              >
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-foreground/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition" />
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}
                    >
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                  {s.change && (
                    <div className="px-5 py-2 bg-background/40 backdrop-blur-sm border-t">
                      <p className={`text-xs font-medium flex items-center gap-1 ${s.changeColor}`}>
                        <TrendingUp className="w-3 h-3" />
                        {s.change}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* QR Generator */}
          <Card className="border-0 shadow-xl overflow-hidden bg-card backdrop-blur-xl hover:shadow-2xl transition-all duration-300">

            {/* Gradient Top Bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                  <QrCode className="w-4 h-4" />
                </span>
                QR Code Generator
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              {/* Branch Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Branch</Label>
                <Select onValueChange={setBranch}>
                  <SelectTrigger className="border-border focus:ring-primary/40">
                    <SelectValue placeholder="Choose Branch" />
                  </SelectTrigger>

                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            {/* Template Select */ }
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Template</Label>

              <Select
                onValueChange={(value) => {
                  setSelectedTemplateId(value)
                  const t = templates.find((tmp) => tmp.id === value)
                  setSelectedTemplate(t)
                }}
              >

                <SelectTrigger className="border-border focus:ring-primary/40">
                  <SelectValue placeholder="Choose Template" />
                </SelectTrigger>

                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>
            </div>

              {/* User Select */}
              <div className="space-y-2">
                <Label>Select User</Label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {userName || "Search user..."}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0 w-full">

                    <Command>

                      <CommandInput placeholder="Search user..." />

                      <CommandList>

                        <CommandEmpty>No user found</CommandEmpty>

                          {users.map((u) => (
                            <CommandItem
                              key={u.id}
                              value={u.name}
                              onSelect={() => {
                                setUserId(u.id)
                                setUserName(u.name)
                                setOpen(false)
                              }}
                            >
                              {u.name}
                            </CommandItem>
                          ))}

                      </CommandList>

                    </Command>

                  </PopoverContent>
                </Popover>
              </div>


              <div className="text-end">
                <Button className="gradient-hero text-primary-foreground shadow-lg" onClick={generateQR} disabled={loadingQR}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {loadingQR ? "Generating..." : "Generate QR"}
                </Button>
              </div>

              {/* QR Display */}
              <div className="flex flex-col items-center py-6">

                <div
                  ref={qrRef}
                  className="w-48 h-48 border border-border rounded-xl flex items-center justify-center bg-card shadow-lg"
                >

                {qrImage ? (
                  <img src={qrImage} alt="QR Code" className="w-40 h-40" />
                ) : (
                  <div className="text-center">
                    <QrCode className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Click generate to create QR
                    </p>
                  </div>
                )}

                {generatedCard && (
                  <div className="mt-6 flex justify-center">

                    <div
                      className="border border-border shadow-lg rounded-xl bg-card p-4"
                      dangerouslySetInnerHTML={{ __html: generatedCard }}
                    />

                  </div>
                )}


                </div>

                {qrGenerated && (
                  <div className="flex gap-2 mt-4">

                    <Button size="sm" variant="outline" onClick={downloadQR}>
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>

                  <div className="text-end">
                    <Button className="gradient-hero text-primary-foreground shadow-lg" onClick={generateIdCard} >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {loadingQR ? "Generating Id Card..." : "Generate Id Card"}
                    </Button>
                  </div>

                  </div>
                )}

              </div>

              {/* How it works */}
              <div className="rounded-xl p-4 bg-secondary/50 border border-border space-y-1">

                <p className="text-xs font-semibold text-foreground">
                  How it works
                </p>

                <p className="text-xs text-muted-foreground">
                  1. Select Branch & generate QR code
                </p>

                <p className="text-xs text-muted-foreground">
                  2. Display on projector or share
                </p>

                <p className="text-xs text-muted-foreground">
                  3. Students scan using school app
                </p>

                <p className="text-xs text-muted-foreground">
                  4. Attendance marked automatically
                </p>

              </div>

            </CardContent>
          </Card>

          {/* Recent Scans */}
          <div className="lg:col-span-2">

            <Card className="border-0 shadow-xl overflow-hidden bg-card backdrop-blur-xl hover:shadow-2xl transition-all">

              {/* Gradient Top Bar */}
              <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

              <CardHeader className="flex-row items-center justify-between space-y-0">

                <CardTitle className="text-lg font-semibold flex items-center gap-2">

                  <span className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                    <Scan className="w-4 h-4" />
                  </span>

                  Recent Scans

                </CardTitle>

                <Badge className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-1">

                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />

                  Live

                </Badge>

              </CardHeader>

              <CardContent>

                <Table>

                  <TableHeader>

                    <TableRow className="bg-secondary/50 dark:bg-secondary/30">

                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {loadingScans ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">
                          Loading recent scans...
                        </TableCell>
                      </TableRow>
                    ) : recentScans.length > 0 ? (
                      recentScans.map((scan) => (
                        <TableRow key={scan.id} className="hover:bg-secondary/30 transition-colors">

                          <TableCell className="font-medium text-foreground">{scan.user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-secondary/50 text-foreground border-border">
                              {scan.user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium"> {scan.createdAt.split('T')[0]}</TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">
                            {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm">
                              {scan.device === "Mobile"
                                ? <Smartphone className="w-4 h-4 text-blue-500" />
                                : <Monitor className="w-4 h-4 text-purple-500" />}
                              {scan.type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`border text-xs px-2 py-1 ${
                                scan.status === "Present"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-amber-100 text-amber-700 border-amber-200"
                              }`}
                            >
                              {scan.status}
                            </Badge>
                          </TableCell>

                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-sm text-muted-foreground">
                          No recent scans found.
                        </TableCell>
                      </TableRow>
                    )}

                  </TableBody>

                </Table>

              </CardContent>

            </Card>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;