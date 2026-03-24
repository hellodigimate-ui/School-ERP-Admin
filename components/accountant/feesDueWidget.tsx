const feesDue = [
  { class: "Class 10-A", students: 12, amount: "₹1,80,000", urgency: "high" },
  { class: "Class 8-B", students: 8, amount: "₹96,000", urgency: "medium" },
  { class: "Class 12-A", students: 15, amount: "₹2,25,000", urgency: "high" },
  { class: "Class 6-C", students: 5, amount: "₹40,000", urgency: "low" },
  { class: "Class 9-A", students: 10, amount: "₹1,50,000", urgency: "medium" },
];

const urgencyStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-emerald-50 text-emerald-600",
};

const FeesDueWidget = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in" style={{ animationDelay: "600ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Pending Fees by Class</h3>
        <button className="text-xs font-medium text-primary hover:underline">Send Reminders</button>
      </div>
      <div className="space-y-3">
        {feesDue.map((item) => (
          <div key={item.class} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{item.class}</p>
              <p className="text-xs text-muted-foreground">{item.students} students pending</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{item.amount}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyStyles[item.urgency]}`}>
                {item.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesDueWidget;