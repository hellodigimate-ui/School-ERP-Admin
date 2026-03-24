"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

import {
  ScanFace,
  Camera,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Upload,
  Eye,
  RefreshCw,
  Shield,
} from "lucide-react"

import { AdminLayout } from "@/components/layout/AdminLayout"

const stats = [
  {
    label: "Faces Enrolled",
    value: "1,240",
    icon: ScanFace,
    gradient: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    change: "+15 this week",
  },
  {
    label: "Recognized Today",
    value: "398",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
    change: "96.1% accuracy",
  },
  {
    label: "Unrecognized",
    value: "14",
    icon: AlertTriangle,
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    change: "Needs review",
  },
  {
    label: "Active Cameras",
    value: "8",
    icon: Camera,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    change: "All online",
  },
]

const cameraFeeds = [
  { id: 1, name: "Main Gate - Camera 1", location: "Entry Gate", status: "Active", recognized: 124, fps: 30 },
  { id: 2, name: "Main Gate - Camera 2", location: "Entry Gate", status: "Active", recognized: 98, fps: 28 },
  { id: 3, name: "Building A - Entrance", location: "Block A", status: "Active", recognized: 86, fps: 30 },
  { id: 4, name: "Building B - Entrance", location: "Block B", status: "Active", recognized: 72, fps: 29 },
  { id: 5, name: "Corridor - Floor 1", location: "Block A", status: "Active", recognized: 45, fps: 25 },
  { id: 6, name: "Corridor - Floor 2", location: "Block A", status: "Maintenance", recognized: 0, fps: 0 },
]

const recognitionLog = [
  { id: 1, student: "Aarav Patel", class: "10-A", confidence: 98.5, time: "07:58 AM", camera: "Main Gate - 1", status: "Verified" },
  { id: 2, student: "Priya Sharma", class: "10-A", confidence: 97.2, time: "08:01 AM", camera: "Main Gate - 1", status: "Verified" },
  { id: 3, student: "Unknown", class: "-", confidence: 42.1, time: "08:03 AM", camera: "Main Gate - 2", status: "Unrecognized" },
  { id: 4, student: "Rohit Kumar", class: "10-A", confidence: 95.8, time: "08:04 AM", camera: "Building A", status: "Verified" },
  { id: 5, student: "Ananya Singh", class: "10-B", confidence: 99.1, time: "08:05 AM", camera: "Main Gate - 1", status: "Verified" },
  { id: 6, student: "Kiran Yadav", class: "10-B", confidence: 68.3, time: "08:07 AM", camera: "Main Gate - 2", status: "Low Confidence" },
]

const Page = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <ScanFace className="w-6 h-6" />
              </span>

              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Face Recognition Attendance
              </span>
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              AI powered facial recognition attendance
            </p>
          </div>

          <div className="flex gap-2">

            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Enroll Faces
            </Button>

            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <Camera className="w-4 h-4 mr-2" />
              Start Recognition
            </Button>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {stats.map((s, i) => (
            <Card key={i} className={`border-0 shadow-md hover:shadow-xl transition ${s.bg}`}>

              <CardContent className="p-5">

                <div className="flex items-center gap-4">

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.gradient} flex items-center justify-center`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>

                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {s.change}
                </div>

              </CardContent>

            </Card>
          ))}

        </div>

        {/* Camera Feeds */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">

          <CardHeader className="flex-row items-center justify-between">

            <CardTitle>Camera Feeds</CardTitle>

            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200">
              5 / 6 Active
            </Badge>

          </CardHeader>

          <CardContent>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {cameraFeeds.map((cam) => (

                <Card key={cam.id} className="overflow-hidden">

                  <div className={`h-32 flex items-center justify-center relative ${
                    cam.status === "Active"
                      ? "bg-gradient-to-br from-slate-900 to-slate-700"
                      : "bg-muted"
                  }`}>

                    {cam.status === "Active" ? (
                      <>
                        <Camera className="w-10 h-10 text-white/50" />

                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
                          REC
                        </Badge>

                        <Badge className="absolute top-2 right-2 text-[10px]">
                          {cam.fps} FPS
                        </Badge>

                        <span className="absolute bottom-2 right-2 text-[10px] text-white">
                          {cam.recognized} scans
                        </span>
                      </>
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                    )}

                  </div>

                  <CardContent className="p-3 flex justify-between items-center">

                    <div>
                      <p className="text-sm font-medium">{cam.name}</p>
                      <p className="text-xs text-muted-foreground">{cam.location}</p>
                    </div>

                    <Badge className={cam.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                    }>
                      {cam.status}
                    </Badge>

                  </CardContent>

                </Card>

              ))}

            </div>

          </CardContent>

        </Card>

        {/* Recognition Log */}
        <Card className="border-0 shadow-xl">

          <CardHeader className="flex-row justify-between items-center">

            <CardTitle>Recognition Log</CardTitle>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>

          </CardHeader>

          <CardContent>

            <Table>

              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-50 to-green-50">

                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Camera</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {recognitionLog.map((log) => (

                  <TableRow key={log.id} className="hover:bg-emerald-50/40">

                    <TableCell className="font-medium">{log.student}</TableCell>

                    <TableCell>
                      <Badge variant="outline">{log.class}</Badge>
                    </TableCell>

                    <TableCell>

                      <div className="flex items-center gap-2">

                        <Progress value={log.confidence} className="w-20 h-2" />

                        <span className={`text-xs font-mono ${
                          log.confidence > 90
                            ? "text-emerald-600"
                            : log.confidence > 60
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}>
                          {log.confidence}%
                        </span>

                      </div>

                    </TableCell>

                    <TableCell className="text-sm font-mono">
                      {log.time}
                    </TableCell>

                    <TableCell>{log.camera}</TableCell>

                    <TableCell>

                      <Badge className={
                        log.status === "Verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : log.status === "Low Confidence"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }>
                        {log.status}
                      </Badge>

                    </TableCell>

                    <TableCell>

                      <div className="flex gap-1">

                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button size="sm" variant="ghost">
                          <Shield className="w-4 h-4" />
                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>
    </AdminLayout>
  )
}

export default Page