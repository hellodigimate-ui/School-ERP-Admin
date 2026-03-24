import { ClipboardCheck, FileEdit, CalendarPlus, FileBarChart } from "lucide-react";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  iconColor: string;
}

const quickActions: QuickAction[] = [
  {
    icon: ClipboardCheck,
    title: "Take Attendance",
    description: "Mark today's attendance",
    href: "/attendance",
    iconColor: "text-primary",
  },
  {
    icon: FileEdit,
    title: "Add Grades",
    description: "Enter student grades",
    href: "/grades",
    iconColor: "text-success",
  },
  {
    icon: CalendarPlus,
    title: "Create Assignment",
    description: "Add new assignment",
    href: "/assignments",
    iconColor: "text-warning",
  },
  {
    icon: FileBarChart,
    title: "Generate Report",
    description: "Create class report",
    href: "/reports",
    iconColor: "text-info",
  },
];

export function QuickActions() {
  return (
    <div className="dashboard-section animate-fade-in">
      <h2 className="section-title">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <a key={action.title} href={action.href} className="quick-action-card group">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm text-primary">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
