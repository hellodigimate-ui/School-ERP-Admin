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
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";


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



const Page = () => {

  const [externalAttendance, setExternalAttendance] = useState<any[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);

  const fetchExternalAttendance = async () => {
  try {
    setLoadingExternal(true);

    const res = await axiosInstance.get("/api/v1/attendance/external");

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


        {/* Scan Log */}

<Card className="border-0 shadow-xl mt-6">

  <CardHeader className="flex-row items-center justify-between">
    <CardTitle>External Biometric Attendance</CardTitle>

    <Button variant="outline" size="sm" onClick={fetchExternalAttendance}>
      <RefreshCcw className="w-4 h-4 mr-1" />
      Refresh
    </Button>
  </CardHeader>

  <CardContent>

    <Table>

      <TableHeader>
        <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <TableHead>Emp Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>In Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>

        {loadingExternal ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              Loading...
            </TableCell>
          </TableRow>
        ) : externalAttendance.length > 0 ? (
          externalAttendance.map((item, index) => (
            <TableRow key={index} className="hover:bg-indigo-50/40">

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

    </AdminLayout>
  );
};

export default Page;