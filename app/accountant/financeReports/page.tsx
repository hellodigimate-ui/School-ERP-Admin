"use client"



import { BarChart3, Download, Calendar, TrendingUp, TrendingDown} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Suspense } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart as RPieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { useSearchParams } from "next/navigation";

const monthlyCollection = [
  { month: "Apr", collected: 850000, due: 150000 },
  { month: "May", collected: 920000, due: 130000 },
  { month: "Jun", collected: 780000, due: 220000 },
  { month: "Jul", collected: 950000, due: 100000 },
  { month: "Aug", collected: 880000, due: 170000 },
  { month: "Sep", collected: 1020000, due: 80000 },
  { month: "Oct", collected: 910000, due: 140000 },
  { month: "Nov", collected: 870000, due: 180000 },
  { month: "Dec", collected: 960000, due: 90000 },
  { month: "Jan", collected: 1050000, due: 50000 },
  { month: "Feb", collected: 750000, due: 300000 },
];

const dueByClass = [
  { class: "Class 1", students: 120, totalDue: 85000, paid: 95 },
  { class: "Class 2", students: 115, totalDue: 62000, paid: 97 },
  { class: "Class 3", students: 130, totalDue: 120000, paid: 90 },
  { class: "Class 4", students: 110, totalDue: 45000, paid: 98 },
  { class: "Class 5", students: 125, totalDue: 95000, paid: 93 },
  { class: "Class 6", students: 108, totalDue: 78000, paid: 94 },
  { class: "Class 7", students: 100, totalDue: 55000, paid: 96 },
  { class: "Class 8", students: 98, totalDue: 110000, paid: 89 },
  { class: "Class 9", students: 95, totalDue: 130000, paid: 87 },
  { class: "Class 10", students: 90, totalDue: 150000, paid: 85 },
  { class: "Class 11", students: 75, totalDue: 88000, paid: 91 },
  { class: "Class 12", students: 70, totalDue: 72000, paid: 92 },
];

const dailyCollection = [
  { date: "Feb 13", amount: 125000 },
  { date: "Feb 14", amount: 98000 },
  { date: "Feb 15", amount: 145000 },
  { date: "Feb 16", amount: 110000 },
  { date: "Feb 17", amount: 87000 },
  { date: "Feb 18", amount: 165000 },
  { date: "Feb 19", amount: 132000 },
];

const paymentModeSplit = [
  { name: "Cash", value: 35, color: "#3b82f6" },
  { name: "UPI", value: 40, color: "#10b981" },
  { name: "Cheque", value: 10, color: "#f59e0b" },
  { name: "Bank Transfer", value: 15, color: "#8b5cf6" },
];

const balanceSheet = [
  { head: "Fees Collection", credit: 9500000, debit: 0 },
  { head: "Government Grants", credit: 500000, debit: 0 },
  { head: "Donations", credit: 200000, debit: 0 },
  { head: "Salary & Wages", credit: 0, debit: 4500000 },
  { head: "Infrastructure", credit: 0, debit: 1200000 },
  { head: "Utilities", credit: 0, debit: 350000 },
  { head: "Stationery & Supplies", credit: 0, debit: 180000 },
  { head: "Transport", credit: 0, debit: 600000 },
  { head: "Maintenance", credit: 0, debit: 250000 },
  { head: "Events & Activities", credit: 0, debit: 150000 },
  { head: "Miscellaneous", credit: 50000, debit: 80000 },
];

const incomeExpenseData = [
  { month: "Apr", income: 900000, expense: 620000 },
  { month: "May", income: 950000, expense: 580000 },
  { month: "Jun", income: 800000, expense: 650000 },
  { month: "Jul", income: 980000, expense: 600000 },
  { month: "Aug", income: 910000, expense: 710000 },
  { month: "Sep", income: 1050000, expense: 590000 },
  { month: "Oct", income: 940000, expense: 630000 },
  { month: "Nov", income: 900000, expense: 680000 },
  { month: "Dec", income: 990000, expense: 550000 },
  { month: "Jan", income: 1080000, expense: 620000 },
  { month: "Feb", income: 780000, expense: 700000 },
];

const chartConfig = {
  collected: { label: "Collected", color: "hsl(var(--primary))" },
  due: { label: "Due", color: "hsl(0 84% 60%)" },
  amount: { label: "Amount", color: "hsl(var(--primary))" },
  income: { label: "Income", color: "hsl(142 76% 36%)" },
  expense: { label: "Expense", color: "hsl(0 84% 60%)" },
};

const Page = () => {
  const searchParams = useSearchParams();
  // Extract tab param from URL
  const tabParam = typeof searchParams.get === "function" ? searchParams.get("tab") : undefined;
  const activeTab = tabParam || "collection";

  // Set tab param in URL
  const setSearchParams = (params: { tab: string }) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", params.tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const totalCredit = balanceSheet.reduce((s, b) => s + b.credit, 0);
  const totalDebit = balanceSheet.reduce((s, b) => s + b.debit, 0);

  return (
    <Layout>
      <Header title="Finance Reports" description="Comprehensive financial analytics and reports" icon={BarChart3} />

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="mb-4">
          <TabsTrigger value="collection">Collection Report</TabsTrigger>
          <TabsTrigger value="due">Due Fees Report</TabsTrigger>
          <TabsTrigger value="daily">Daily Collection</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="income-expense">Income vs Expense</TabsTrigger>
        </TabsList>

        {/* Collection Report */}
        <TabsContent value="collection" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-emerald-600">₹99,40,000</p></CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Total Due</p><p className="text-2xl font-bold text-red-600">₹16,10,000</p></CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-2xl font-bold text-foreground">86.1%</p></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Monthly Collection vs Due</CardTitle>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={monthlyCollection}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="collected" fill="var(--color-collected)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="due" fill="var(--color-due)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {/* Payment Mode Split */}
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Payment Mode Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="w-[200px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie data={paymentModeSplit} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                        {paymentModeSplit.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {paymentModeSplit.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-sm text-foreground w-28">{p.name}</span>
                      <span className="text-sm font-semibold">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Due Fees Report */}
        <TabsContent value="due" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Class-wise Due Fees</CardTitle>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-right">Total Due (₹)</TableHead>
                    <TableHead className="text-center">Collection %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueByClass.map((row) => (
                    <TableRow key={row.class}>
                      <TableCell className="font-medium">{row.class}</TableCell>
                      <TableCell className="text-center">{row.students}</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">₹{row.totalDue.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.paid}%` }} />
                          </div>
                          <span className="text-xs font-medium">{row.paid}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={row.paid >= 95 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : row.paid >= 90 ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                          {row.paid >= 95 ? "Good" : row.paid >= 90 ? "Average" : "Low"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Collection */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Daily Collection Trend (Last 7 Days)</CardTitle>
              <Button variant="outline" size="sm"><Calendar className="w-3.5 h-3.5 mr-1" />Date Range</Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={dailyCollection}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="amount" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Daily Breakdown</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Amount (₹)</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
                <TableBody>
                  {dailyCollection.map((d, i) => {
                    const prev = i > 0 ? dailyCollection[i - 1].amount : d.amount;
                    const change = ((d.amount - prev) / prev) * 100;
                    return (
                      <TableRow key={d.date}>
                        <TableCell className="font-medium">{d.date}, 2026</TableCell>
                        <TableCell className="text-right font-semibold">₹{d.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right">
                          {i === 0 ? "—" : (
                            <span className={`flex items-center justify-end gap-1 text-sm ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                              {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              {Math.abs(change).toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Total Income</p><p className="text-2xl font-bold text-emerald-600">₹{(totalCredit / 100000).toFixed(1)}L</p></CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Total Expenditure</p><p className="text-2xl font-bold text-red-600">₹{(totalDebit / 100000).toFixed(1)}L</p></CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="py-4"><p className="text-xs text-muted-foreground">Net Balance</p><p className="text-2xl font-bold text-foreground">₹{((totalCredit - totalDebit) / 100000).toFixed(1)}L</p></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Balance Sheet</CardTitle>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Head</TableHead>
                    <TableHead className="text-right">Credit (₹)</TableHead>
                    <TableHead className="text-right">Debit (₹)</TableHead>
                    <TableHead className="text-right">Net (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheet.map((b) => (
                    <TableRow key={b.head}>
                      <TableCell className="font-medium">{b.head}</TableCell>
                      <TableCell className="text-right text-emerald-600">{b.credit > 0 ? `₹${b.credit.toLocaleString("en-IN")}` : "—"}</TableCell>
                      <TableCell className="text-right text-red-600">{b.debit > 0 ? `₹${b.debit.toLocaleString("en-IN")}` : "—"}</TableCell>
                      <TableCell className={`text-right font-semibold ${b.credit - b.debit >= 0 ? "text-emerald-600" : "text-red-600"}`}>₹{(b.credit - b.debit).toLocaleString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right text-emerald-600">₹{totalCredit.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-red-600">₹{totalDebit.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-foreground">₹{(totalCredit - totalDebit).toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income vs Expense */}
        <TabsContent value="income-expense" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Income vs Expense (Monthly)</CardTitle>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <LineChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Monthly Comparison</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Month</TableHead><TableHead className="text-right">Income (₹)</TableHead><TableHead className="text-right">Expense (₹)</TableHead><TableHead className="text-right">Surplus (₹)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {incomeExpenseData.map((d) => (
                    <TableRow key={d.month}>
                      <TableCell className="font-medium">{d.month}</TableCell>
                      <TableCell className="text-right text-emerald-600">₹{d.income.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right text-red-600">₹{d.expense.toLocaleString("en-IN")}</TableCell>
                      <TableCell className={`text-right font-semibold ${d.income - d.expense >= 0 ? "text-emerald-600" : "text-red-600"}`}>₹{(d.income - d.expense).toLocaleString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

const PageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWrapper;