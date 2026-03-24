import { IndianRupee } from "lucide-react";

type WelcomeBannerProps = {
  name: string;
  role?: string;
  todayEarnings: number;
  subtitle?: string;
};

const WelcomeBanner = ({
  name,
  role = "Accountant",
  todayEarnings,
  subtitle = "Here's what's happening at your school today",
}: WelcomeBannerProps) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(todayEarnings);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 
      bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 
      shadow-lg">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* Left Section */}
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/80">
            ✨ Dashboard Overview
          </span>

          <h1 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900">
            Welcome back, {name} 👋
          </h1>

          <p className="mt-2 text-sm text-gray-800/80">
            {subtitle}
          </p>

          <p className="text-xs text-gray-800/70 mt-1">
            {today} • {role} Panel
          </p>
        </div>

        {/* Right Card */}
        <div className="bg-white/30 backdrop-blur-md 
          rounded-2xl px-8 py-6 
          shadow-xl border border-white/30 
          min-w-[220px]">

          <div className="flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-gray-900" />
            <span className="text-4xl font-extrabold text-gray-900">
              {/* {formattedAmount} */}
              12,45,700
            </span>
          </div>

          <p className="text-sm text-gray-900/80 mt-2 font-medium">
            Today’s Earnings
          </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeBanner;