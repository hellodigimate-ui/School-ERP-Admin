/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  IndianRupeeIcon,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Bus,
  BookOpen,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Stat {
  label: string;
  value: string;
  change: string;
}

/* ✅ Dummy Fallback Data */
const dummyStats: Stat[] = [
  { label: "Total Students", value: "totalStudents", change: "+12%" },
  { label: "Revenue", value: "revenue", change: "+8%" },
  { label: "Total Classes", value: "totalClasses", change: "+2.1%" },
  { label: "Staff Members", value: "totalTeachers", change: "+3" },
  { label: "New Admissions", value: "newAdmissions", change: "+18%" },
  { label: "Transport", value: "totalBuses", change: "Active" },
  { label: "Library Books", value: "totalBooks", change: "+45" },
  { label: "Complaints", value: "complaints", change: "-5%" },
];

/* ✅ Icon Mapping */
const iconMap: Record<string, any> = {
  "Total Students": Users,
  Revenue: IndianRupeeIcon,
  "Total Classes": CheckCircle,
  "Staff Members": Briefcase,
  "New Admissions": GraduationCap,
  Transport: Bus,
  "Library Books": BookOpen,
  Complaints: AlertTriangle,
};

/* ✅ Gradient Mapping */
const gradientMap: Record<string, string> = {
  "Total Students":
    "bg-gradient-to-br from-blue-400/60 to-blue-600/60 hover:from-blue-500 hover:to-blue-700",
  Revenue:
    "bg-gradient-to-br from-green-400/60 to-green-600/60 hover:from-green-500 hover:to-green-700",
  "Total Classes":
    "bg-gradient-to-br from-purple-500/60 to-purple-700/60 hover:from-purple-600 hover:to-purple-800",
  "Staff Members":
    "bg-gradient-to-br from-pink-500/60 to-pink-600/60 hover:from-pink-600 hover:to-pink-700",
  "New Admissions":
    "bg-gradient-to-br from-orange-400/60 to-orange-500/60 hover:from-orange-500 hover:to-orange-600",
  Transport:
    "bg-gradient-to-br from-cyan-400/60 to-cyan-600/60 hover:from-cyan-500 hover:to-cyan-700",
  "Library Books":
    "bg-gradient-to-br from-yellow-400/60 to-orange-400/60 hover:from-yellow-500 hover:to-orange-500",
  Complaints:
    "bg-gradient-to-br from-blue-400/60 to-purple-500/60 hover:from-blue-500 hover:to-purple-600",
};

const StatCards = () => {
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/admin/stats");

        console.log("Full API Response:", response);

       
          setStats(response.data.data);
      
      } catch (error) {
        console.log("API failed — using dummy fallback data");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats && dummyStats.map((stat, i) => {
        const Icon = iconMap[stat.label] || Users;
        const gradient =
          gradientMap[stat.label] ||
          "bg-gradient-to-br from-gray-400 to-gray-600";

        const isPositiveChange =
          !stat.change?.startsWith("-") &&
          stat.change !== "Active";

        return (
          <div
            key={stat.label}
            className={`${gradient} relative cursor-pointer overflow-hidden rounded-2xl p-6 text-white shadow-lg
            transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:brightness-110`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Glow Effects */}
            <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-3 left-4 w-16 h-16 rounded-full bg-white/5 blur-xl" />

            {/* Icon + Change */}
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                ${
                  isPositiveChange
                    ? "bg-white/20 text-white"
                    : stat.change === "Active"
                    ? "bg-white/20 text-white"
                    : "bg-red-500/80 text-red-100"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <p className="text-3xl font-extrabold drop-shadow-md">
              {stats[stat.value]}
            </p>

            {/* Label */}
            <p className="mt-1 text-sm opacity-80 font-semibold">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
