/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */

"use client";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Download,
  Printer,
} from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

/* ------------------ PAGE ------------------ */

export default function Page() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

const fetchFees = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/v1/fees",{
      params:{
        name:search,
      }
    });

    const feeData = res?.data?.data || [];

    setFees(Array.isArray(feeData) ? feeData : []);
  } catch (error) {
    console.error("Fees API error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchFees();
}, [search]);

const filteredFees = fees.filter(
  (fee: any) =>
    fee?.Student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    fee?.Student?.admissionNumber?.toLowerCase().includes(search.toLowerCase())
);

  return (

    

    <AdminLayout>
      <div className="space-y-8 max-w-[1400px]">

        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold ">Collect Fees</h1>
              <p className="text-white/80 mt-1 text-sm">
                Manage and track student fee payments easily
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
              <Button variant="secondary" className="gap-2">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>
        </div>


        {/* Search */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[250px]">
                <Label className="text-xs">Search Student</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" value={search}  onChange={(e) => setSearch(e.target.value)} placeholder="Name or admission no..." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 dark:bg-secondary/30">
                  <TableHead className="text-foreground">Admission Number</TableHead>
                  <TableHead className="text-foreground">Student</TableHead>
                  <TableHead className="text-foreground">Class</TableHead>
                  <TableHead className="text-right text-foreground">Total</TableHead>
                  <TableHead className="text-right text-foreground">Paid</TableHead>
                  <TableHead className="text-right text-foreground">Balance</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Loading fee records...
                    </TableCell>
                  </TableRow>
                ) : filteredFees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No fee records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFees.map((fee: any) => {
                    const student = fee.Student;

                    const totalFee = Number(fee.totalFee || 0);
                    const paid = Number(fee.depositFee || 0);
                    const balance = Math.max(totalFee - paid, 0);

                    let status = "Unpaid";
                    if (paid >= totalFee && totalFee > 0) status = "Paid";
                    else if (paid > 0) status = "Partial";

                    return (
                      <TableRow key={fee.id} className="border-b border-border hover:bg-secondary/30 transition">
                        <TableCell className="text-foreground">{student?.admissionNumber || "-"}</TableCell>

                        <TableCell className="font-medium text-foreground">
                          {student?.name || "-"}
                        </TableCell>

                        <TableCell className="text-foreground">-</TableCell>

                        <TableCell className="text-right">
                          ₹{totalFee.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-right text-green-600 font-semibold">
                          ₹{paid.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-right text-red-500 font-semibold">
                          ₹{balance.toLocaleString()}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              status === "Paid"
                                ? "bg-secondary/70 text-foreground border-border"
                                : status === "Partial"
                                ? "bg-secondary/70 text-foreground border-border"
                                : "bg-secondary/70 text-foreground border-border"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
