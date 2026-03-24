"use client"


import { Receipt, Plus, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const FeesType = () => {
  const types = [
    { id: 1, name: "Admission Fees", code: "ADM", description: "One-time admission charges" },
    { id: 2, name: "Tuition Fees", code: "TUI", description: "Monthly tuition charges" },
    { id: 3, name: "Transport Fees", code: "TRN", description: "School bus charges" },
    { id: 4, name: "Hostel Fees", code: "HST", description: "Hostel accommodation charges" },
    { id: 5, name: "Exam Fees", code: "EXM", description: "Examination charges" },
    { id: 6, name: "Book Fees", code: "BKS", description: "Books and study material" },
    { id: 7, name: "Uniform Fees", code: "UNI", description: "School uniform charges" },
    { id: 8, name: "Late Fees", code: "LTF", description: "Late payment fine" },
    { id: 9, name: "Miscellaneous", code: "MSC", description: "Other charges" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Fee Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Fee Type Name" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="text" placeholder="Fee Code" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="text" placeholder="Description" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Fee Type
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Fee Type</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Code</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Description</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map(t => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-muted-foreground">{t.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{t.name}</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">{t.code}</span></td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{t.description}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeesMaster = () => {
  const masters = [
    { id: 1, type: "Tuition Fees", class: "Class 10", amount: 15000, frequency: "Monthly" },
    { id: 2, type: "Transport Fees", class: "All Classes", amount: 3500, frequency: "Monthly" },
    { id: 3, type: "Admission Fees", class: "Class 1", amount: 25000, frequency: "One-time" },
    { id: 4, type: "Exam Fees", class: "Class 12", amount: 5000, frequency: "Per Exam" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Fees Master</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Select Fee Type</option>
            <option>Tuition Fees</option>
            <option>Transport Fees</option>
            <option>Exam Fees</option>
          </select>
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Select Class</option>
            {["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount (₹)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Frequency</option>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
            <option>One-time</option>
          </select>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Fees Master
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Fee Type</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Class</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Frequency</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {masters.map(m => (
              <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-muted-foreground">{m.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{m.type}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{m.class}</td>
                <td className="px-5 py-3 text-sm text-right font-semibold text-foreground">₹{m.amount.toLocaleString()}</td>
                <td className="px-5 py-3"><span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-md">{m.frequency}</span></td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeesGroup = () => (
  <div className="space-y-5">
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4">Create Fees Group</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Group Name (e.g., Class 10 Annual Fee)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="text" placeholder="Description" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Select Fee Types to Include:</label>
        <div className="flex flex-wrap gap-3">
          {["Tuition Fees", "Book Fees", "Exam Fees", "Uniform Fees", "Transport Fees", "Lab Fees"].map(f => (
            <label key={f} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-input" /> {f}
            </label>
          ))}
        </div>
      </div>
      <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Create Group
      </button>
    </div>
    <div className="bg-card rounded-2xl border border-border p-6 text-center text-muted-foreground text-sm">
      No fee groups created yet. Create your first fee group above.
    </div>
  </div>
);

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "type";

  return (
    <Layout>
      <Header title="Fees Setup" description="Configure fee types, masters, and groups" icon={Receipt} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="type" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fees Type</TabsTrigger>
          <TabsTrigger value="master" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fees Master</TabsTrigger>
          <TabsTrigger value="group" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fees Group</TabsTrigger>
        </TabsList>
        <TabsContent value="type"><FeesType /></TabsContent>
        <TabsContent value="master"><FeesMaster /></TabsContent>
        <TabsContent value="group"><FeesGroup /></TabsContent>
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