"use client"

interface FeeStatusProps {
  collected: string;
  pending: string;
  overdue: string;
}

export function FeeStatus({ collected, pending, overdue }: FeeStatusProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <p className="text-xs text-muted-foreground mb-1">Fee Status</p>
        <p className="text-xl font-bold text-foreground">Term 2</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Paid</span>
          <span className="text-sm font-medium text-stat-green">{collected}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pending</span>
          <span className="text-sm font-medium text-stat-yellow">{pending}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overdue</span>
          <span className="text-sm font-medium text-destructive">{overdue}</span>
        </div>
      </div>
    </div>
  );
}