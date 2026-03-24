"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, IndianRupeeIcon } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const dueRecords = [
  { id: 1, student: "Rohan Gupta", class: "8-A", admNo: "ADM-003", feeType: "Tuition Fees", totalDue: "₹52,000", dueDate: "2026-01-10", overdueDays: 33, parent: "Mr. Gupta", phone: "9876543212" },
  { id: 2, student: "Sneha Reddy", class: "1-A", admNo: "ADM-004", feeType: "Transport Fees", totalDue: "₹10,000", dueDate: "2026-02-10", overdueDays: 2, parent: "Mrs. Reddy", phone: "9876543213" },
  { id: 3, student: "Amit Jain", class: "6-B", admNo: "ADM-006", feeType: "Tuition + Book", totalDue: "₹15,000", dueDate: "2026-01-15", overdueDays: 28, parent: "Mr. Jain", phone: "9876543215" },
  { id: 4, student: "Kavya Nair", class: "4-A", admNo: "ADM-007", feeType: "Admission Fees", totalDue: "₹8,000", dueDate: "2026-02-01", overdueDays: 11, parent: "Mrs. Nair", phone: "9876543216" },
  { id: 5, student: "Deepak Verma", class: "9-B", admNo: "ADM-008", feeType: "Hostel Fees", totalDue: "₹25,000", dueDate: "2025-12-15", overdueDays: 59, parent: "Mr. Verma", phone: "9876543217" },
];

const Page = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Search Due Fees</h1>
            <p className="text-gray-500 text-sm mt-1">
              Find students with pending fee payments
            </p>
          </div>

          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white gap-2 shadow-md rounded-xl transition-all">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Due Amount", value: "₹8,20,000", gradient: "from-pink-200 to-rose-200", text: "text-rose-700" },
            { label: "Students with Dues", value: "67", gradient: "from-indigo-200 to-blue-200", text: "text-indigo-700" },
            { label: "Overdue (>30 days)", value: "18", gradient: "from-purple-200 to-violet-200", text: "text-violet-700" },
          ].map((s) => (
            <Card
              key={s.label}
              className={`border-0 rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                  <IndianRupeeIcon className={`w-6 h-6 ${s.text}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">

              <div className="flex-1 min-w-[220px]">
                <Label className="text-xs text-gray-600">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input className="pl-9 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400" placeholder="Name, admission no..." />
                </div>
              </div>

              <div className="w-[150px]">
                <Label className="text-xs text-gray-600">Class</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-400">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[170px]">
                <Label className="text-xs text-gray-600">Fee Type</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-400">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="tuition">Tuition</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="admission">Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-6 shadow-md">
                Search
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <TableHead>Adm No</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Due Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Overdue</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dueRecords.map((r) => (
                  <TableRow key={r.id} className="hover:bg-indigo-50/40 transition">
                    <TableCell>
                      <code className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md">
                        {r.admNo}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">{r.student}</TableCell>
                    <TableCell>{r.class}</TableCell>
                    <TableCell>{r.feeType}</TableCell>
                    <TableCell>{r.parent}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell className="text-right font-semibold text-rose-500">
                      {r.totalDue}
                    </TableCell>
                    <TableCell>{r.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.overdueDays > 30
                            ? "bg-rose-100 text-rose-600 rounded-full"
                            : r.overdueDays > 7
                            ? "bg-amber-100 text-amber-600 rounded-full"
                            : "bg-blue-100 text-blue-600 rounded-full"
                        }
                      >
                        {r.overdueDays} days
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
