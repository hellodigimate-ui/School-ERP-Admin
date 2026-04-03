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
    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Class Performance</h2>
        <a href="/grades" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
          Details →
        </a>
      </div>
      <div className="space-y-4">
        {classStats.map((stat) => (
          <div key={stat.className} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-lg font-bold text-accent">
                  {stat.avgScore}
                </span>
              </div>
              <span className="font-semibold text-foreground">{stat.className}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  stat.trend === "up"
                    ? "text-success"
                    : stat.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
              {stat.trend === "up" && <TrendingUp className="w-5 h-5 text-success" />}
              {stat.trend === "down" && <TrendingDown className="w-5 h-5 text-destructive" />}
              {stat.trend === "stable" && <Minus className="w-5 h-5 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
