"use client";


import { Wallet, Plus, Edit, Trash2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/accountant/header";
import Layout from "@/components/accountant/Layout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const AddExpense = () => (
  <div className="space-y-5">
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4">Add New Expense</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          <option>Select Expense Head</option>
          <option>Salary</option>
          <option>Electricity</option>
          <option>Maintenance</option>
          <option>Stationery</option>
          <option>Transport</option>
          <option>Events</option>
        </select>
        <input type="text" placeholder="Expense Name" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="number" placeholder="Amount (₹)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <input type="date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="text" placeholder="Invoice No. (optional)" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="file" className="rounded-xl border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary" />
      </div>
      <div className="mt-4">
        <textarea placeholder="Description / Notes" rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
      </div>
      <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Expense
      </button>
    </div>
    {/* Recent */}
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border"><h3 className="font-semibold text-foreground">Recent Expenses</h3></div>
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
            { date: "17 Feb 2026", head: "Electricity", name: "Monthly Bill Feb", amount: 45000 },
            { date: "15 Feb 2026", head: "Stationery", name: "Office Supplies", amount: 8500 },
            { date: "14 Feb 2026", head: "Maintenance", name: "Plumbing Repair", amount: 12000 },
          ].map((e, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-5 py-3 text-sm text-muted-foreground">{e.date}</td>
              <td className="px-5 py-3"><span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-1 rounded-md">{e.head}</span></td>
              <td className="px-5 py-3 text-sm font-medium text-foreground">{e.name}</td>
              <td className="px-5 py-3 text-sm text-right font-semibold text-destructive">₹{e.amount.toLocaleString()}</td>
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

const ExpenseHead = () => {
  const heads = [
    { id: 1, name: "Salary", description: "Staff and teacher salaries" },
    { id: 2, name: "Electricity", description: "Power and utility bills" },
    { id: 3, name: "Maintenance", description: "Building and equipment repairs" },
    { id: 4, name: "Stationery", description: "Office and school supplies" },
    { id: 5, name: "Transport", description: "Vehicle fuel and maintenance" },
    { id: 6, name: "Events", description: "School events and functions" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Expense Head</h3>
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

const SearchExpense = () => (
  <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
    <h3 className="font-semibold text-foreground">Search Expenses</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
        <option>All Expense Heads</option>
        <option>Salary</option>
        <option>Electricity</option>
        <option>Maintenance</option>
        <option>Stationery</option>
      </select>
      <input type="date" placeholder="From Date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <input type="date" placeholder="To Date" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2">
        <Search className="w-4 h-4" /> Search
      </button>
    </div>
    <div className="text-center py-12 text-muted-foreground text-sm">Select filters and click search to view expenses</div>
  </div>
);

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "add";

  return (
    <Layout>
      <Header title="Expenses" description="Track and manage all school expenses" icon={Wallet} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="add" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Add Expense</TabsTrigger>
          <TabsTrigger value="head" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Expense Head</TabsTrigger>
          <TabsTrigger value="search" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Search Expense</TabsTrigger>
        </TabsList>
        <TabsContent value="add"><AddExpense /></TabsContent>
        <TabsContent value="head"><ExpenseHead /></TabsContent>
        <TabsContent value="search"><SearchExpense /></TabsContent>
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