

export function MetricCard({
  title,
  value,
  badge,
}: {
  title: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-2xl font-semibold">{value}</h3>
        {badge && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
