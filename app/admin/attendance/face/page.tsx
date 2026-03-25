/* eslint-disable @typescript-eslint/no-explicit-any */
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

import {
  ScanFace,
  Camera,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { useEffect, useState } from "react"
import { axiosInstance } from "@/apiHome/axiosInstanc"

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
    console.error("Error fetching external attendance:", err);
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

        {/* Recognition Log */}
<Card className="border-0 shadow-xl mt-6">

  <CardHeader className="flex-row justify-between items-center">
    <CardTitle>External Attendance</CardTitle>

    <Button variant="outline" size="sm" onClick={fetchExternalAttendance}>
      <RefreshCw className="w-3 h-3 mr-1" />
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

              <TableCell>{item.empCode}</TableCell>

              <TableCell>
                {item.user?.name || "-"}
              </TableCell>

              <TableCell>
                {item.user?.role || "-"}
              </TableCell>

              <TableCell>
                {item.user?.email || "-"}
              </TableCell>

              <TableCell>{item.date}</TableCell>

              <TableCell>{item.inTime}</TableCell>

              <TableCell>
                <Badge className={
                  item.status === "P"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
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
  )
}

export default Page