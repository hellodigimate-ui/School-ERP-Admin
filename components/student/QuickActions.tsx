"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    title: "View Courses",
    description: "Browse enrolled courses",
    icon: BookOpen,
    color: "text-stat-teal",
    href: "/student/courses",
  },
  {
    title: "Assignments",
    description: "Check pending work",
    icon: FileText,
    color: "text-stat-yellow",
    href: "/student/assignments",
  },
  {
    title: "Time Table",
    description: "View class timetable",
    icon: Calendar,
    color: "text-stat-blue",
    href: "/student/schedule",
  },
  {
    title: "Ask Doubt",
    description: "Get help from teachers",
    icon: MessageSquare,
    color: "text-stat-purple",
    href: "/student/dashboard",
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">
          Quick Actions
        </h3>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => router.push(action.href)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <action.icon className={cn("h-6 w-6", action.color)} />
            <div>
              <p className={cn("text-sm font-medium", action.color)}>
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
