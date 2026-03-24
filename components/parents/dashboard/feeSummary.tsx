
interface FeesSummaryProps {
  data: {
    collectionRate: number;
    collected: number;
    pending: number;
    overdue: number;
  };
}

export function FeesSummary({ data }: FeesSummaryProps) {
  return (
    <div className="dashboard-section p-6">
      <h3 className="text-sm text-muted-foreground mb-2">Fee Payment Status</h3>
      <div className="text-3xl font-bold mb-4">{data.collectionRate}%</div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paid</span>
          <span className="text-success font-medium">₹{data.collected.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pending</span>
          <span className="text-warning font-medium">₹{data.pending.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Overdue</span>
          <span className="text-destructive font-medium">₹{data.overdue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
