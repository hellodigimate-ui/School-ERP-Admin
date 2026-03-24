"use client"

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: "teal" | "yellow" | "orange" | "green" | "purple" | "blue";
}

const colorClasses = {
  teal: "bg-stat-teal/10 text-stat-teal",
  yellow: "bg-stat-yellow/10 text-stat-yellow",
  orange: "bg-stat-orange/10 text-stat-orange",
  green: "bg-stat-green/10 text-stat-green",
  purple: "bg-stat-purple/10 text-stat-purple",
  blue: "bg-stat-blue/10 text-stat-blue",
};

export function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-primary mt-1">{subtitle}</p>
        </div>
        <div className={cn("p-2.5 rounded-lg", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}