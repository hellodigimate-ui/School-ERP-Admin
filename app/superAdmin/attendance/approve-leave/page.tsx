// /* eslint-disable react-hooks/rules-of-hooks */
"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarOff, Clock, CheckCircle, XCircle,
  TrendingUp, Search,  Eye, Check, X, FileText
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const stats = [
  {
    label: "Pending Requests",
    value: "18",
    icon: Clock,
    gradient: "from-orange-500 to-amber-500",
    change: "5 urgent",
  },
  {
    label: "Approved Today",
    value: "12",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500",
    change: "+3 this hour",
  },
  {
    label: "Rejected",
    value: "4",
    icon: XCircle,
    gradient: "from-rose-500 to-pink-500",
    change: "2 appealed",
  },
  {
    label: "On Leave Today",
    value: "26",
    icon: CalendarOff,
    gradient: "from-blue-500 to-cyan-500",
    change: "6.3% of total",
  },
];

const pendingLeaves = [
  { id: "LV-001", student: "Aarav Patel", class: "10-A", type: "Sick Leave", from: "2024-04-02", to: "2024-04-03", days: 2, reason: "High fever and cold", parent: "Mr. Rajesh Patel", phone: "9876543210", applied: "2024-04-01" },
  { id: "LV-002", student: "Priya Sharma", class: "9-B", type: "Family Emergency", from: "2024-04-03", to: "2024-04-05", days: 3, reason: "Family function in hometown", parent: "Mrs. Sunita Sharma", phone: "9876543211", applied: "2024-04-01" },
  { id: "LV-003", student: "Rohit Kumar", class: "11-A", type: "Medical", from: "2024-04-04", to: "2024-04-04", days: 1, reason: "Dental appointment", parent: "Mr. Suresh Kumar", phone: "9876543212", applied: "2024-04-02" },
  { id: "LV-004", student: "Meera Das", class: "10-B", type: "Sports Event", from: "2024-04-05", to: "2024-04-07", days: 3, reason: "State level cricket tournament", parent: "Mr. Anil Das", phone: "9876543213", applied: "2024-04-02" },
  { id: "LV-005", student: "Ananya Singh", class: "8-C", type: "Personal", from: "2024-04-03", to: "2024-04-03", days: 1, reason: "Passport renewal appointment", parent: "Mrs. Ritu Singh", phone: "9876543214", applied: "2024-04-02" },
];

const historyLeaves = [
  { id: "LV-090", student: "Kiran Yadav", class: "12-A", type: "Sick Leave", from: "2024-03-28", to: "2024-03-29", days: 2, status: "Approved", approvedBy: "Mr. Principal" },
  { id: "LV-089", student: "Sneha Gupta", class: "9-A", type: "Family", from: "2024-03-25", to: "2024-03-27", days: 3, status: "Approved", approvedBy: "Class Teacher" },
  { id: "LV-088", student: "Arjun Reddy", class: "11-B", type: "Medical", from: "2024-03-22", to: "2024-03-22", days: 1, status: "Rejected", approvedBy: "Mr. Principal" },
  { id: "LV-087", student: "Divya Nair", class: "10-A", type: "Personal", from: "2024-03-20", to: "2024-03-21", days: 2, status: "Approved", approvedBy: "Class Teacher" },
];

const typeColor = (t: string) => {
  switch (t) {
    case "Sick Leave": return "bg-red-100 text-red-700 border-red-200";
    case "Medical": return "bg-orange-100 text-orange-700 border-orange-200";
    case "Family Emergency": case "Family": return "bg-purple-100 text-purple-700 border-purple-200";
    case "Sports Event": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Personal": return "bg-slate-100 text-slate-700 border-slate-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<typeof pendingLeaves[0] | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">

            <span className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <CalendarOff className="w-6 h-6" />
            </span>

            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Approve Leave Requests
            </span>

          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Review and manage student leave applications
          </p>
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
                    <p className="text-3xl font-bold text-foreground">{s.value}</p>
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

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-md border shadow-sm p-1 rounded-xl">

            <TabsTrigger
              value="pending"
              className="rounded-lg px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-1" />
              Pending ({pendingLeaves.length})
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="rounded-lg px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-1" />
              History
            </TabsTrigger>

          </TabsList>

          {/* PENDING LAB */}

          <TabsContent value="pending">

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">

              <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />

              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">

                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Pending Leave Requests
                </CardTitle>

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    className="pl-9 w-60 focus-visible:ring-orange-400"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                </div>

              </CardHeader>


              <CardContent className="space-y-4">

                {pendingLeaves
                  .filter(l => l.student.toLowerCase().includes(search.toLowerCase()))
                  .map((leave) => (

                    <Card
                      key={leave.id}
                      className="border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-[2px]"
                    >

                      <CardContent className="p-4">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">


                          {/* Student Info */}

                          <div className="flex items-start gap-3">

                            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                              {leave.student.split(" ").map(n => n[0]).join("")}
                            </div>

                            <div>

                              <div className="flex items-center gap-2 flex-wrap">

                                <p className="font-semibold text-foreground">
                                  {leave.student}
                                </p>

                                <Badge variant="outline">
                                  {leave.class}
                                </Badge>

                                <Badge className={`${typeColor(leave.type)} border`}>
                                  {leave.type}
                                </Badge>

                              </div>

                              <p className="text-sm text-muted-foreground mt-1">
                                {leave.reason}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">

                                <span>
                                  {leave.from} → {leave.to}
                                </span>

                                <span className="font-medium">
                                  {leave.days} day(s)
                                </span>

                                <span>
                                  Parent: {leave.parent}
                                </span>

                              </div>

                            </div>

                          </div>



                          {/* Actions */}

                          <div className="flex gap-2 flex-shrink-0">

                            <Dialog>

                              <DialogTrigger asChild>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs hover:bg-muted"
                                  onClick={() => setSelectedLeave(leave)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>

                              </DialogTrigger>


                              <DialogContent className="max-w-md">

                                <DialogHeader>

                                  <DialogTitle>
                                    Leave Details - {leave.id}
                                  </DialogTitle>

                                </DialogHeader>


                                {selectedLeave && (

                                  <div className="space-y-4 mt-2">

                                    <div className="grid grid-cols-2 gap-3 text-sm">

                                      <div>
                                        <span className="text-muted-foreground">Student:</span>
                                        <p className="font-medium">{selectedLeave.student}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">Class:</span>
                                        <p className="font-medium">{selectedLeave.class}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">Type:</span>
                                        <Badge className={`${typeColor(selectedLeave.type)} border`}>
                                          {selectedLeave.type}
                                        </Badge>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">Days:</span>
                                        <p className="font-medium">{selectedLeave.days}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">From:</span>
                                        <p className="font-medium">{selectedLeave.from}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">To:</span>
                                        <p className="font-medium">{selectedLeave.to}</p>
                                      </div>

                                      <div className="col-span-2">
                                        <span className="text-muted-foreground">Reason:</span>
                                        <p className="font-medium">{selectedLeave.reason}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">Parent:</span>
                                        <p className="font-medium">{selectedLeave.parent}</p>
                                      </div>

                                      <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p className="font-medium">{selectedLeave.phone}</p>
                                      </div>

                                    </div>


                                    <div className="space-y-2">

                                      <Label>Admin Remarks</Label>

                                      <Textarea placeholder="Add remarks..." />

                                    </div>


                                    <div className="flex gap-2">

                                      <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                                        <Check className="w-4 h-4 mr-1" />
                                        Approve
                                      </Button>

                                      <Button
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>

                                    </div>

                                  </div>

                                )}

                              </DialogContent>

                            </Dialog>


                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>

                          </div>

                        </div>

                      </CardContent>

                    </Card>

                  ))}

              </CardContent>

            </Card>

          </TabsContent>



          {/* HISTORY TAB */}

          <TabsContent value="history">

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">

              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

              <CardHeader>

                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Leave History
                </CardTitle>

              </CardHeader>


              <CardContent>

                <Table>

                  <TableHeader>

                    <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50">

                      <TableHead>ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved By</TableHead>

                    </TableRow>

                  </TableHeader>


                  <TableBody>

                    {historyLeaves.map((leave) => (

                      <TableRow
                        key={leave.id}
                        className="hover:bg-blue-50/40 transition"
                      >

                        <TableCell className="font-mono text-xs text-primary">
                          {leave.id}
                        </TableCell>

                        <TableCell className="font-medium">
                          {leave.student}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{leave.class}</Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className={`${typeColor(leave.type)} border text-xs`}>
                            {leave.type}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm">
                          {leave.from} → {leave.to}
                        </TableCell>

                        <TableCell className="font-medium">
                          {leave.days}
                        </TableCell>

                        <TableCell>

                          <Badge
                            className={`border text-xs ${
                              leave.status === "Approved"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {leave.status}
                          </Badge>

                        </TableCell>

                        <TableCell className="text-sm">
                          {leave.approvedBy}
                        </TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>

              </CardContent>

            </Card>

          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Page;