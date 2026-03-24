interface AttendanceStat {
  label: string;
  value: number;
  color: string;
}

const stats: AttendanceStat[] = [
  { label: "Rate", value: 94, color: "text-foreground" },
  { label: "Present", value: 142, color: "text-success" },
  { label: "Absent", value: 8, color: "text-destructive" },
  { label: "On Leave", value: 5, color: "text-warning" },
];

export function AttendanceOverview() {
  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Today`s Attendance</h2>
        <a href="/attendance" className="text-sm text-primary hover:underline font-medium">
          View Details →
        </a>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.label === "Rate" ? `${stat.value}%` : stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
