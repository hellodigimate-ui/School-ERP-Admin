/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CircleCheckBig, Users, X } from "lucide-react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { axiosInstance } from "@/apiHome/axiosInstanc"


export default function Page() {

  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeaveRequests: 0,
  })
  const perPage = 10

  // FETCH LEAVE REQUESTS
const fetchLeaves = async () => {
  try {

    setLoading(true)

    let url = `/api/v1/leave/requests?page=${page}&perPage=${perPage}`

    if (statusFilter !== "all") {
      url += `&status=${statusFilter}`
    }

    const res = await axiosInstance.get(url)

    setLeaveRequests(res.data.data)

    setPagination(res.data.pagination)

  } catch (error) {
    console.error("Leave fetch error", error)
  } finally {
    setLoading(false)
  }
}

  // FETCH STATS
  const fetchStats = async () => {
    try {

      const res = await axiosInstance.get(
        "/api/v1/leave/requests/stats"
      )

      setStats(res.data.data)

    } catch (error) {
      console.error("Stats fetch error", error)
    }
  }

  // UPDATE STATUS
  const updateLeaveStatus = async (id: string, approve: boolean) => {

    try {

      await axiosInstance.put(`/api/v1/leave/requests/${id}`, {
        status: approve,
      })

      fetchLeaves()
      fetchStats()

    } catch (error) {
      console.error("Update error", error)
    }
  }

  useEffect(() => {
    fetchLeaves()
    fetchStats()
  }, [statusFilter, page])

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"

      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200"

      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200"

      default:
        return "bg-muted"
    }
  }

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-7 h-7" />
            Leave Management
          </h1>

          <p className="text-sm opacity-90 mt-1">
            Manage and approve leave requests
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <p>Total</p>
          <h3 className="text-3xl font-bold">{stats.total || 0}</h3>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
          <p>Pending</p>
          <h3 className="text-3xl font-bold">{stats.pending || 0}</h3>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
          <p>Approved</p>
          <h3 className="text-3xl font-bold">{stats.approved || 0}</h3>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-red-400 to-pink-600 text-white shadow-lg">
          <p>Rejected</p>
          <h3 className="text-3xl font-bold">{stats.rejected || 0}</h3>
        </div>

      </div>

      {/* FILTER */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-md p-6">

        <div className="flex justify-between mb-4">

          <h2 className="text-lg font-semibold">
            Leave Requests
          </h2>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >

            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All
              </SelectItem>

              <SelectItem value="PENDING">
                Pending
              </SelectItem>

              <SelectItem value="APPROVED">
                Approved
              </SelectItem>

              <SelectItem value="REJECTED">
                Rejected
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        {/* TABLE */}
        <Table>

          <TableHeader>

            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>

            {loading ? (

              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>

            ) : (

              leaveRequests.map((leave) => (

                <TableRow key={leave.id}>

                  <TableCell>
                    {leave.user?.name}
                  </TableCell>

                  <TableCell>
                    {leave.type}
                  </TableCell>

                  <TableCell>
                    {leave.user?.role}
                  </TableCell>

                  <TableCell>
                    {leave.fromDate.slice(0,10)}
                  </TableCell>

                  <TableCell>
                    {leave.toDate.slice(0,10)}
                  </TableCell>

                  <TableCell>
                    {leave.reason}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor(leave.status)}
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>

                  <TableCell>

                    <div className="flex gap-2">

                        <Button
                            size="icon"
                            disabled={leave.status !== "PENDING"}
                            className="bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50"
                            onClick={() => updateLeaveStatus(leave.id, true)}
                        >
                            <CircleCheckBig size={16} />
                        </Button>

                        <Button
                            size="icon"
                            disabled={leave.status !== "PENDING"}
                            className="bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                            onClick={() => updateLeaveStatus(leave.id, false)}
                        >
                            <X size={16} />
                        </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

            <div className="flex items-center justify-between mt-6">

            <p className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">

                <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                >
                Previous
                </Button>

                <Button
                variant="outline"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                >
                Next
                </Button>

            </div>

            </div>

        </Table>

      </div>

    </AdminLayout>
  )
}