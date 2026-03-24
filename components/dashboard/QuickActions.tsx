"use client"; 

import { useRouter } from "next/navigation"; 
import { UserPlus, BookPlus, CalendarPlus, FileText } from "lucide-react";

const actions = [
  {
    title: "Add Student",
    description: "Register a new student",
    icon: UserPlus,
    color: "bg-accent/10 text-accent hover:bg-accent/20",
    route:"/admin/student"
  },
  {
    title: "Create Class",
    description: "Set up a new class",
    icon: BookPlus,
    color: "bg-success/10 text-success hover:bg-success/20",
    route:"/admin/classes"
  },
  {
    title: "Schedule Event",
    description: "Add to calendar",
    icon: CalendarPlus,
    color: "bg-warning/10 text-warning hover:bg-warning/20",
    route:"/admin/schedule"
  },
  {
    title: "Generate Report",
    description: "Create new report",
    icon: FileText,
    color: "bg-primary/10 text-primary hover:bg-primary/20",
    route:"/admin/reports"
  },
];

export function QuickActions() {
  const router = useRouter(); 

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => router.push(action.route)}
            className={`p-4 rounded-xl transition-all duration-200 text-left ${action.color}`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <p className="font-medium text-sm">{action.title}</p>
            <p className="text-xs opacity-70 mt-0.5">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
