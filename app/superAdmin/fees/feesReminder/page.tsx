"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send, MessageSquare, Mail, Search, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

const dueStudents = [
  { id: 1, student: "Rohan Gupta", class: "8-A", admNo: "ADM-003", dueAmount: "₹52,000", dueDate: "2026-01-10", parent: "Mr. Gupta", phone: "9876543212" },
  { id: 2, student: "Sneha Reddy", class: "1-A", admNo: "ADM-004", dueAmount: "₹10,000", dueDate: "2026-02-10", parent: "Mrs. Reddy", phone: "9876543213" },
  { id: 3, student: "Amit Jain", class: "6-B", admNo: "ADM-006", dueAmount: "₹15,000", dueDate: "2026-01-15", parent: "Mr. Jain", phone: "9876543215" },
  { id: 4, student: "Kavya Nair", class: "4-A", admNo: "ADM-007", dueAmount: "₹8,000", dueDate: "2026-02-01", parent: "Mrs. Nair", phone: "9876543216" },
];

const Page = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fees Reminder</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Send fee reminders via SMS, Email, or WhatsApp
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Due Students", value: "67", icon: Bell, gradient: "from-pink-200 to-rose-200", iconColor: "text-rose-600" },
            { label: "Reminders Sent Today", value: "12", icon: Send, gradient: "from-blue-200 to-indigo-200", iconColor: "text-indigo-600" },
            { label: "SMS Sent", value: "234", icon: MessageSquare, gradient: "from-purple-200 to-violet-200", iconColor: "text-violet-600" },
            { label: "Emails Sent", value: "189", icon: Mail, gradient: "from-emerald-200 to-green-200", iconColor: "text-emerald-600" },
          ].map((s) => (
            <Card
              key={s.label}
              className={`border-0 rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Section */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">

              {/* Search */}
              <div className="flex-1 min-w-[220px]">
                <Label className="text-xs text-gray-600">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input className="pl-9 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400" placeholder="Search student..." />
                </div>
              </div>

              {/* Class Select */}
              <div className="w-[150px]">
                <Label className="text-xs text-gray-600">Class</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-400">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="sms">
                <TabsList className="bg-gray-100 rounded-xl">
                  <TabsTrigger value="sms" className="text-xs gap-1">
                    <MessageSquare className="w-3 h-3" /> SMS
                  </TabsTrigger>
                  <TabsTrigger value="email" className="text-xs gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp" className="text-xs gap-1">
                    <Send className="w-3 h-3" /> WhatsApp
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Button */}
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white gap-2 shadow-md hover:shadow-lg transition-all rounded-xl">
                <Send className="w-4 h-4" /> Send Reminder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <TableHead><Checkbox /></TableHead>
                  <TableHead>Adm No</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Due Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dueStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-indigo-50/50 transition">
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>
                      <code className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md">
                        {s.admNo}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {s.student}
                    </TableCell>
                    <TableCell>{s.class}</TableCell>
                    <TableCell>{s.parent}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell className="text-right font-semibold text-rose-500">
                      {s.dueAmount}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-600 rounded-full px-3 hover:bg-indigo-100">
                        {s.dueDate}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs rounded-full shadow-md"
                      >
                        Collect <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
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
