"use client"

import { BookOpen, CreditCard, TrendingUp } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string;
  icon: React.ElementType;
}

const summaryCards: SummaryCard[] = [
  { title: "Attendance Overview", value: "92% this month", icon: TrendingUp },
  { title: "Pending Fees", value: "₹15,000", icon: CreditCard },
  { title: "Next Class", value: "Mathematics at 10:00 AM", icon: BookOpen },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="bg-card rounded-xl p-5 border border-border shadow-sm"
        >
          <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
          <p className="text-lg font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}