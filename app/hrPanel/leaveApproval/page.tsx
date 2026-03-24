"use client"
import Layout from "@/components/hrPanel/layout";
import { Check, X, Clock, Eye } from "lucide-react";

const leaveRequests = [
  { id: 1, name: "Mrs. Priya Nair", avatar: "PN", type: "Sick Leave", from: "2026-03-01", to: "2026-03-02", days: 2, reason: "Fever and cold", status: "Pending" },
  { id: 2, name: "Mr. Vikram Das", avatar: "VD", type: "Casual Leave", from: "2026-03-05", to: "2026-03-05", days: 1, reason: "Personal work", status: "Pending" },
  { id: 3, name: "Ms. Kavita Joshi", avatar: "KJ", type: "Personal Leave", from: "2026-03-10", to: "2026-03-12", days: 3, reason: "Family function", status: "Pending" },
  { id: 4, name: "Mr. Arjun Mehta", avatar: "AM", type: "Medical Leave", from: "2026-02-20", to: "2026-02-24", days: 5, reason: "Surgery recovery", status: "Approved" },
  { id: 5, name: "Mr. Deepak Singh", avatar: "DS", type: "Casual Leave", from: "2026-02-18", to: "2026-02-18", days: 1, reason: "Appointment", status: "Rejected" },
  { id: 6, name: "Mrs. Suman Verma", avatar: "SV", type: "Maternity Leave", from: "2026-04-01", to: "2026-06-30", days: 91, reason: "Maternity", status: "Approved" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Approved: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Approval</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage leave requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-bold text-foreground">3</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center"><Check className="w-5 h-5 text-success" /></div>
            <div><p className="text-2xl font-bold text-foreground">2</p><p className="text-xs text-muted-foreground">Approved</p></div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center"><X className="w-5 h-5 text-destructive" /></div>
            <div><p className="text-2xl font-bold text-foreground">1</p><p className="text-xs text-muted-foreground">Rejected</p></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Staff</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, i) => (
                <tr key={req.id} className="border-b border-border last:border-0 hover:bg-secondary/30 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{req.avatar}</div>
                      <span className="text-sm font-medium text-foreground">{req.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{req.type}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-foreground">{req.days} day{req.days > 1 ? "s" : ""}</p>
                    <p className="text-xs text-muted-foreground">{req.from} → {req.to}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground max-w-[200px] truncate">{req.reason}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[req.status]}`}>{req.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {req.status === "Pending" ? (
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20"><Check className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Eye className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Page;