import { LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="dashboard-section p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="quick-action-card group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
              <action.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-center">{action.title}</span>
            <span className="text-xs text-muted-foreground text-center mt-0.5">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
