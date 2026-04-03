"use client"
import { useState } from "react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ReceiptIndianRupee,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
}

const initialTransactions: Transaction[] = [
  {
    id: "TXN001",
    date: "2024-01-15",
    description: "Tuition Fee - John Smith",
    category: "Tuition",
    type: "income",
    amount: 2500,
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN002",
    date: "2024-01-14",
    description: "Science Lab Equipment",
    category: "Equipment",
    type: "expense",
    amount: 1200,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "TXN003",
    date: "2024-01-14",
    description: "Tuition Fee - Sarah Johnson",
    category: "Tuition",
    type: "income",
    amount: 2500,
    status: "pending",
    paymentMethod: "Online Payment",
  },
  {
    id: "TXN004",
    date: "2024-01-13",
    description: "Monthly Staff Salaries",
    category: "Salaries",
    type: "expense",
    amount: 45000,
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN005",
    date: "2024-01-12",
    description: "Library Books Purchase",
    category: "Supplies",
    type: "expense",
    amount: 850,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "TXN006",
    date: "2024-01-12",
    description: "Sports Event Fees",
    category: "Events",
    type: "income",
    amount: 3200,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "TXN007",
    date: "2024-01-11",
    description: "Utility Bills - January",
    category: "Utilities",
    type: "expense",
    amount: 2100,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN008",
    date: "2024-01-10",
    description: "Tuition Fee - Michael Brown",
    category: "Tuition",
    type: "income",
    amount: 2500,
    status: "failed",
    paymentMethod: "Online Payment",
  },
];

const CATEGORIES = ["All", "Tuition", "Salaries", "Equipment", "Supplies", "Utilities", "Events"];
const TYPES = ["All", "Income", "Expense"];
const STATUSES = ["All", "Completed", "Pending", "Failed"];

const Finances = () => {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || txn.category === categoryFilter;
    const matchesType = typeFilter === "All" || txn.type === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || txn.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Failed</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Finances</h1>
        <p className="text-muted-foreground mt-1">
          Track revenue, expenses, and payment status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Income</p>
                <p className="text-3xl font-semibold mt-2 tracking-tight">{formatCurrency(totalIncome)}</p>
                <p className="text-sm mt-2 font-medium text-success flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
                <p className="text-3xl font-semibold mt-2 tracking-tight">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm mt-2 font-medium text-destructive flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  +8.2% from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Net Balance</p>
                <p className="text-3xl font-semibold mt-2 tracking-tight">{formatCurrency(netBalance)}</p>
                <p className="text-sm mt-2 font-medium text-muted-foreground">
                  Current period
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Payments</p>
                <p className="text-3xl font-semibold mt-2 tracking-tight">{formatCurrency(pendingPayments)}</p>
                <p className="text-sm mt-2 font-medium text-warning">
                  2 transactions pending
                </p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10 text-warning">
                <ReceiptIndianRupee className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          txn.type === "income"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {txn.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      {txn.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      {txn.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      txn.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                        <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Finances;
