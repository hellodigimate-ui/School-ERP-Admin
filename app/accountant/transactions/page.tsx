"use client"

import { useState } from "react";
import { ArrowLeftRight, Search, Download, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";

const transactions = [
  { id: "TXN20260001", date: "2026-02-19", student: "Aarav Sharma", class: "10-A", type: "Fee Collection", amount: 15000, mode: "UPI", status: "Success", direction: "credit" },
  { id: "TXN20260002", date: "2026-02-19", student: "Priya Patel", class: "8-B", type: "Fee Collection", amount: 5000, mode: "Cash", status: "Success", direction: "credit" },
  { id: "TXN20260003", date: "2026-02-18", student: "-", class: "-", type: "Expense", amount: 25000, mode: "Bank Transfer", status: "Success", direction: "debit" },
  { id: "TXN20260004", date: "2026-02-18", student: "Rohit Singh", class: "12-A", type: "Fee Collection", amount: 8000, mode: "Cheque", status: "Pending", direction: "credit" },
  { id: "TXN20260005", date: "2026-02-17", student: "-", class: "-", type: "Income", amount: 50000, mode: "Bank Transfer", status: "Success", direction: "credit" },
  { id: "TXN20260006", date: "2026-02-17", student: "Ananya Gupta", class: "9-A", type: "Fee Refund", amount: 3000, mode: "UPI", status: "Success", direction: "debit" },
  { id: "TXN20260007", date: "2026-02-16", student: "-", class: "-", type: "Expense", amount: 12000, mode: "Cash", status: "Success", direction: "debit" },
  { id: "TXN20260008", date: "2026-02-16", student: "Meera Joshi", class: "7-C", type: "Fee Collection", amount: 10000, mode: "UPI", status: "Failed", direction: "credit" },
  { id: "TXN20260009", date: "2026-02-15", student: "Kabir Verma", class: "11-B", type: "Fee Collection", amount: 6500, mode: "Cash", status: "Success", direction: "credit" },
  { id: "TXN20260010", date: "2026-02-15", student: "-", class: "-", type: "Expense", amount: 8500, mode: "Bank Transfer", status: "Success", direction: "debit" },
];

const Page = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [tab, setTab] = useState("all");

  const filtered = transactions
    .filter((t) => tab === "all" || (tab === "credits" && t.direction === "credit") || (tab === "debits" && t.direction === "debit"))
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .filter((t) => modeFilter === "all" || t.mode === modeFilter)
    .filter((t) => t.id.toLowerCase().includes(search.toLowerCase()) || t.student.toLowerCase().includes(search.toLowerCase()));

  const totalCredits = transactions.filter((t) => t.direction === "credit" && t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter((t) => t.direction === "debit" && t.status === "Success").reduce((s, t) => s + t.amount, 0);

  const statusBadge = (status: string) => {
    switch (status) {
      case "Success": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{status}</Badge>;
      case "Pending": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{status}</Badge>;
      case "Failed": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <Header title="Transactions" description="View all financial transactions" icon={ArrowLeftRight} />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><ArrowDownRight className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Credits</p><p className="text-xl font-bold text-emerald-600">₹{totalCredits.toLocaleString("en-IN")}</p></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Debits</p><p className="text-xl font-bold text-red-600">₹{totalDebits.toLocaleString("en-IN")}</p></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-xs text-muted-foreground">Net Balance</p><p className="text-xl font-bold text-foreground">₹{(totalCredits - totalDebits).toLocaleString("en-IN")}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="debits">Debits</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by ID or student..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Fee Collection">Fee Collection</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Fee Refund">Fee Refund</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="text-muted-foreground">{t.date}</TableCell>
                  <TableCell>{t.student !== "-" ? <span className="font-medium">{t.student}<span className="text-xs text-muted-foreground ml-1">({t.class})</span></span> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{t.type}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${t.direction === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                    {t.direction === "credit" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{t.mode}</Badge></TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Page;