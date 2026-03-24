import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ClassStat {
  className: string;
  avgScore: number;
  trend: "up" | "down" | "stable";
  change: string;
}

const classStats: ClassStat[] = [
  { className: "Class 12-A", avgScore: 87, trend: "up", change: "+5%" },
  { className: "Class 11-A", avgScore: 82, trend: "up", change: "+3%" },
  { className: "Class 10-B", avgScore: 78, trend: "stable", change: "0%" },
  { className: "Class 12-B", avgScore: 85, trend: "down", change: "-2%" },
  { className: "Class 9-A", avgScore: 74, trend: "up", change: "+7%" },
];

export function ClassPerformance() {
  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Class Performance</h2>
        <a href="/grades" className="text-sm text-primary hover:underline font-medium">
          Details →
        </a>
      </div>
      <div className="space-y-3">
        {classStats.map((stat) => (
          <div key={stat.className} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">
                  {stat.avgScore}
                </span>
              </div>
              <span className="font-medium">{stat.className}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-success"
                    : stat.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
              {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
              {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
              {stat.trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
