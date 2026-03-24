"use client";



import { Banknote, Plus, Edit, Trash2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AddIncome = () => (
  <div className="space-y-5">
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4">Add New Income</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option>Select Income Head</option>
          <option>Fees Collection</option>
          <option>Donation</option>
          <option>Canteen Revenue</option>
          <option>Transport Revenue</option>
          <option>Govt Grant</option>
          <option>Rent Income</option>
        </select>
        <input type="text" placeholder="Income Name" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="number" placeholder="Amount (₹)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <input type="date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="text" placeholder="Invoice / Receipt No." className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="file" className="rounded-xl border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary" />
      </div>
      <div className="mt-4">
        <textarea placeholder="Description / Notes" rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
      </div>
      <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Income
      </button>
    </div>
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border"><h3 className="font-semibold text-foreground">Recent Income</h3></div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Date</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Head</th>
            <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Name</th>
            <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Amount</th>
            <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { date: "17 Feb 2026", head: "Fees Collection", name: "Monthly Fees Feb", amount: 850000 },
            { date: "16 Feb 2026", head: "Canteen Revenue", name: "Canteen Sales Feb W3", amount: 35000 },
            { date: "15 Feb 2026", head: "Donation", name: "Annual Day Sponsorship", amount: 100000 },
          ].map((e, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3 text-sm text-muted-foreground">{e.date}</td>
              <td className="px-5 py-3"><span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">{e.head}</span></td>
              <td className="px-5 py-3 text-sm font-medium text-foreground">{e.name}</td>
              <td className="px-5 py-3 text-sm text-right font-semibold text-emerald-600">₹{e.amount.toLocaleString()}</td>
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

const IncomeHead = () => {
  const heads = [
    { id: 1, name: "Fees Collection", description: "Student fee payments" },
    { id: 2, name: "Donation", description: "Donations and sponsorships" },
    { id: 3, name: "Canteen Revenue", description: "Canteen and cafeteria sales" },
    { id: 4, name: "Transport Revenue", description: "Transport service charges" },
    { id: 5, name: "Govt Grant", description: "Government grants and subsidies" },
    { id: 6, name: "Rent Income", description: "Rental of school facilities" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Income Head</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Head Name" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="text" placeholder="Description" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Head
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Description</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {heads.map(h => (
              <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-muted-foreground">{h.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{h.name}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{h.description}</td>
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

const SearchIncome = () => (
  <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
    <h3 className="font-semibold text-foreground">Search Income</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
        <option>All Income Heads</option>
        <option>Fees Collection</option>
        <option>Donation</option>
        <option>Canteen Revenue</option>
        <option>Govt Grant</option>
      </select>
      <input type="date" placeholder="From Date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input type="date" placeholder="To Date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2">
        <Search className="w-4 h-4" /> Search
      </button>
    </div>
    <div className="text-center py-12 text-muted-foreground text-sm">Select filters and click search to view income records</div>
  </div>
);

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "add";

  return (
    <Layout>
      <Header title="Income" description="Track and manage all school income sources" icon={Banknote} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="add" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Add Income</TabsTrigger>
          <TabsTrigger value="head" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Income Head</TabsTrigger>
          <TabsTrigger value="search" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Search Income</TabsTrigger>
        </TabsList>
        <TabsContent value="add"><AddIncome /></TabsContent>
        <TabsContent value="head"><IncomeHead /></TabsContent>
        <TabsContent value="search"><SearchIncome /></TabsContent>
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