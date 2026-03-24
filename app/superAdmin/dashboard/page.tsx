"use client";

import {
  Users,
  IndianRupee,
  CheckCircle,
  Building2,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const stats = [
  { title: "Total Students", value: "2", change: "+12%", icon: Users, gradient: "from-blue-500 to-indigo-500" },
  { title: "Revenue", value: "₹0", change: "+8%", icon: IndianRupee, gradient: "from-green-500 to-emerald-500" },
  { title: "Total Classes", value: "5", change: "+2.1%", icon: CheckCircle, gradient: "from-purple-500 to-violet-500" },
  { title: "Staff Members", value: "3", change: "+3", icon: Building2, gradient: "from-pink-500 to-rose-500" },
  { title: "Courses", value: "2", change: "+18%", icon: GraduationCap, gradient: "from-orange-500 to-amber-500" },
  { title: "Library Books", value: "0", change: "Active", icon: BookOpen, gradient: "from-yellow-500 to-lime-500" },
  { title: "Pending Fees", value: "0", change: "+45", icon: CreditCard, gradient: "from-teal-500 to-cyan-500" },
  { title: "Complaints", value: "0", change: "-5%", icon: AlertTriangle, gradient: "from-red-500 to-orange-500" },
];

export default function Dashboard() {
  const today = new Date();

  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 🔥 Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80 mb-2">
              Dashboard Overview
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, Super Admin 👋
            </h1>

            <p className="opacity-90 mt-2">
              Here’s what’s happening at your school today
            </p>

            <p className="text-sm opacity-70 mt-1">
              {dateStr} • Admin Panel
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-center shadow">
            <p className="text-3xl md:text-4xl font-extrabold">
              ₹1,00,00,00,000
            </p>
            <p className="text-sm opacity-80 mt-1">
              Today’s Earnings
            </p>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="relative rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Top Bar */}
            <div className={`h-1 w-full rounded-full bg-gradient-to-r ${stat.gradient} mb-4`} />

            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} text-white shadow`}>
                <stat.icon className="w-5 h-5" />
              </div>

              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>

            <p className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">
              {stat.value}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}