/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState } from "react";
import AccountantSidebar from "@/components/accountant/accountantSidebar";
import FeesDueWidget from "@/components/accountant/feesDueWidget";
import RecentTransactions from "@/components/accountant/recentTransaction";
// import StatCard from "@/components/accountant/statCard";
import TopBar from "@/components/accountant/topBar";
import WelcomeBanner from "@/components/accountant/welcomeBanner";
import { axiosInstance } from "@/apiHome/axiosInstanc";

import {
  IndianRupee,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Award,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const Page = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= API ================= */

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/api/v1/dashboard/accountant/stats"
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* ================= FORMAT ================= */

  const formatCurrency = (val: number) =>
    `₹${val?.toLocaleString("en-IN") || 0}`;

  /* ================= MAIN STATS ================= */

  const mainStats = [
    {
      icon: IndianRupee,
      label: "Today's Collection",
      value: formatCurrency(data?.todayFeesPayments),
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Monthly Collection",
      value: formatCurrency(data?.monthlyFeesPayments),
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Award,
      label: "Scholarships",
      value: data?.totalSchoolerships || 0,
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: TrendingDown,
      label: "Discounts",
      value: data?.totalDiscounts || 0,
      color: "from-orange-500 to-red-500",
    },
  ];

  /* ================= PAYMENT MODES ================= */

  const paymentStats = [
    {
      icon: Banknote,
      label: "Cash",
      value: formatCurrency(data?.monthlyCashPayments),
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Smartphone,
      label: "UPI",
      value: formatCurrency(data?.monthlyUpiPayments),
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: CreditCard,
      label: "Card",
      value: formatCurrency(data?.monthlyCardPayments),
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Wallet,
      label: "Cheque",
      value: formatCurrency(data?.monthlyChequePayments),
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Banknote,
      label: "Bank Transfer",
      value: formatCurrency(data?.monthlyBankTransferPayments),
      color: "from-gray-600 to-gray-800",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={<div className="w-[270px]" />}>
        <AccountantSidebar />
      </Suspense>

      <div className="flex-1">
        <TopBar />

        <main className="p-6 space-y-6">

          <WelcomeBanner
            name="Accountant"
            todayEarnings={data?.todayFeesPayments || 0}
            totalCollection={data?.monthlyFeesPayments || 0}  
            loading={loading}
          />

          {/* 🔥 MAIN STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mainStats.map((stat, i) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`relative p-5 rounded-2xl text-white shadow-xl bg-gradient-to-br ${stat.color} hover:scale-[1.03] transition`}
                >
                  {/* Glow */}
                  <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-80">{stat.label}</p>

                      {loading ? (
                        <div className="h-6 w-20 bg-white/30 rounded animate-pulse mt-2" />
                      ) : (
                        <h2 className="text-2xl font-bold mt-1">
                          {stat.value}
                        </h2>
                      )}
                    </div>

                    <div className="bg-white/20 p-3 rounded-xl">
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💳 PAYMENT BREAKDOWN */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Payment Breakdown (Monthly)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {paymentStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`p-4 rounded-xl text-white shadow-md bg-gradient-to-br ${stat.color} hover:scale-[1.03] transition`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon size={18} />
                      <span className="text-xs opacity-80">
                        {stat.label}
                      </span>
                    </div>

                    <div className="mt-3">
                      {loading ? (
                        <div className="h-5 w-16 bg-white/30 rounded animate-pulse" />
                      ) : (
                        <p className="text-lg font-bold">
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📊 BOTTOM */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions />
            <FeesDueWidget />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;