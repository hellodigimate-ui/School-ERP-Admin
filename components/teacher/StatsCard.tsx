import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "bg-gradient-to-br from-primary/20 to-primary/10",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "bg-gradient-to-br from-background to-muted/40",
        "border border-border/50",
        "shadow-sm hover:shadow-xl",
        "transition-all duration-300 ease-in-out",
        "hover:-translate-y-1 hover:scale-[1.02]",
        "animate-fade-in"
      )}
    >
      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-40" />

      <div className="flex items-start justify-between relative z-10">
        {/* Left Content */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground tracking-wide">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            {value}
          </p>

          <p className="text-xs mt-1 text-muted-foreground/80">
            {subtitle}
          </p>
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "shadow-inner backdrop-blur-sm",
            "border border-white/10",
            iconBgColor
          )}
        >
          <div className="text-primary text-lg">{icon}</div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-indigo-400 to-purple-500 opacity-70" />
    </div>
  );
}