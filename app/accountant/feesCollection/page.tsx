"use client"



import { IndianRupee, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, Suspense } from "react";
import Header from "@/components/accountant/header";
import Layout from "@/components/accountant/Layout";
import { useSearchParams } from "next/navigation";

const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const sectionOptions = ["A", "B", "C", "D"];
const paymentMethods = ["Cash", "Cheque", "UPI", "Bank Transfer"];

const CollectFees = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const demoStudents = [
    { id: 1, name: "Aarav Sharma", roll: "101", class: "10-A", totalFee: 45000, paid: 30000, due: 15000 },
    { id: 2, name: "Priya Patel", roll: "102", class: "10-A", totalFee: 45000, paid: 45000, due: 0 },
    { id: 3, name: "Rahul Verma", roll: "103", class: "10-A", totalFee: 45000, paid: 15000, due: 30000 },
    { id: 4, name: "Sneha Gupta", roll: "104", class: "10-A", totalFee: 45000, paid: 0, due: 45000 },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Select Student</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Class</label>
            <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">Select Class</option>
              {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Section</label>
            <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
              <option value="">Select Section</option>
              {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by name or roll number..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Roll No</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Class</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Total Fee</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Paid</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Due</th>
                <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {demoStudents.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">{s.name}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.roll}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.class}</td>
                  <td className="px-5 py-3.5 text-sm text-foreground text-right font-medium">₹{s.totalFee.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-medium text-emerald-600">₹{s.paid.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-right font-medium text-destructive">₹{s.due.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50" disabled={s.due === 0}>
                      {s.due === 0 ? "Paid" : "Collect"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Amount (₹)</label>
            <input type="number" placeholder="Enter amount" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Payment Mode</label>
            <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Installment</label>
            <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>1st Installment</option>
              <option>2nd Installment</option>
              <option>3rd Installment</option>
              <option>Full Payment</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            Submit Payment
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchFeesPayment = () => (
  <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
    <h3 className="font-semibold text-foreground">Search Fees Payment</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input type="text" placeholder="Student Name / ID" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input type="text" placeholder="Receipt No." className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input type="date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Search</button>
    </div>
    <div className="text-center py-12 text-muted-foreground text-sm">Search for fee payments by student name, ID, or receipt number</div>
  </div>
);

const SearchDueFees = () => {
  const dueList = [
    { name: "Rahul Verma", class: "10-A", due: 30000, dueDate: "15 Mar 2026", days: 5 },
    { name: "Sneha Gupta", class: "6-C", due: 45000, dueDate: "10 Mar 2026", days: 10 },
    { name: "Arjun Singh", class: "9-A", due: 12000, dueDate: "20 Mar 2026", days: 0 },
    { name: "Meera Nair", class: "8-B", due: 22000, dueDate: "01 Mar 2026", days: 19 },
  ];
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Students with Due Fees</h3>
        <select className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          {classOptions.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Student</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Class</th>
            <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Due Amount</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Due Date</th>
            <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Overdue</th>
          </tr>
        </thead>
        <tbody>
          {dueList.map(s => (
            <tr key={s.name} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3.5 text-sm font-medium text-foreground">{s.name}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.class}</td>
              <td className="px-5 py-3.5 text-sm text-right font-semibold text-destructive">₹{s.due.toLocaleString()}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.dueDate}</td>
              <td className="px-5 py-3.5 text-center">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.days > 0 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-50 text-emerald-600'}`}>
                  {s.days > 0 ? `${s.days} days` : "On time"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FeesCarryForward = () => (
  <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
    <h3 className="font-semibold text-foreground">Fees Carry Forward</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">From Session</label>
        <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option>2024-25</option>
          <option>2023-24</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">To Session</label>
        <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option>2025-26</option>
          <option>2024-25</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Class</label>
        <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          {classOptions.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
      Carry Forward Fees
    </button>
    <div className="text-center py-8 text-muted-foreground text-sm">Select session and class to carry forward pending fees</div>
  </div>
);

const FeesReminder = () => (
  <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
    <h3 className="font-semibold text-foreground">Send Fees Reminder</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Class</label>
        <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option value="">All Classes</option>
          {classOptions.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Reminder Via</label>
        <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option>SMS</option>
          <option>Email</option>
          <option>WhatsApp</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Due Amount Greater Than</label>
        <input type="number" placeholder="₹0" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
    </div>
    <div className="flex gap-3">
      <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Send Reminder</button>
      <button className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium">Preview</button>
    </div>
  </div>
);

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "collect";

  return (
    <Layout>
      <Header title="Fees Collection" description="Collect and manage student fees" icon={IndianRupee} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="collect" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Collect Fees</TabsTrigger>
          <TabsTrigger value="search-payment" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Search Payment</TabsTrigger>
          <TabsTrigger value="search-due" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Search Due Fees</TabsTrigger>
          <TabsTrigger value="carry-forward" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Carry Forward</TabsTrigger>
          <TabsTrigger value="reminder" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reminder</TabsTrigger>
        </TabsList>
        <TabsContent value="collect"><CollectFees /></TabsContent>
        <TabsContent value="search-payment"><SearchFeesPayment /></TabsContent>
        <TabsContent value="search-due"><SearchDueFees /></TabsContent>
        <TabsContent value="carry-forward"><FeesCarryForward /></TabsContent>
        <TabsContent value="reminder"><FeesReminder /></TabsContent>
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