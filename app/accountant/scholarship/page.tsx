"use client";


import { Award, Plus, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ScholarshipList = () => {
  const scholarships = [
    { id: 1, name: "Merit Scholarship", type: "Merit-Based", amount: 25000, eligibility: "Above 90%", status: "Active", beneficiaries: 20 },
    { id: 2, name: "SC/ST Scholarship", type: "Govt", amount: 15000, eligibility: "SC/ST Category", status: "Active", beneficiaries: 35 },
    { id: 3, name: "Sports Excellence", type: "Sports", amount: 20000, eligibility: "State/National Level", status: "Active", beneficiaries: 8 },
    { id: 4, name: "Disabled Students Fund", type: "Disabled", amount: 30000, eligibility: "40%+ Disability", status: "Active", beneficiaries: 5 },
    { id: 5, name: "Private Trust Award", type: "Private", amount: 10000, eligibility: "Below ₹2L Income", status: "Inactive", beneficiaries: 0 },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Scholarship</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Scholarship Name" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Type</option>
            <option>Govt</option>
            <option>Private</option>
            <option>Merit-Based</option>
            <option>Sports</option>
            <option>Disabled</option>
          </select>
          <input type="number" placeholder="Amount (₹)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input type="text" placeholder="Eligibility Criteria" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Academic Year</option>
            <option>2025-26</option>
            <option>2024-25</option>
          </select>
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Duration</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>Full Course</option>
          </select>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Scholarship
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Type</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Eligibility</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Beneficiaries</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm font-medium text-foreground">{s.name}</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">{s.type}</span></td>
                <td className="px-5 py-3 text-sm text-right font-semibold text-foreground">₹{s.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{s.eligibility}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>{s.status}</span>
                </td>
                <td className="px-5 py-3 text-center text-sm font-medium text-foreground">{s.beneficiaries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ApplicationStatus = () => {
  const applications = [
    { id: 1, student: "Aarav Sharma", class: "10-A", scholarship: "Merit Scholarship", appliedDate: "01 Feb 2026", status: "Approved", amount: 25000 },
    { id: 2, student: "Priya Patel", class: "8-B", scholarship: "SC/ST Scholarship", appliedDate: "05 Feb 2026", status: "Pending", amount: 15000 },
    { id: 3, student: "Rahul Verma", class: "12-A", scholarship: "Sports Excellence", appliedDate: "10 Feb 2026", status: "On Hold", amount: 20000 },
    { id: 4, student: "Sneha Gupta", class: "6-C", scholarship: "Disabled Students Fund", appliedDate: "12 Feb 2026", status: "Rejected", amount: 30000 },
    { id: 5, student: "Arjun Singh", class: "9-A", scholarship: "Merit Scholarship", appliedDate: "14 Feb 2026", status: "Pending", amount: 25000 },
  ];

  const statusIcons: Record<string, React.ReactNode> = {
    Approved: <CheckCircle className="w-3.5 h-3.5" />,
    Pending: <Clock className="w-3.5 h-3.5" />,
    Rejected: <XCircle className="w-3.5 h-3.5" />,
    "On Hold": <Clock className="w-3.5 h-3.5" />,
  };

  const statusStyles: Record<string, string> = {
    Approved: "bg-emerald-50 text-emerald-600",
    Pending: "bg-amber-50 text-amber-600",
    Rejected: "bg-destructive/10 text-destructive",
    "On Hold": "bg-primary/10 text-primary",
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Scholarship Applications</h3>
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(f => (
            <button key={f} className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">{f}</button>
          ))}
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Student</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Class</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Scholarship</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Applied</th>
            <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Amount</th>
            <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Status</th>
            <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(a => (
            <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3 text-sm font-medium text-foreground">{a.student}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{a.class}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{a.scholarship}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{a.appliedDate}</td>
              <td className="px-5 py-3 text-sm text-right font-semibold text-foreground">₹{a.amount.toLocaleString()}</td>
              <td className="px-5 py-3 text-center">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[a.status]}`}>
                  {statusIcons[a.status]} {a.status}
                </span>
              </td>
              <td className="px-5 py-3 text-center">
                <button className="p-1.5 rounded-lg hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Disbursement = () => {
  const records = [
    { id: 1, student: "Aarav Sharma", scholarship: "Merit Scholarship", amount: 25000, disbursedDate: "15 Jan 2026", mode: "Bank Transfer", status: "Disbursed" },
    { id: 2, student: "Priya Patel", scholarship: "SC/ST Scholarship", amount: 15000, disbursedDate: "—", mode: "—", status: "Pending" },
    { id: 3, student: "Rahul Verma", scholarship: "Sports Excellence", amount: 20000, disbursedDate: "10 Jan 2026", mode: "Cheque", status: "Disbursed" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card stat-card-green">
          <p className="text-2xl font-bold relative z-10">₹45,000</p>
          <p className="text-sm opacity-80 mt-1 relative z-10">Total Disbursed</p>
        </div>
        <div className="stat-card stat-card-amber">
          <p className="text-2xl font-bold relative z-10">₹15,000</p>
          <p className="text-sm opacity-80 mt-1 relative z-10">Pending Disbursement</p>
        </div>
        <div className="stat-card stat-card-blue">
          <p className="text-2xl font-bold relative z-10">3</p>
          <p className="text-sm opacity-80 mt-1 relative z-10">Total Beneficiaries</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Student</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Scholarship</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Mode</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm font-medium text-foreground">{r.student}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{r.scholarship}</td>
                <td className="px-5 py-3 text-sm text-right font-semibold text-foreground">₹{r.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{r.disbursedDate}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{r.mode}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "list";

  return (
    <Layout>
      <Header title="Scholarship" description="Manage scholarships, applications, and disbursements" icon={Award} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Scholarship List</TabsTrigger>
          <TabsTrigger value="status" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Application Status</TabsTrigger>
          <TabsTrigger value="disbursement" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Disbursement</TabsTrigger>
        </TabsList>
        <TabsContent value="list"><ScholarshipList /></TabsContent>
        <TabsContent value="status"><ApplicationStatus /></TabsContent>
        <TabsContent value="disbursement"><Disbursement /></TabsContent>
      </Tabs>
    </Layout>
  );
};

const PageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWrapper;