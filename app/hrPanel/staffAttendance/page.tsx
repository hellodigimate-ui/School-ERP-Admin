"use client"

import Layout from "@/components/hrPanel/layout";
import { Check, X, Clock } from "lucide-react";

const staffAttendance = [
  { name: "Dr. Anita Roy", avatar: "AR", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P", sat: "P" },
  { name: "Mr. Vikram Das", avatar: "VD", mon: "P", tue: "P", wed: "L", thu: "P", fri: "P", sat: "P" },
  { name: "Mrs. Priya Nair", avatar: "PN", mon: "P", tue: "A", wed: "A", thu: "P", fri: "P", sat: "P" },
  { name: "Mr. Arjun Mehta", avatar: "AM", mon: "P", tue: "P", wed: "P", thu: "P", fri: "L", sat: "P" },
  { name: "Ms. Kavita Joshi", avatar: "KJ", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P", sat: "A" },
  { name: "Mr. Rajesh Kumar", avatar: "RK", mon: "P", tue: "P", wed: "P", thu: "A", fri: "P", sat: "P" },
  { name: "Mrs. Suman Verma", avatar: "SV", mon: "P", tue: "P", wed: "P", thu: "P", fri: "P", sat: "P" },
  { name: "Mr. Deepak Singh", avatar: "DS", mon: "L", tue: "P", wed: "P", thu: "P", fri: "P", sat: "P" },
];

const statusIcon = (s: string) => {
  if (s === "P") return <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center"><Check className="w-4 h-4" /></div>;
  if (s === "A") return <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><X className="w-4 h-4" /></div>;
  return <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center"><Clock className="w-4 h-4" /></div>;
};

const days = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Attendance</h1>
            <p className="text-sm text-muted-foreground mt-1">Weekly attendance overview — Feb 24 - Mar 01, 2026</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/20 border border-success" /> Present</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-destructive/20 border border-destructive" /> Absent</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-warning/20 border border-warning" /> Late/Leave</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Staff</th>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th key={d} className="text-center px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffAttendance.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{s.avatar}</div>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  {days.map((d) => (
                    <td key={d} className="text-center px-3 py-3">{statusIcon(s[d])}</td>
                  ))}
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