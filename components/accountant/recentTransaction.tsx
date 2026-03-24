import {  ArrowUpRight, ArrowDownRight } from "lucide-react";

const transactions = [
  { id: 1, student: "Aarav Sharma", class: "Class 10-A", type: "Tuition Fee", amount: "₹15,000", method: "UPI", time: "10:30 AM", status: "success" },
  { id: 2, student: "Priya Patel", class: "Class 8-B", type: "Transport Fee", amount: "₹3,500", method: "Cash", time: "11:15 AM", status: "success" },
  { id: 3, student: "Rahul Verma", class: "Class 12-A", type: "Exam Fee", amount: "₹2,000", method: "Bank Transfer", time: "12:00 PM", status: "pending" },
  { id: 4, student: "Sneha Gupta", class: "Class 6-C", type: "Library Fee", amount: "₹500", method: "Cheque", time: "1:45 PM", status: "success" },
  { id: 5, student: "Arjun Singh", class: "Class 9-A", type: "Uniform Fee", amount: "₹4,200", method: "UPI", time: "2:30 PM", status: "success" },
];

const RecentTransactions = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        <button className="text-xs font-medium text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {t.status === 'success' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.student}</p>
                <p className="text-xs text-muted-foreground">{t.type} • {t.class}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{t.amount}</p>
              <p className="text-xs text-muted-foreground">{t.method} • {t.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;