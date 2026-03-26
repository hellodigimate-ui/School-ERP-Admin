/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  PauseCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/layout/AdminLayout";
import ScholarshipTypes from "@/components/schoolership/schoolershiType";
import EligibilityCriteria from "@/components/schoolership/eligiblityCretria";

// Sample data
const scholarshipTypes = [
  {
    id: 1,
    name: "Government Merit Scholarship",
    category: "Govt",
    amount: "₹15,000/year",
    beneficiaries: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Private Foundation Grant",
    category: "Private",
    amount: "₹10,000/year",
    beneficiaries: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Sports Excellence Award",
    category: "Sports",
    amount: "₹20,000/year",
    beneficiaries: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Disability Support Fund",
    category: "Disabled",
    amount: "₹25,000/year",
    beneficiaries: 3,
    status: "Active",
  },
  {
    id: 5,
    name: "Academic Topper Reward",
    category: "Merit-Based",
    amount: "₹12,000/year",
    beneficiaries: 15,
    status: "Active",
  },
];

const applications = [
  {
    id: 1,
    student: "Aarav Patel",
    class: "10-A",
    scholarship: "Government Merit Scholarship",
    appliedDate: "2026-01-15",
    status: "Approved",
    amount: "₹15,000",
  },
  {
    id: 2,
    student: "Priya Sharma",
    class: "9-B",
    scholarship: "Sports Excellence Award",
    appliedDate: "2026-01-18",
    status: "Pending",
    amount: "₹20,000",
  },
  {
    id: 3,
    student: "Rohan Gupta",
    class: "8-A",
    scholarship: "Private Foundation Grant",
    appliedDate: "2026-01-20",
    status: "Pending",
    amount: "₹10,000",
  },
  {
    id: 4,
    student: "Ananya Singh",
    class: "10-A",
    scholarship: "Academic Topper Reward",
    appliedDate: "2026-01-22",
    status: "On Hold",
    amount: "₹12,000",
  },
  {
    id: 5,
    student: "Vikram Reddy",
    class: "7-C",
    scholarship: "Disability Support Fund",
    appliedDate: "2026-02-01",
    status: "Rejected",
    amount: "₹25,000",
  },
  {
    id: 6,
    student: "Meera Joshi",
    class: "9-A",
    scholarship: "Government Merit Scholarship",
    appliedDate: "2026-02-05",
    status: "Approved",
    amount: "₹15,000",
  },
];

const statusConfig: Record<
  string,
  { icon: React.ElementType; className: string }
> = {
  Approved: {
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  Pending: {
    icon: Clock,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
  },
  "On Hold": {
    icon: PauseCircle,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

export default function page() {
  const [activeTab, setActiveTab] = useState("types");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [showAddType, setShowAddType] = useState(false);
  const [showAddApplication, setShowAddApplication] = useState(false);


  const stats = [
    {
      label: "Total Scholarships",
      value: scholarshipTypes.length,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Total Applications",
      value: applications.length,
      color: "from-emerald-400 to-green-600",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "Approved").length,
      color: "from-teal-400 to-teal-600",
    },
    {
      label: "Pending",
      value: applications.filter((a) => a.status === "Pending").length,
      color: "from-amber-400 to-orange-500",
    },
  ];

  const [applicationList, setApplicationList] = useState(applications);

  const [isAppAddOpen, setIsAppAddOpen] = useState(false);
  const [isAppEditOpen, setIsAppEditOpen] = useState(false);

  const [selectedApp, setSelectedApp] = useState<any>(null);

  const [appForm, setAppForm] = useState({
    id: "",
    student: "",
    class: "",
    scholarship: "",
    appliedDate: "",
    amount: "",
    status: "Pending",
  });

  const resetAppForm = () => {
    setAppForm({
      id: "",
      student: "",
      class: "",
      scholarship: "",
      appliedDate: "",
      amount: "",
      status: "Pending",
    });
  };

  const handleAppAdd = () => {
    setApplicationList((prev) => [...prev, { ...appForm, id: Date.now() }]);
    setIsAppAddOpen(false);
    resetAppForm();
  };

  const handleAppEditClick = (app: any) => {
    setSelectedApp(app);
    setAppForm(app);
    setIsAppEditOpen(true);
  };

  const handleAppUpdate = () => {
    setApplicationList((prev) =>
      prev.map((a) =>
        a.id === selectedApp.id ? { ...selectedApp, ...appForm } : a,
      ),
    );
    setIsAppEditOpen(false);
    resetAppForm();
  };

  const handleAppDelete = (id: number) => {
    setApplicationList((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <GraduationCap size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Scholarship Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage scholarships, applications & eligibility
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-primary-foreground shadow-card animate-fade-in`}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger
            value="types"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Scholarship Types
          </TabsTrigger>
          <TabsTrigger
            value="eligibility"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Eligibility Criteria
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Applications
          </TabsTrigger>
        </TabsList>

        {/* Scholarship Types Tab */}
        <TabsContent value="types" className="space-y-5">
          <ScholarshipTypes />
        </TabsContent>

        {/* Eligibility Criteria Tab */}
        <TabsContent value="eligibility" className="space-y-5">
          <EligibilityCriteria />
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search by student or scholarship..."
                  className="pl-9 w-72 bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 bg-card">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download size={14} /> Export
              </Button>
              <Dialog
                open={showAddApplication}
                onOpenChange={setShowAddApplication}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus size={16} /> New Application
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Scholarship Application</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Student</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              Aarav Patel (10-A)
                            </SelectItem>
                            <SelectItem value="2">
                              Priya Sharma (9-B)
                            </SelectItem>
                            <SelectItem value="3">Rohan Gupta (8-A)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Scholarship</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select scholarship" />
                          </SelectTrigger>
                          <SelectContent>
                            {scholarshipTypes.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Application Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025-26">2025-26</SelectItem>
                            <SelectItem value="2026-27">2026-27</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Remarks</Label>
                      <Textarea placeholder="Any additional remarks" rows={2} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddApplication(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddApplication(false)}>
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="font-semibold">Scholarship</TableHead>
                  <TableHead className="font-semibold">Applied Date</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationList
                  .filter((app) => {
                    const matchSearch =
                      app.student
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      app.scholarship
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                    const matchStatus =
                      statusFilter === "all" || app.status === statusFilter;

                    return matchSearch && matchStatus;
                  })
                  .map((app, i) => {
                    const cfg = statusConfig[app.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <TableRow key={app.id} className="hover:bg-muted/30">
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">
                          {app.student}
                        </TableCell>
                        <TableCell>{app.class}</TableCell>
                        <TableCell className="max-w-48 truncate">
                          {app.scholarship}
                        </TableCell>
                        <TableCell>{app.appliedDate}</TableCell>
                        <TableCell className="font-medium">
                          {app.amount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${cfg.className} border text-xs gap-1`}
                          >
                            <StatusIcon size={12} />
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Pencil
                              onClick={() => handleAppEditClick(app)}
                              className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"
                            />

                            <Trash2
                              onClick={() => handleAppDelete(app.id)}
                              className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            <Dialog open={isAppAddOpen} onOpenChange={setIsAppAddOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Application</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(appForm).map(
                    (key) =>
                      key !== "id" && (
                        <Input
                          key={key}
                          placeholder={key}
                          value={(appForm as any)[key]}
                          onChange={(e) =>
                            setAppForm({ ...appForm, [key]: e.target.value })
                          }
                        />
                      ),
                  )}
                </div>

                <Button onClick={handleAppAdd} className="w-full mt-3">
                  Add Application
                </Button>
              </DialogContent>
            </Dialog>

            <Dialog open={isAppEditOpen} onOpenChange={setIsAppEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Application</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(appForm).map(
                    (key) =>
                      key !== "id" && (
                        <Input
                          key={key}
                          value={(appForm as any)[key]}
                          onChange={(e) =>
                            setAppForm({ ...appForm, [key]: e.target.value })
                          }
                        />
                      ),
                  )}
                </div>

                <Button onClick={handleAppUpdate} className="w-full mt-3">
                  Update Application
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}