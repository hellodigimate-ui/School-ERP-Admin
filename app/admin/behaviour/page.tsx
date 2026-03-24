/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Search,
  Eye,
  Activity,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { axiosInstance } from "@/apiHome/axiosInstanc"

export default function Page() {

  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [viewOpen, setViewOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [pagination, setPagination] = useState<any>(null)

  const handleView = (incident: any) => {
    setSelectedIncident(incident)
    setViewOpen(true)
  }

  const fetchIncidents = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get("/api/v1/incidents", {
        params: {
          name: search || undefined,
          page,
          perPage,
        },
      })

      if (res.data.success) {
        setIncidents(res.data.data)
        setPagination(res.data.pagination)
      }

    } catch (error) {
      console.error("Failed to fetch incidents", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [page, search])

  const severityColor = {
    MINOR: "bg-blue-100 text-blue-700 border-blue-200",
    MODERATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SEVERE: "bg-red-100 text-red-700 border-red-200",
  }

  const stats = [
    {
      label: "Total Incidents",
      value: incidents.length,
      icon: Activity,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Severe",
      value: incidents.filter((i) => i.severity === "SEVERE").length,
      icon: ShieldAlert,
      color: "from-red-500 to-rose-600",
    },
    {
      label: "Moderate",
      value: incidents.filter((i) => i.severity === "MODERATE").length,
      icon: AlertTriangle,
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Minor",
      value: incidents.filter((i) => i.severity === "MINOR").length,
      icon: ShieldCheck,
      color: "from-emerald-500 to-green-600",
    },
  ]

  return (
    <AdminLayout>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Behaviour Records</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage student behaviour incidents
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {stats.map((stat, i) => {
          const Icon = stat.icon

          return (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.color}
              text-white rounded-xl p-5 shadow-lg
              hover:scale-[1.02] transition-transform`}
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm opacity-80">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>

                <Icon size={28} className="opacity-80" />

              </div>

            </div>
          )
        })}

      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">

        <div className="relative w-80">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search student or teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full shadow-sm"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">

        <Table>

          <TableHeader>
            <TableRow className="bg-muted/50">

              <TableHead>#</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Incident</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Actions</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {incidents.map((incident, i) => (

              <TableRow
                key={incident.id}
                className="hover:bg-muted/40 transition"
              >

                <TableCell>
                  {(page - 1) * perPage + i + 1}
                </TableCell>

                <TableCell className="font-medium">
                  {incident.student.name}
                </TableCell>

                <TableCell>
                  {incident.student.section.class.name} -
                  {incident.student.section.name}
                </TableCell>

                <TableCell className="max-w-[200px] truncate">
                  {incident.title || incident.description}
                </TableCell>

                <TableCell>{incident.user.name}</TableCell>

                <TableCell>
                  {new Date(incident.date).toLocaleDateString()}
                </TableCell>

                <TableCell>

                  <Badge
                    className={`border ${severityColor[
                      incident.severity as keyof typeof severityColor
                    ]}`}
                  >
                    {incident.severity}
                  </Badge>

                </TableCell>

                <TableCell className="text-right">

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-indigo-100"
                    onClick={() => handleView(incident)}
                  >
                    <Eye size={16} />
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

        {/* Pagination */}

        <div className="flex justify-between items-center p-4 border-t">

          <p className="text-sm text-muted-foreground">
            Page {pagination?.currentPage || 1} of{" "}
            {pagination?.totalPages || 1}
          </p>

          <div className="flex gap-2">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page === pagination?.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>

          </div>

        </div>

      </div>

      {/* View Modal */}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>

        <DialogContent className="max-w-md">

          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>

          {selectedIncident && (

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium">
                  {selectedIncident.student.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium">
                  {selectedIncident.student.section.class.name} -
                  {selectedIncident.student.section.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Reported By</span>
                <span className="font-medium">
                  {selectedIncident.user.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Incident</span>
                <span className="font-medium">
                  {selectedIncident.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity</span>

                <Badge
                  className={`border ${severityColor[
                    selectedIncident.severity as keyof typeof severityColor
                  ]}`}
                >
                  {selectedIncident.severity}
                </Badge>

              </div>

              <div>
                <p className="text-muted-foreground mb-1">
                  Description
                </p>
                <p className="bg-muted/40 p-3 rounded-lg">
                  {selectedIncident.description}
                </p>
              </div>

            </div>

          )}

        </DialogContent>

      </Dialog>

    </AdminLayout>
  )
}