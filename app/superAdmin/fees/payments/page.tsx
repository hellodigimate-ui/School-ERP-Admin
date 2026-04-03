/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card,  CardContent,} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search,Eye,ReceiptIndianRupee} from "lucide-react";

import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const tabMap: Record<string, string> = {
  "/fees/collect": "collect",
  "/fees/payments": "payments",
  "/fees/type": "type",
  "/fees/discount": "discount",
  "/fees/reminder": "reminder",
  "/fees/search-due": "search-due",
};

const statusColor: Record<string, string> = {
  Paid: "bg-secondary/70 text-foreground border-border",
  Partial: "bg-secondary/70 text-foreground border-border",
  Unpaid: "bg-secondary/70 text-foreground border-border",
};

export default function FeesCollectionPage() {
    const pathname = usePathname();
    const activeTab = tabMap[pathname] || "payments";
    const [search, setSearch] = useState("");
    const [viewDetail, setViewDetail] = useState<number | null>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const filtered = payments;

const fetchPayments = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/v1/payments", {
      params: {
        page,
        perPage,
        name: search
      }
    });

    setPayments(res?.data?.data || []);
    setTotalPages(res?.data?.pagination?.totalPages || 1);

  } catch (error) {
    console.error("Payments API Error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    fetchPayments();
  }, 500);

  return () => clearTimeout(delay);
}, [search, page]);


  return (
    <AdminLayout>
        <div className="space-y-8 max-w-[1400px]">
                {/* Gradient Header */}
                <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100 p-6 rounded-3xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Payment Records</h1>
                            <p className="text-white/80 mt-1 text-sm">
                                Track all parent payments
                            </p>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="payments">

                        {/* Search */}
                        <Card className="border-0 shadow-md rounded-2xl">
                            <CardContent className="p-5">
                                <div className="flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[250px]">
                                    <Label className="text-xs">Search Student</Label>

                                    <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                    <Input
                                        className="pl-9"
                                        placeholder=" Parent , student ..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    </div>
                                </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Table */}
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden mt-6">

                            <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                <TableRow className="bg-gradient-to-r   from-indigo-500 to-purple-600 text-white">
                                    <TableHead className="text-black" >Receipt</TableHead>
                                    <TableHead className="text-black" >Transaction Id</TableHead>
                                    <TableHead className="text-black" >Parent</TableHead>
                                    <TableHead className="text-black" >Student</TableHead>
                                    <TableHead className="text-black" >Class</TableHead>
                                    {/* <TableHead className="text-black" >Total</TableHead> */}
                                    <TableHead className="text-black" >Paid</TableHead>
                                    <TableHead className="text-black" >Method</TableHead>
                                    {/* <TableHead className="text-black" >Due</TableHead> */}
                                    <TableHead className="text-black" >Status</TableHead>
                                    <TableHead className="text-black text-right">Action</TableHead>
                                </TableRow>
                                </TableHeader>

                                <TableBody>
                                {loading ? (
                                    <TableRow>
                                    <TableCell colSpan={9} className="text-center py-6">
                                        Loading payments...
                                    </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                    <TableCell colSpan={9} className="text-center py-6">
                                        No payments found
                                    </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((payment: any) => {
                                    // Determine student reference
                                    const student = payment.Student || payment.Fee?.Student;

                                        // const totalFee = payment?.fee?.totalFee || 0;
                                        const paid = payment?.amount || 0;

                                    return (
                                        <TableRow key={payment.id}>
                                        <TableCell>{payment.id}</TableCell>
                                        <TableCell>{payment.transactionId || "-"}</TableCell>
                                        <TableCell>{student?.parentName || "-"}</TableCell>
                                        <TableCell>{student?.name || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                            {student?.section?.name || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-emerald-600">₹{paid}</TableCell>
                                        <TableCell className="text-emerald-600">{payment.paymentMode || "-"}</TableCell>
                                        <TableCell>
                                            <Badge className={`border ${statusColor[payment.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                            {payment.status || "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                            variant="ghost"
                                            onClick={() => setViewDetail(payment.id)}
                                            size="icon"
                                            >
                                            <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        </TableRow>
                                    );
                                    })
                                )}
                                </TableBody>
                            </Table>


                            </CardContent>
                        </Card>
                    </TabsContent>

                    <div className="flex justify-between items-center mt-6">

                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>

                    </div>
                </Tabs>

                {/* Installment Detail Dialog */}
                <Dialog open={viewDetail !== null} onOpenChange={() => setViewDetail(null)}>
                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">

                    {viewDetail &&
                    (() => {
                        const record = payments.find((p: any) => p.id === viewDetail);
                        if (!record) return null;

                        const student = record.Student || record.Fee?.Student;
                        const parentName = student?.parentName || "-";
                        const className = student?.section?.name || "-";
                        const totalFee = record?.Fee?.totalFee || 0;
                        const paid = record?.amount || 0;
                        const due = Math.max(totalFee - paid, 0);
                        const status = due === 0 ? "Completed" : "Partial";
                        const percentage = totalFee === 0 ? 0 : (paid / totalFee) * 100;

                        return (
                        <div>

                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex items-center gap-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20">
                                <ReceiptIndianRupee className="h-7 w-7" />
                            </div>

                            <div>
                                <DialogTitle className="text-lg font-semibold">
                                Payment Details
                                </DialogTitle>
                                <p className="text-sm opacity-90">
                                Installment payment information
                                </p>
                            </div>
                            </div>

                            <div className="p-6 space-y-6">

                            {/* Student Info */}
                            <div className="bg-secondary/50 p-4 rounded-xl shadow-sm border border-border">
                                <h3 className="text-sm font-semibold text-foreground mb-3">
                                Student Information
                                </h3>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                <p className="text-foreground"><span className="font-medium">Student:</span> {student?.name || "-"}</p>
                                <p className="text-foreground"><span className="font-medium">Parent:</span> {parentName}</p>
                                <p className="text-foreground"><span className="font-medium">Class:</span> {className}</p>
                                <p className="text-foreground"><span className="font-medium">Transaction ID:</span> {record.transactionId || "-"}</p>
                                </div>
                            </div>

                            {/* Fee Summary Cards */}
                            <div className="grid grid-cols-3 gap-3">

                                <div className="bg-secondary/50 border border-border p-4 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground">Total Fee</p>
                                <p className="text-lg font-semibold text-foreground">
                                    ₹{totalFee.toLocaleString()}
                                </p>
                                </div>

                                <div className="bg-secondary/50 border border-border p-4 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground">Paid</p>
                                <p className="text-lg font-semibold text-foreground">
                                    ₹{paid.toLocaleString()}
                                </p>
                                </div>

                                <div className="bg-secondary/50 border border-border p-4 rounded-xl text-center">
                                <p className="text-xs text-muted-foreground">Due</p>
                                <p className="text-lg font-semibold text-foreground">
                                    ₹{due.toLocaleString()}
                                </p>
                                </div>

                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                <span className="font-medium text-foreground">Payment Progress</span>
                                <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                                </div>

                                <div className="w-full bg-secondary/50 rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between">

                                <p className="text-sm text-muted-foreground">
                                Payment Status
                                </p>

                                <Badge
                                className={`border ${
                                    status === "Completed"
                                    ? "bg-secondary/70 text-foreground border-border"
                                    : "bg-secondary/70 text-foreground border-border"
                                }`}
                                >
                                {status}
                                </Badge>

                            </div>

                            {/* Footer */}
                            <div className="flex justify-end pt-2">
                                <Button
                                variant="outline"
                                onClick={() => setViewDetail(null)}
                                >
                                Close
                                </Button>
                            </div>

                            </div>
                        </div>
                        );
                    })()}

                </DialogContent>
                </Dialog>
        </div>
    </AdminLayout>
  );
}