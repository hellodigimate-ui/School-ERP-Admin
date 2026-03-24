"use client"


import { useState } from "react";
import { BookOpenCheck, Search, Download, Filter, Calendar, User,  CheckCircle2, Clock, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";

const sampleStudents = [
  { id: "STU001", name: "Aarav Sharma", class: "10-A", father: "Rajesh Sharma", phone: "9876543210" },
  { id: "STU002", name: "Priya Patel", class: "8-B", father: "Vikram Patel", phone: "9876543211" },
  { id: "STU003", name: "Rohit Singh", class: "12-A", father: "Amit Singh", phone: "9876543212" },
];

const ledgerEntries = [
  { date: "2026-01-05", particular: "Admission Fees", debit: 15000, credit: 15000, balance: 0, status: "Paid", mode: "UPI" },
  { date: "2026-01-10", particular: "Tuition Fees (Jan)", debit: 5000, credit: 5000, balance: 0, status: "Paid", mode: "Cash" },
  { date: "2026-02-01", particular: "Tuition Fees (Feb)", debit: 5000, credit: 5000, balance: 0, status: "Paid", mode: "Bank Transfer" },
  { date: "2026-02-05", particular: "Transport Fees (Q1)", debit: 8000, credit: 4000, balance: 4000, status: "Partial", mode: "Cheque" },
  { date: "2026-02-10", particular: "Book Fees", debit: 3500, credit: 0, balance: 3500, status: "Unpaid", mode: "-" },
  { date: "2026-02-15", particular: "Exam Fees", debit: 2000, credit: 0, balance: 2000, status: "Unpaid", mode: "-" },
  { date: "2026-02-18", particular: "Uniform Fees", debit: 4500, credit: 4500, balance: 0, status: "Paid", mode: "UPI" },
];

const Page = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>("STU001");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const student = sampleStudents.find((s) => s.id === selectedStudent);
  const totalDebit = ledgerEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = ledgerEntries.reduce((sum, e) => sum + e.credit, 0);
  const totalBalance = totalDebit - totalCredit;

  const statusBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
      case "Partial": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      case "Unpaid": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <Header title="Student Ledger" description="View complete fee ledger for individual students" icon={BookOpenCheck} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student Search Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Find Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Name or ID..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {["8-B", "10-A", "12-A"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="space-y-1 pt-2">
              {sampleStudents
                .filter((s) => classFilter === "all" || s.class === classFilter)
                .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedStudent === s.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}
                    onClick={() => setSelectedStudent(s.id)}
                  >
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id} · Class {s.class}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Ledger Details */}
        <div className="lg:col-span-3 space-y-4">
          {student && (
            <>
              {/* Student Info Bar */}
              <Card>
                <CardContent className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {student.id} · Class: {student.class} · Father: {student.father}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Export PDF</Button>
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Fees</p>
                    <p className="text-xl font-bold text-foreground">₹{totalDebit.toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-emerald-600">₹{totalCredit.toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="py-4">
                    <p className="text-xs text-muted-foreground mb-1">Balance Due</p>
                    <p className="text-xl font-bold text-red-600">₹{totalBalance.toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Ledger Table */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Fee Ledger</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1" />Filter</Button>
                    <Button variant="outline" size="sm"><Calendar className="w-3.5 h-3.5 mr-1" />Date Range</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Particular</TableHead>
                        <TableHead className="text-right">Debit (₹)</TableHead>
                        <TableHead className="text-right">Credit (₹)</TableHead>
                        <TableHead className="text-right">Balance (₹)</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerEntries.map((entry, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                          <TableCell className="font-medium">{entry.particular}</TableCell>
                          <TableCell className="text-right">{entry.debit.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right text-emerald-600">{entry.credit > 0 ? entry.credit.toLocaleString("en-IN") : "-"}</TableCell>
                          <TableCell className="text-right font-medium">{entry.balance > 0 ? entry.balance.toLocaleString("en-IN") : "0"}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{entry.mode}</Badge></TableCell>
                          <TableCell>{statusBadge(entry.status)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">{totalDebit.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right text-emerald-600">{totalCredit.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right text-red-600">{totalBalance.toLocaleString("en-IN")}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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