/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState } from "react";
import { Search, UserX, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/layout/AdminLayout";

const mockDisabled = [
  { id: "ADM-2024-015", name: "Rajesh Verma", class: "9-A", disabledDate: "2024-12-01", reason: "Transferred to another school", phone: "9876543220" },
  { id: "ADM-2024-022", name: "Sunita Devi", class: "8-B", disabledDate: "2024-11-15", reason: "Left due to relocation", phone: "9876543221" },
  { id: "ADM-2024-031", name: "Amit Gupta", class: "10-A", disabledDate: "2025-01-10", reason: "Long absence - no contact", phone: "9876543222" },
  { id: "ADM-2023-045", name: "Pooja Rani", class: "7-C", disabledDate: "2024-08-20", reason: "Fee non-payment", phone: "9876543223" },
  { id: "ADM-2024-008", name: "Karan Singh", class: "11-A", disabledDate: "2025-02-01", reason: "Disciplinary action", phone: "9876543224" },
];

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const filtered = mockDisabled.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm);
    const matchesClass = classFilter === "all" || s.class.startsWith(classFilter);
    return matchesSearch && matchesClass;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
              Disabled Students
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage deactivated student records
            </p>
          </div>

          <Badge className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 text-xs font-medium shadow-sm">
            <UserX className="w-3.5 h-3.5 mr-1.5" />
            {mockDisabled.length} Disabled
          </Badge>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 leading-relaxed">
            Disabled students are excluded from attendance, active lists, and fee calculations.
            Re-enable them anytime to restore access.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Total Disabled", value: "5", bg: "bg-gradient-to-br from-indigo-100 to-indigo-50", text: "text-indigo-600" },
            { label: "This Month", value: "1", bg: "bg-gradient-to-br from-yellow-100 to-yellow-50", text: "text-yellow-600" },
            { label: "Transfers", value: "2", bg: "bg-gradient-to-br from-sky-100 to-sky-50", text: "text-sky-600" },
            { label: "Other Reasons", value: "3", bg: "bg-gradient-to-br from-pink-100 to-pink-50", text: "text-pink-600" },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300`}
            >
              <p className="text-xs font-medium text-gray-500">{s.label}</p>
              <p className={`text-3xl font-bold mt-2 ${s.text}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-4 items-center">

              <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-gray-50 px-3 rounded-lg border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-9 text-sm"
                />
              </div>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[160px] h-9 text-sm border-gray-200 rounded-lg">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {["7","8","9","10","11"].map(c => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-semibold text-gray-600">Adm No</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Student Name</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Class</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Disabled Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Reason</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Phone</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((s) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    <TableCell className="text-xs font-mono text-indigo-600">
                      {s.id}
                    </TableCell>

                    <TableCell className="text-sm font-medium text-gray-800">
                      {s.name}
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      {s.class}
                    </TableCell>

                    <TableCell className="text-sm text-gray-500">
                      {s.disabledDate}
                    </TableCell>

                    <TableCell className="text-xs max-w-[180px] truncate text-gray-600">
                      {s.reason}
                    </TableCell>

                    <TableCell className="text-sm text-gray-700">
                      {s.phone}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                          title="Re-enable"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-100 rounded-lg"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
};

export default page;