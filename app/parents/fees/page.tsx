"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import ParentLayout from "@/components/parents/layout/parentLayout";

const feesData = {
  rahul: {
    name: "Rahul Sharma",
    class: "Class 10-A",
    totalFees: 60000,
    paid: 45000,
    pending: 15000,
    transactions: [
      {
        id: "TXN001",
        description: "Term 1 Tuition Fee",
        amount: 25000,
        date: "July 15, 2025",
        status: "paid",
      },
      {
        id: "TXN002",
        description: "Term 1 Transport Fee",
        amount: 10000,
        date: "July 15, 2025",
        status: "paid",
      },
      {
        id: "TXN003",
        description: "Annual Activity Fee",
        amount: 10000,
        date: "Aug 1, 2025",
        status: "paid",
      },
      {
        id: "TXN004",
        description: "Term 2 Tuition Fee",
        amount: 25000,
        dueDate: "Feb 28, 2026",
        status: "pending",
      },
    ],
  },
  ananya: {
    name: "Ananya Sharma",
    class: "Class 7-B",
    totalFees: 50000,
    paid: 50000,
    pending: 0,
    transactions: [
      {
        id: "TXN005",
        description: "Term 1 Tuition Fee",
        amount: 20000,
        date: "July 10, 2025",
        status: "paid",
      },
      {
        id: "TXN006",
        description: "Term 1 Transport Fee",
        amount: 8000,
        date: "July 10, 2025",
        status: "paid",
      },
      {
        id: "TXN007",
        description: "Annual Activity Fee",
        amount: 7000,
        date: "Aug 1, 2025",
        status: "paid",
      },
      {
        id: "TXN008",
        description: "Term 2 Tuition Fee",
        amount: 15000,
        date: "Jan 15, 2026",
        status: "paid",
      },
    ],
  },
};

const statusConfig = {
  paid: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Paid" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  overdue: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Overdue" },
};

export default function Fees() {
  const [selectedChild, setSelectedChild] = useState<"rahul" | "ananya">("rahul");
  const data = feesData[selectedChild];

  return (
    <ParentLayout>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                <h1 className="text-2xl font-bold">Fees</h1>
                <p className="text-muted-foreground">Manage fee payments</p>
                </div>
                <Select
                value={selectedChild}
                onValueChange={(value) => setSelectedChild(value as "rahul" | "ananya")}
                >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="rahul">Rahul Sharma</SelectItem>
                    <SelectItem value="ananya">Ananya Sharma</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground">Total Fees</div>
                        <div className="text-2xl font-bold">₹{data.totalFees.toLocaleString()}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Paid Amount</div>
                    <div className="text-2xl font-bold text-success">₹{data.paid.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((data.paid / data.totalFees) * 100)}% completed
                    </div>
                </CardContent>
                </Card>
                <Card className={data.pending > 0 ? "border-warning/50 bg-warning/5" : ""}>
                <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Pending Amount</div>
                    <div className={`text-2xl font-bold ${data.pending > 0 ? "text-warning" : "text-success"}`}>
                    ₹{data.pending.toLocaleString()}
                    </div>
                    {data.pending > 0 && (
                    <Button size="sm" className="mt-3 w-full">
                        Pay Now
                    </Button>
                    )}
                </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transaction History - {data.name}</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    Download Receipt
                </Button>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {data.transactions.map((txn) => {
                    const config = statusConfig[txn.status as keyof typeof statusConfig];
                    const Icon = config.icon;
                    return (
                        <div
                        key={txn.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                        >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div>
                            <div className="font-medium">{txn.description}</div>
                            <div className="text-sm text-muted-foreground">
                                {txn.status === "paid" ? txn.date : `Due: ${txn.dueDate}`}
                            </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">₹{txn.amount.toLocaleString()}</div>
                            <Badge variant="secondary" className={`${config.bg} ${config.color} border-0 mt-1`}>
                            {config.label}
                            </Badge>
                        </div>
                        </div>
                    );
                    })}
                </div>
                </CardContent>
            </Card>
        </div>
    </ParentLayout>
  );
}
