import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-3xl font-bold mt-1">{value}</span>
          <span className="text-sm text-primary mt-1">{subtitle}</span>
        </div>
        <div className={cn("stat-card-icon", iconBgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
