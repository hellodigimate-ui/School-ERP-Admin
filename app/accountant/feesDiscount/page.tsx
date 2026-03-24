"use client";


import { Percent, Plus, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/accountant/Layout";
import Header from "@/components/accountant/header";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const DisabledDiscount = () => {
  const discounts = [
    { id: 1, name: "Visually Impaired", percentage: 50, applicableFees: "Tuition, Transport", students: 3 },
    { id: 2, name: "Hearing Impaired", percentage: 40, applicableFees: "Tuition", students: 2 },
    { id: 3, name: "Physically Disabled", percentage: 30, applicableFees: "All Fees", students: 4 },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Disabled Discount</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Disability Type" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="number" placeholder="Discount %" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Applicable Fees</option>
            <option>All Fees</option>
            <option>Tuition Only</option>
            <option>Tuition + Transport</option>
          </select>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Disability Type</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Discount %</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Applicable Fees</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Students</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-muted-foreground">{d.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{d.name}</td>
                <td className="px-5 py-3 text-center"><span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full">{d.percentage}%</span></td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{d.applicableFees}</td>
                <td className="px-5 py-3 text-center text-sm font-medium text-foreground">{d.students}</td>
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

const SiblingDiscount = () => {
  const discounts = [
    { id: 1, siblings: "2 Siblings", percentage: 10, applicableFees: "Tuition", beneficiaries: 12 },
    { id: 2, siblings: "3 Siblings", percentage: 15, applicableFees: "Tuition + Transport", beneficiaries: 6 },
    { id: 3, siblings: "4+ Siblings", percentage: 20, applicableFees: "All Fees", beneficiaries: 2 },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Add Sibling Discount</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Number of Siblings</option>
            <option>2 Siblings</option>
            <option>3 Siblings</option>
            <option>4+ Siblings</option>
          </select>
          <input type="number" placeholder="Discount %" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
            <option>Applicable Fees</option>
            <option>All Fees</option>
            <option>Tuition Only</option>
            <option>Tuition + Transport</option>
          </select>
        </div>
        <button className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Sibling Count</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Discount %</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Applicable Fees</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Beneficiaries</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 text-sm text-muted-foreground">{d.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-foreground">{d.siblings}</td>
                <td className="px-5 py-3 text-center"><span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{d.percentage}%</span></td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{d.applicableFees}</td>
                <td className="px-5 py-3 text-center text-sm font-medium text-foreground">{d.beneficiaries}</td>
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

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "disabled";

  return (
    <Layout>
      <Header title="Fees Discount" description="Manage discounts for disabled and sibling students" icon={Percent} />
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="bg-card border border-border rounded-xl p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="disabled" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Disabled Discount</TabsTrigger>
          <TabsTrigger value="sibling" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sibling Discount</TabsTrigger>
        </TabsList>
        <TabsContent value="disabled"><DisabledDiscount /></TabsContent>
        <TabsContent value="sibling"><SiblingDiscount /></TabsContent>
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