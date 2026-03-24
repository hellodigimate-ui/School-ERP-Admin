import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatsCard({ title, value, subtitle, icon, iconBgColor = "bg-primary/10" }: StatsCardProps) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="stat-value mt-2">{value}</p>
          <p className="stat-label">{subtitle}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
