"use client"

import Layout from "@/components/hrPanel/layout";
import { DollarSign, Download, Calendar } from "lucide-react";

const payrollData = [
  { name: "Dr. Anita Roy", designation: "HOD Mathematics", avatar: "AR", basic: 65000, hra: 19500, da: 13000, pf: 7800, tax: 5200, net: 84500 },
  { name: "Mr. Vikram Das", designation: "Sr. Physics Teacher", avatar: "VD", basic: 55000, hra: 16500, da: 11000, pf: 6600, tax: 4400, net: 71500 },
  { name: "Mrs. Priya Nair", designation: "English Teacher", avatar: "PN", basic: 45000, hra: 13500, da: 9000, pf: 5400, tax: 3600, net: 58500 },
  { name: "Mr. Arjun Mehta", designation: "Chemistry Teacher", avatar: "AM", basic: 48000, hra: 14400, da: 9600, pf: 5760, tax: 3840, net: 62400 },
  { name: "Ms. Kavita Joshi", designation: "Biology Teacher", avatar: "KJ", basic: 42000, hra: 12600, da: 8400, pf: 5040, tax: 3360, net: 54600 },
  { name: "Mr. Rajesh Kumar", designation: "Accountant", avatar: "RK", basic: 40000, hra: 12000, da: 8000, pf: 4800, tax: 3200, net: 52000 },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payroll</h1>
            <p className="text-sm text-muted-foreground mt-1">Monthly salary management — February 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground">
              <Calendar className="w-4 h-4" /> Select Month
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-success" /></div>
            <div><p className="text-xl font-bold text-foreground">₹3,83,500</p><p className="text-xs text-muted-foreground">Total Net Pay</p></div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xl font-bold text-foreground">₹35,400</p><p className="text-xs text-muted-foreground">Total PF Deductions</p></div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-warning" /></div>
            <div><p className="text-xl font-bold text-foreground">₹23,600</p><p className="text-xs text-muted-foreground">Total Tax</p></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Staff</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Basic</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">HRA</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">DA</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">PF</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tax</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((p, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{p.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3.5 text-sm text-foreground">{fmt(p.basic)}</td>
                  <td className="text-right px-4 py-3.5 text-sm text-muted-foreground">{fmt(p.hra)}</td>
                  <td className="text-right px-4 py-3.5 text-sm text-muted-foreground">{fmt(p.da)}</td>
                  <td className="text-right px-4 py-3.5 text-sm text-destructive">-{fmt(p.pf)}</td>
                  <td className="text-right px-4 py-3.5 text-sm text-destructive">-{fmt(p.tax)}</td>
                  <td className="text-right px-5 py-3.5 text-sm font-semibold text-success">{fmt(p.net)}</td>
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
