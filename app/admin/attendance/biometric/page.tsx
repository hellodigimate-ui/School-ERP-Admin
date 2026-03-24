"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  Fingerprint,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";


const stats = [
  {
    label: "Total Enrolled",
    value: "1,180",
    icon: Fingerprint,
    gradient: "from-indigo-500 to-purple-500",
    change: "+8 new enrollments",
  },
  {
    label: "Marked Today",
    value: "405",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500",
    change: "95.2% present",
  },
  {
    label: "Failed Scans",
    value: "7",
    icon: XCircle,
    gradient: "from-rose-500 to-pink-500",
    change: "1.7% retry rate",
  },
  {
    label: "Devices Online",
    value: "12",
    icon: Wifi,
    gradient: "from-cyan-500 to-blue-500",
    change: "All connected",
  },
];


const devices = [
  { id: 1, name: "BIO-001", location: "Main Gate A", type: "Fingerprint", status: "Online", scans: 142, lastSync: "2 min ago" },
  { id: 2, name: "BIO-002", location: "Main Gate B", type: "Fingerprint", status: "Online", scans: 118, lastSync: "1 min ago" },
  { id: 3, name: "BIO-003", location: "Block A Entry", type: "Fingerprint + Face", status: "Online", scans: 86, lastSync: "3 min ago" },
  { id: 4, name: "BIO-004", location: "Block B Entry", type: "Fingerprint", status: "Online", scans: 74, lastSync: "2 min ago" },
  { id: 5, name: "BIO-005", location: "Staff Room", type: "Fingerprint", status: "Online", scans: 45, lastSync: "1 min ago" },
  { id: 6, name: "BIO-006", location: "Library", type: "Fingerprint", status: "Offline", scans: 0, lastSync: "45 min ago" },
];


const recentLogs = [
  { id: 1, student: "Aarav Patel", class: "10-A", device: "BIO-001", finger: "Right Index", time: "07:55 AM", status: "Success" },
  { id: 2, student: "Priya Sharma", class: "10-A", device: "BIO-001", finger: "Right Thumb", time: "07:57 AM", status: "Success" },
  { id: 3, student: "Rohit Kumar", class: "10-A", device: "BIO-002", finger: "Left Index", time: "07:58 AM", status: "Success" },
  { id: 4, student: "Unknown", class: "-", device: "BIO-001", finger: "N/A", time: "08:00 AM", status: "Failed" },
  { id: 5, student: "Ananya Singh", class: "10-B", device: "BIO-003", finger: "Right Index", time: "08:02 AM", status: "Success" },
  { id: 6, student: "Kiran Yadav", class: "10-B", device: "BIO-002", finger: "Right Thumb", time: "08:03 AM", status: "Retry" },
  { id: 7, student: "Kiran Yadav", class: "10-B", device: "BIO-002", finger: "Left Index", time: "08:03 AM", status: "Success" },
];


const Page = () => {

  const [search, setSearch] = useState("");

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

            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <Fingerprint className="w-4 h-4 mr-2" />
              Enroll Student
            </Button>

          </div>

        </div>


        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {stats.map((s, i) => (

            <Card
              key={i}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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


        {/* Devices */}

        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-lg">

          <CardHeader className="flex-row items-center justify-between">

            <CardTitle>Biometric Devices</CardTitle>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-3 h-3 mr-1" />
              Sync All
            </Button>

          </CardHeader>


          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {devices.map((dev) => (

                <Card
                  key={dev.id}
                  className={`border hover:shadow-md transition ${dev.status === "Offline" ? "opacity-60" : ""
                    }`}
                >

                  <CardContent className="p-4">

                    <div className="flex items-start justify-between mb-3">

                      <div className="flex items-center gap-2">

                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${dev.status === "Online"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                              : "bg-muted"
                            }`}
                        >
                          <Fingerprint className="w-5 h-5 text-white" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">{dev.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dev.location}
                          </p>
                        </div>

                      </div>

                      <Badge
                        className={`text-xs border ${dev.status === "Online"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-red-100 text-red-700 border-red-200"
                          }`}
                      >
                        {dev.status === "Online"
                          ? <Wifi className="w-3 h-3 mr-1" />
                          : <WifiOff className="w-3 h-3 mr-1" />
                        }
                        {dev.status}
                      </Badge>

                    </div>


                    <div className="grid grid-cols-3 gap-2 text-center bg-muted/50 rounded-lg p-2">

                      <div>
                        <p className="text-lg font-bold">{dev.scans}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Scans
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium">{dev.type}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Type
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium">{dev.lastSync}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Last Sync
                        </p>
                      </div>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          </CardContent>

        </Card>


        {/* Scan Log */}

        <Card className="border-0 shadow-xl">

          <CardHeader className="flex-row items-center justify-between">

            <CardTitle>Scan Log</CardTitle>

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                className="pl-9 w-56"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </CardHeader>


          <CardContent>

            <Table>

              <TableHeader>

                <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50">

                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Finger</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {recentLogs
                  .filter((l) =>
                    l.student.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((log) => (

                    <TableRow
                      key={log.id}
                      className="hover:bg-emerald-50/40 transition"
                    >

                      <TableCell className="font-medium">
                        {log.student}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{log.class}</Badge>
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {log.device}
                      </TableCell>

                      <TableCell className="text-sm">
                        {log.finger}
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {log.time}
                      </TableCell>

                      <TableCell>

                        <Badge
                          className={`border text-xs ${log.status === "Success"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : log.status === "Retry"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                        >
                          {log.status}
                        </Badge>

                      </TableCell>

                    </TableRow>

                  ))}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>

    </AdminLayout>
  );
};

export default Page;