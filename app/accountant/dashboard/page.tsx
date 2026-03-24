"use client";

import { Suspense } from "react";
import AccountantSidebar from "@/components/accountant/accountantSidebar";
import FeesDueWidget from "@/components/accountant/feesDueWidget";
import RecentTransactions from "@/components/accountant/recentTransaction";
import StatCard from "@/components/accountant/statCard";
import TopBar from "@/components/accountant/topBar";
import WelcomeBanner from "@/components/accountant/welcomeBanner";
import { 
  IndianRupee, CheckCircle, AlertTriangle, 
  CreditCard, Wallet, Banknote, Award,LucideIcon, TrendingDown
} from "lucide-react";

type stats = {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: string;
  colorClass: string;
};

const stats = [
  {
    icon: IndianRupee,
    value: "₹48,50,000",
    label: "Total Collection (This Month)",
    trend: "+12%",
    colorClass: "bg-gradient-to-br from-blue-600/10 to-blue-400/10 text-blue-600",
  },
  {
    icon: AlertTriangle,
    value: "₹6,91,000",
    label: "Pending / Due Fees",
    trend: "50 students",
    colorClass: "bg-gradient-to-br from-orange-600/10 to-orange-400/10 text-orange-600",
  },
  {
    icon: CheckCircle,
    value: "₹41,59,000",
    label: "Fees Collected",
    trend: "+8%",
    colorClass: "bg-gradient-to-br from-green-600/10 to-green-400/10 text-green-600",
  },
  {
    icon: CreditCard,
    value: "₹12,45,000",
    label: "Today's Collection",
    trend: "+₹2.1L",
    colorClass: "bg-gradient-to-br from-teal-600/10 to-teal-400/10 text-teal-600",
  },
  {
    icon: Wallet,
    value: "₹5,30,000",
    label: "Total Expenses",
    trend: "-5%",
    colorClass: "bg-gradient-to-br from-pink-600/10 to-pink-400/10 text-pink-600",
  },
  {
    icon: Banknote,
    value: "₹3,20,000",
    label: "Cash in Hand",
    trend: "Updated",
    colorClass: "bg-gradient-to-br from-cyan-600/10 to-cyan-400/10 text-cyan-600",
  },
  {
    icon: Award,
    value: "₹1,85,000",
    label: "Scholarship Disbursed",
    trend: "15 students",
    colorClass: "bg-gradient-to-br from-purple-600/10 to-purple-400/10 text-purple-600",
  },
  {
    icon: TrendingDown,
    value: "₹45,000",
    label: "Discounts Given",
    trend: "8 students",
    colorClass: "bg-gradient-to-br from-amber-600/10 to-amber-400/10 text-amber-600",
  },
];

const Page = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={<div className="w-[270px] bg-background"></div>}>
        <AccountantSidebar />
      </Suspense>
      <div className="flex-1 ">
        <TopBar />
        <main className="p-6 space-y-6">
          <WelcomeBanner name={""} todayEarnings={0} />
          
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 60} />
            ))}
          </div>

          {/* Bottom section */}
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
