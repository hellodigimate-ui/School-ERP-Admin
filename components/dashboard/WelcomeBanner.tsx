"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const dummyData = {
  name: "Rahul",
  todayEarnings: 0,
};

const WelcomeBanner = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState(dummyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/admin/profile");

        console.log("Full API Response:", response.data);

        const profile = response?.data?.data || response?.data;

        setData({
          name: profile?.name ?? dummyData.name,
          todayEarnings:
            typeof profile?.todayEarnings === "number"
              ? profile.todayEarnings
              : dummyData.todayEarnings,
        });
      } catch (error) {
        console.log(
          "API failed, using dummy data:",
          error instanceof Error ? error.message : String(error)
        );
        setData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Indian Currency Formatter
  const formattedEarnings = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(data.todayEarnings);

  return (
    <div
      className="relative rounded-3xl p-8 text-gray-800 overflow-hidden
      bg-gradient-to-br from-blue-400 via-purple-300 to-pink-200
      shadow-xl backdrop-blur-xl border border-white/40
      animate-fade-in"
    >
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />

      {/* Decorative Elements */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-10 left-1/3 w-20 h-20 bg-yellow-300/30 rounded-full blur-xl animate-bounce" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Section */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
            ✨ Dashboard Overview
          </p>

          <h1 className="text-4xl font-extrabold mt-3 tracking-wide drop-shadow-lg">
            Welcome back, {loading ? "..." : data.name} 👋
          </h1>

          <p className="text-sm mt-2 opacity-90">
            Here’s what’s happening at your school today
          </p>

          <p className="text-xs mt-1 opacity-80">
            {currentDate} • <span className="font-semibold">Admin Panel </span>
          </p>
        </div>

        {/* Earnings Card */}
        <div
          className="bg-white/15 backdrop-blur-md px-8 py-6 rounded-2xl 
          border border-white/20 shadow-xl text-center min-w-[200px]"
        >
          <p className="text-5xl font-extrabold drop-shadow-md">
            {loading ? "..." : formattedEarnings}
          </p>

          <p className="text-sm mt-2 opacity-90 font-medium">
            Today’s Earnings
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
