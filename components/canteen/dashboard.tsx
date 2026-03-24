// /* eslint-disable react-hooks/set-state-in-render */
"use client"

import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

const stats = [
  { title: "Today's Sales", value: "₹12,450", change: "+12.5%", up: true, icon: IndianRupee, color: "text-primary" },
  { title: "Orders Today", value: "156", change: "+8.2%", up: true, icon: ShoppingCart, color: "text-accent" },
  { title: "Active Students", value: "1,240", change: "+2.1%", up: true, icon: Users, color: "text-info" },
  { title: "Low Stock Items", value: "7", change: "-3", up: false, icon: Package, color: "text-destructive" },
];

const weeklyData = [
  { day: "Mon", sales: 8500 },
  { day: "Tue", sales: 11200 },
  { day: "Wed", sales: 9800 },
  { day: "Thu", sales: 12450 },
  { day: "Fri", sales: 14200 },
  { day: "Sat", sales: 6500 },
];

const categoryData = [
  { name: "Meals", value: 45 },
  { name: "Snacks", value: 25 },
  { name: "Beverages", value: 20 },
  { name: "Desserts", value: 10 },
];

const dummyData = {
  name: "Rahul",
  todayEarnings: 0,
};

const COLORS = ["hsl(28 85% 52%)", "hsl(160 50% 42%)", "hsl(210 80% 52%)", "hsl(38 92% 50%)"];

const recentOrders = [
  { id: "ORD-001", student: "Aarav Sharma", items: "Thali + Juice", amount: "₹120", time: "10:30 AM" },
  { id: "ORD-002", student: "Priya Patel", items: "Sandwich + Tea", amount: "₹65", time: "10:25 AM" },
  { id: "ORD-003", student: "Rohan Gupta", items: "Samosa x2", amount: "₹40", time: "10:20 AM" },
  { id: "ORD-004", student: "Sneha Reddy", items: "Rice Bowl", amount: "₹85", time: "10:15 AM" },
  { id: "ORD-005", student: "Vikram Singh", items: "Coffee + Cookie", amount: "₹55", time: "10:10 AM" },
];

const CanteenDashboard = () => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(dummyData);
  const [currentDate, setCurrentDate] = useState("");

  // ✅ Indian Currency Formatter
  const formattedEarnings = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(data.todayEarnings);

  return (
    <div className="space-y-6">
      <div
        className="
        relative flex flex-col md:flex-row md:items-center md:justify-between
        gap-6
        p-8
        rounded-3xl
        shadow-lg
        bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300
      "
      >
        {/* Left Section */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-700 flex items-center gap-2">
            ✨ Dashboard Overview
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-3 text-gray-900">
            Welcome back, {loading ? "..." : data.name} 👋
          </h1>

          <p className="text-sm text-gray-700 mt-2">
            Here’s what’s happening at your school today
          </p>

          <p className="text-xs text-gray-600 mt-1">
            {currentDate} • <span className="font-semibold">Canteen Manager</span>
          </p>
        </div>

        {/* Earnings Card */}
        <div
          className="
          bg-white/40
          backdrop-blur-md
          px-10
          py-6
          rounded-2xl
          border border-white/50
          shadow-xl
          text-center
          min-w-[260px]
        "
        >
          <p className="text-5xl font-extrabold text-gray-900 tracking-wide">
            {loading ? "..." : formattedEarnings}
          </p>

          <p className="text-sm mt-2 text-gray-700 font-medium">
            Today’s Earnings
          </p>
        </div>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="stat-card-gradient border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">Weekly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 88%)" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(30 15% 88%)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number | undefined) => [`₹${(value ?? 0).toLocaleString()}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="hsl(28 85% 52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={2}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Student</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Items</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-primary">{order.id}</td>
                    <td className="py-3 px-2">{order.student}</td>
                    <td className="py-3 px-2 text-muted-foreground">{order.items}</td>
                    <td className="py-3 px-2 font-semibold">{order.amount}</td>
                    <td className="py-3 px-2 text-muted-foreground">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanteenDashboard;
