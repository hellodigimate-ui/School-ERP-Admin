/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Suspense } from "react";
// import AccountantSidebar from "@/components/accountant/accountantSidebar";
// import FeesDueWidget from "@/components/accountant/feesDueWidget";
// import RecentTransactions from "@/components/accountant/recentTransaction";
// import StatCard from "@/components/accountant/statCard";
// import TopBar from "@/components/accountant/topBar";
// import WelcomeBanner from "@/components/accountant/welcomeBanner";
// import { 
//   IndianRupee, CheckCircle, AlertTriangle, 
//   CreditCard, Wallet, Banknote, Award,LucideIcon, TrendingDown
// } from "lucide-react";

// type stats = {
//   icon: LucideIcon;
//   value: string;
//   label: string;
//   trend: string;
//   colorClass: string;
// };

// const stats = [
//   {
//     icon: IndianRupee,
//     value: "₹48,50,000",
//     label: "Total Collection (This Month)",
//     trend: "+12%",
//     colorClass: "bg-gradient-to-br from-blue-600/10 to-blue-400/10 text-blue-600",
//   },
//   {
//     icon: AlertTriangle,
//     value: "₹6,91,000",
//     label: "Pending / Due Fees",
//     trend: "50 students",
//     colorClass: "bg-gradient-to-br from-orange-600/10 to-orange-400/10 text-orange-600",
//   },
//   {
//     icon: CheckCircle,
//     value: "₹41,59,000",
//     label: "Fees Collected",
//     trend: "+8%",
//     colorClass: "bg-gradient-to-br from-green-600/10 to-green-400/10 text-green-600",
//   },
//   {
//     icon: CreditCard,
//     value: "₹12,45,000",
//     label: "Today's Collection",
//     trend: "+₹2.1L",
//     colorClass: "bg-gradient-to-br from-teal-600/10 to-teal-400/10 text-teal-600",
//   },
//   {
//     icon: Wallet,
//     value: "₹5,30,000",
//     label: "Total Expenses",
//     trend: "-5%",
//     colorClass: "bg-gradient-to-br from-pink-600/10 to-pink-400/10 text-pink-600",
//   },
//   {
//     icon: Banknote,
//     value: "₹3,20,000",
//     label: "Cash in Hand",
//     trend: "Updated",
//     colorClass: "bg-gradient-to-br from-cyan-600/10 to-cyan-400/10 text-cyan-600",
//   },
//   {
//     icon: Award,
//     value: "₹1,85,000",
//     label: "Scholarship Disbursed",
//     trend: "15 students",
//     colorClass: "bg-gradient-to-br from-purple-600/10 to-purple-400/10 text-purple-600",
//   },
//   {
//     icon: TrendingDown,
//     value: "₹45,000",
//     label: "Discounts Given",
//     trend: "8 students",
//     colorClass: "bg-gradient-to-br from-amber-600/10 to-amber-400/10 text-amber-600",
//   },
// ];

// const Page = () => {
//   return (
//     <div className="flex min-h-screen bg-background">
//       <Suspense fallback={<div className="w-[270px] bg-background"></div>}>
//         <AccountantSidebar />
//       </Suspense>
//       <div className="flex-1 ">
//         <TopBar />
//         <main className="p-6 space-y-6">
//           <WelcomeBanner name={""} todayEarnings={0} />
          
//           {/* Stat Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {stats.map((stat, i) => (
//               <StatCard key={stat.label} {...stat} delay={i * 60} />
//             ))}
//           </div>

//           {/* Bottom section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <RecentTransactions />
//             <FeesDueWidget />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Page;




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