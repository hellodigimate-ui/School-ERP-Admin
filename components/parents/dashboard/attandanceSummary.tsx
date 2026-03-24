

interface AttendanceSummaryProps {
  data: {
    rate: number;
    present: number;
    absent: number;
    leave: number;
    childName: string;
  };
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  return (
    <div className="dashboard-section p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today`s Attendance</h3>
        <span className="text-sm text-primary cursor-pointer hover:underline">
          View Details →
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{data.childName}</p>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold">{data.rate}%</div>
          <div className="text-sm text-muted-foreground">Rate</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-success">{data.present}</div>
          <div className="text-sm text-muted-foreground">Present</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-destructive">{data.absent}</div>
          <div className="text-sm text-muted-foreground">Absent</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-warning">{data.leave}</div>
          <div className="text-sm text-muted-foreground">On Leave</div>
        </div>
      </div>
    </div>
  );
}
