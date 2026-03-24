import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend: string;
  colorClass: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, trend, colorClass, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className={`stat-card ${colorClass} animate-fade-in`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm mt-1 opacity-80 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;