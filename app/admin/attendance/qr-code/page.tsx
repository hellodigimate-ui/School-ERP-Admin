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
  name?: string
  photo?: string
  profile?: StudentProfile
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
      setStudent(res.data.data.student)
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

  if (!selectedTemplate) {
    alert("Select template first")
    return
  }

  if (!qrImage) {
    alert("Generate QR first")
    return
  }

  const validTill = new Date()
  validTill.setFullYear(validTill.getFullYear() + 1)

  const validTillFormatted = validTill.toLocaleDateString()

  const profile: StudentProfile = student?.profile ?? {}

  let html = selectedTemplate.template

const data: Record<string, string> = {
  "{{class}}": `${profile?.className || ""} ${profile?.sectionId || ""}`,
  "{{student_name}}": student?.name || "",
  "{{roll_no}}": profile?.rollNumber || "",
  "{{dob}}": profile?.dateOfBirth || "",
  "{{blood_group}}": profile?.bloodGroup || "",
  "{{photo_url}}": student?.photo || "https://via.placeholder.com/120",
  "{{admission_no}}": profile?.admissionNumber || "",
  "{{address}}": profile?.currentAddress || "",
  "{{contact}}": profile?.fatherPhone || "",
  "{{valid_till}}": validTillFormatted,
  "{{school_name}}": "ABC Public School",
  "{{school_address}}": "Hingona, Rajasthan",
  "{{qr_code}}": `<img src="${qrImage}" width="120"/>`,
}

  Object.keys(data).forEach((key) => {
    html = html.replaceAll(key, data[key])
  })

  const newTab = window.open("", "_blank")

  if (!newTab) return

  newTab.document.write(`
  <html>
  <head>
  <title>ID Card</title>

  <style>
  body{
    margin:0;
    padding:40px;
    background:#f1f5f9;
    font-family:Arial;
    text-align:center;
  }

  .print-btn{
    padding:10px 18px;
    background:#4f46e5;
    color:white;
    border:none;
    border-radius:6px;
    cursor:pointer;
    margin-bottom:20px;
  }

  </style>

  </head>

  <body>

  <button class="print-btn" onclick="window.print()">Print / Download</button>

  ${html}

  </body>
  </html>
  `)

  newTab.document.close()
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
            bg: "bg-indigo-50",
            change: "",
            changeColor: "text-indigo-600",
          },
          {
            label: "Present",
            value: data.presentCount,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-green-500",
            bg: "bg-emerald-50",
            change: `${((data.presentCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-emerald-600",
          },
          {
            label: "Absent",
            value: data.absentCount,
            icon: XCircle,
            gradient: "from-pink-500 to-rose-500",
            bg: "bg-pink-50",
            change: `${((data.absentCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-rose-600",
          },
          {
            label: "Late",
            value: data.lateCount,
            icon: Clock,
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50",
            change: `${((data.lateCount / data.totalAttendance) * 100).toFixed(1)}%`,
            changeColor: "text-blue-600",
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
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition" />
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
                    <div className="px-5 py-2 bg-white/40 backdrop-blur-sm border-t">
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
          <Card className="border-0 shadow-xl overflow-hidden bg-white/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">

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
                  <SelectTrigger className="border-indigo-200 focus:ring-indigo-400">
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

                <SelectTrigger className="border-indigo-200 focus:ring-indigo-400">
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
                  className="w-48 h-48 border rounded-xl flex items-center justify-center bg-white shadow-lg"
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
                      className="border shadow-lg rounded-xl bg-white p-4"
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
              <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 space-y-1">

                <p className="text-xs font-semibold text-indigo-700">
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

            <Card className="border-0 shadow-xl overflow-hidden bg-white/70 backdrop-blur-xl hover:shadow-2xl transition-all">

              {/* Gradient Top Bar */}
              <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

              <CardHeader className="flex-row items-center justify-between space-y-0">

                <CardTitle className="text-lg font-semibold flex items-center gap-2">

                  <span className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                    <Scan className="w-4 h-4" />
                  </span>

                  Recent Scans

                </CardTitle>

                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1">

                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />

                  Live

                </Badge>

              </CardHeader>

              <CardContent>

                <Table>

                  <TableHeader>

                    <TableRow className="bg-gradient-to-r from-emerald-50 to-green-50">

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
                        <TableRow key={scan.id} className="hover:bg-emerald-50/40 transition-colors">

                          <TableCell className="font-medium text-foreground">{scan.user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
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