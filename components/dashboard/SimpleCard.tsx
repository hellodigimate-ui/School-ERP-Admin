export function SimpleCard({
  title,
  value,
  subtitle,
  footer,
}: {
  title: string;
  value: string;
  subtitle?: string;
  footer?: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-xl font-semibold mt-2">{value}</h3>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}

      {footer && (
        <div className="mt-4 space-y-1 text-sm">
          {footer.map((f) => (
            <div key={f.label} className="flex justify-between">
              <span>{f.label}</span>
              <span className={f.color}>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
