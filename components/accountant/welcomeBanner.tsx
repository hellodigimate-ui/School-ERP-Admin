import { IndianRupee } from "lucide-react";

type WelcomeBannerProps = {
  name: string;
  role?: string;
  todayEarnings: number;
  totalCollection?: number;   // ✅ NEW
  subtitle?: string;
  loading?: boolean;
};

const WelcomeBanner = ({
  name,
  role = "Accountant",
  totalCollection,
  todayEarnings,
  subtitle = "Here's what's happening at your school today",
  loading = false,
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
  }).format(todayEarnings || 0);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalCollection || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 
      bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 
      dark:from-blue-700 dark:via-purple-700 dark:to-pink-700
      shadow-xl">

      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* LEFT */}
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
            ✨ Dashboard Overview
          </span>

          <h1 className="mt-3 text-3xl lg:text-4xl font-bold text-white">
            Welcome back, {name || "User"} 👋
          </h1>

          <p className="mt-2 text-sm text-white/90">
            {subtitle}
          </p>

          <p className="text-xs text-white/70 mt-1">
            {today} • {role} Panel
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* TODAY */}
          <div className="bg-white/20 backdrop-blur-xl 
            rounded-2xl px-6 py-5 
            shadow-2xl border border-white/20
            min-w-[200px]">

            <div className="flex items-center gap-3">
              <div className="bg-white/30 p-2 rounded-lg">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>

              {loading ? (
                <div className="h-6 w-24 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {formattedAmount}
                </span>
              )}
            </div>

            <p className="text-xs text-white/80 mt-1">
              Today’s Earnings
            </p>
          </div>

          {/* TOTAL COLLECTION 🔥 */}
          <div className="bg-white/20 backdrop-blur-xl 
            rounded-2xl px-6 py-5 
            shadow-2xl border border-white/20
            min-w-[200px]">

            <div className="flex items-center gap-3">
              <div className="bg-white/30 p-2 rounded-lg">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>

              {loading ? (
                <div className="h-6 w-24 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {formattedTotal}
                </span>
              )}
            </div>

            <p className="text-xs text-white/80 mt-1">
              Total Collection 
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WelcomeBanner;