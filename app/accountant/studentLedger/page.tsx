"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  BookOpenCheck,
  Search,
  Download,
  User,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const Page = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const [paymentData, setPaymentData] = useState<any>(null);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  /* ================= FETCH CLASSES ================= */

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);

      const res = await axiosInstance.get("/api/v1/classes");

      if (res?.data?.success) {
        // ✅ SAFE FALLBACK
        setClasses(res?.data?.data || []);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Class fetch error", err);
      setClasses([]); // ✅ NEVER undefined
    } finally {
      setLoadingClasses(false);
    }
  };

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (classFilter !== "all") params.append("class", classFilter);

      const res = await axiosInstance.get(
        `/api/v1/students?${params.toString()}`
      );

      if (res.data.success) {
        setStudents(res.data.data.students);
      }
    } catch (err) {
      console.error("Student fetch error", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ================= FETCH PAYMENTS ================= */

  const fetchPayments = async (studentId: string) => {
    try {
      setLoadingPayments(true);

      const res = await axiosInstance.get(
        `/api/v1/payments/student/${studentId}`
      );

      if (res.data.success) {
        setPaymentData(res.data.data);
      }
    } catch (err) {
      console.error("Payment fetch error", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, classFilter]);

  useEffect(() => {
    if (selectedStudent?.id) {
      fetchPayments(selectedStudent.id);
    }
  }, [selectedStudent]);

  /* ================= PAYMENT LOGIC ================= */

  const payments = paymentData?.payments || [];
  const totalFee = paymentData?.fee?.totalFee || 0;

  const totalPaid = payments.reduce(
    (sum: number, p: any) => sum + Number(p.amount),
    0
  );

  const totalBalance = totalFee - totalPaid;

  const installments = payments.map((payment: any, i: number) => ({
    name: `Installment ${i + 1}`,
    date: payment.paymentDate,
    total: totalFee,
    paid: Number(payment.amount),
    due: totalFee - totalPaid,
    payments: [payment.paymentMode],
    status:
      payment.status === "COMPLETED"
        ? "Paid"
        : payment.status === "PENDING"
        ? "Partial"
        : "Failed",
  }));

  /* ================= STATUS BADGE ================= */

  const statusBadge = (status: string) => {
    if (status === "Paid")
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );

    if (status === "Partial")
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Partial
        </Badge>
      );

    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    );
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <Header
        title="Student Ledger"
        description="Track fees, payments & dues"
        icon={BookOpenCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PANEL */}
        <Card className="h-[600px] flex flex-col shadow-lg border-0 bg-gradient-to-b from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Find Student
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 flex flex-col h-full">

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search student..."
                className="pl-9 focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* CLASS FILTER (API BASED) */}
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>

                {loadingClasses ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* STUDENT LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">

              {loadingStudents ? (
                <p className="text-center text-sm">Loading...</p>
              ) : students.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No students found
                </p>
              ) : (
                students.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedStudent?.id === s.id
                        ? "bg-blue-100 border border-blue-300 shadow"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.class || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT PANEL (UNCHANGED CORE, JUST STYLE BOOST) */}
        <div className="lg:col-span-3 space-y-4">

          {selectedStudent && (
            <>
              <Card className="shadow-md">
                <CardContent className="flex justify-between items-center py-4">
                  <div className="flex gap-3 items-center">
                    <User />
                    <div>
                      <p className="font-semibold">
                        {selectedStudent.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedStudent.class}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </CardContent>
              </Card>

              {/* SUMMARY */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardContent className="py-4">
                    ₹{totalFee}
                    <p className="text-xs">Total Fee</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardContent className="py-4 text-green-700">
                    ₹{totalPaid}
                    <p className="text-xs">Paid</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-50 to-red-100">
                  <CardContent className="py-4 text-red-600">
                    ₹{totalBalance}
                    <p className="text-xs">Due</p>
                  </CardContent>
                </Card>
              </div>

              {/* TABLE */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Installment Ledger</CardTitle>
                </CardHeader>

                <CardContent>
                  {loadingPayments ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Installment</TableHead>
                          <TableHead>Paid</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {installments.map((inst, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {new Date(inst.date).toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell>{inst.name}</TableCell>
                            <TableCell>₹{inst.paid}</TableCell>
                            <TableCell>{inst.payments.join(", ")}</TableCell>
                            <TableCell>{statusBadge(inst.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Page;