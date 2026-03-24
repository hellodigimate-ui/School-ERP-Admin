"use client"


import { useState } from "react";
import {  Download, IndianRupee, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const hourlyData = [
  { hour: "8AM", sales: 800 },
  { hour: "9AM", sales: 1500 },
  { hour: "10AM", sales: 3200 },
  { hour: "11AM", sales: 2800 },
  { hour: "12PM", sales: 4500 },
  { hour: "1PM", sales: 3800 },
  { hour: "2PM", sales: 1200 },
  { hour: "3PM", sales: 600 },
];

const categoryBreakdown = [
  { name: "Meals", value: 5840, count: 73 },
  { name: "Snacks", value: 2100, count: 70 },
  { name: "Beverages", value: 1890, count: 126 },
  { name: "Desserts", value: 620, count: 21 },
];

const COLORS = ["hsl(28 85% 52%)", "hsl(160 50% 42%)", "hsl(210 80% 52%)", "hsl(38 92% 50%)"];

const topItems = [
  { name: "Veg Thali", quantity: 45, revenue: 3600 },
  { name: "Tea", quantity: 98, revenue: 1470 },
  { name: "Samosa", quantity: 65, revenue: 1300 },
  { name: "Masala Dosa", quantity: 20, revenue: 1200 },
  { name: "Coffee", quantity: 52, revenue: 1040 },
];

const paymentSummary = [
  { method: "Cash", amount: 4200, percentage: 40 },
  { method: "Wallet", amount: 4830, percentage: 46 },
  { method: "Card", amount: 1420, percentage: 14 },
];

const DailySalesReport = () => {
  const [date, setDate] = useState("2026-02-28");
  const totalSales = categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
  const totalOrders = categoryBreakdown.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold">Daily Sales Report</h3>
          <p className="text-sm text-muted-foreground">Comprehensive overview of today`s canteen performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: IndianRupee, change: "+12.5%", color: "text-primary" },
          { title: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, change: "+8 orders", color: "text-accent" },
          { title: "Avg Order Value", value: `₹${Math.round(totalSales / totalOrders)}`, icon: TrendingUp, change: "+₹3", color: "text-info" },
          { title: "Unique Students", value: "186", icon: Users, change: "+12", color: "text-success" },
        ].map((stat) => (
          <Card key={stat.title} className="stat-card-gradient">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-success mt-1">{stat.change} vs yesterday</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Sales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">Hourly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 88%)" />
                <XAxis dataKey="hour" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(30 15% 88%)", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(value?: number) => value ? [`₹${value.toLocaleString()}`, "Sales"] : "-"}
                />
                <Bar dataKey="sales" fill="hsl(28 85% 52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={2}>
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => [`₹${(value ?? 0).toLocaleString()}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categoryBreakdown.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">₹{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Tooltip formatter={(value?: number) => value ? [`₹${value.toLocaleString()}`, "Revenue"] : "-"} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="font-heading font-bold text-sm text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-bold text-primary">₹{item.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/60"
                          style={{ width: `${(item.revenue / topItems[0].revenue) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground ml-3">{item.quantity} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSummary.map((payment) => (
                <div key={payment.method} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{payment.method}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{payment.amount.toLocaleString()}</span>
                      <Badge variant="secondary" className="text-xs">{payment.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${payment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Collection</span>
                <span className="text-xl font-heading font-bold text-primary">₹{totalSales.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailySalesReport;
