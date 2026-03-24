/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { useState } from "react";
import { Plus, Edit, Trash2, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import LibrarianLayout from "../shell/page";

type FineRule = {
  id: number; name: string; description: string; amountPerDay: number;
  gracePeriod: number; maxFine: number; applicableTo: string; active: boolean;
};

const initialRules: FineRule[] = [
  { id: 1, name: "Late Return - General", description: "Standard fine for late book returns", amountPerDay: 5, gracePeriod: 2, maxFine: 200, applicableTo: "All Members", active: true },
  { id: 2, name: "Late Return - Reference", description: "Fine for reference books (higher rate)", amountPerDay: 10, gracePeriod: 0, maxFine: 500, applicableTo: "All Members", active: true },
  { id: 3, name: "Damaged Book", description: "Fine for returning damaged books", amountPerDay: 0, gracePeriod: 0, maxFine: 300, applicableTo: "All Members", active: true },
  { id: 4, name: "Lost Book", description: "Replacement cost + processing fee", amountPerDay: 0, gracePeriod: 0, maxFine: 0, applicableTo: "All Members", active: true },
  { id: 5, name: "Late Return - Periodicals", description: "Fine for magazines and journals", amountPerDay: 2, gracePeriod: 1, maxFine: 100, applicableTo: "Students", active: false },
];

const inputClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

function RuleModal({ open, onOpenChange, rule, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  rule: FineRule | null;
  onSave: (r: Omit<FineRule, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: rule?.name || "", description: rule?.description || "", amountPerDay: rule?.amountPerDay || 0,
    gracePeriod: rule?.gracePeriod || 0, maxFine: rule?.maxFine || 0, applicableTo: rule?.applicableTo || "All Members", active: rule?.active ?? true,
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{rule ? "Edit Fine Rule" : "Add Fine Rule"}</DialogTitle>
          <DialogDescription>Configure the fine rule parameters.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Rule Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Late Return - General" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Rule description..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Amount/Day (₹)</label>
              <input type="number" value={form.amountPerDay} onChange={e => set("amountPerDay", +e.target.value)} min={0} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Grace Period (days)</label>
              <input type="number" value={form.gracePeriod} onChange={e => set("gracePeriod", +e.target.value)} min={0} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Max Fine (₹)</label>
              <input type="number" value={form.maxFine} onChange={e => set("maxFine", +e.target.value)} min={0} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Applicable To</label>
              <select value={form.applicableTo} onChange={e => set("applicableTo", e.target.value)} className={inputClass}>
                <option>All Members</option><option>Students</option><option>Staff</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select value={form.active ? "Active" : "Inactive"} onChange={e => set("active", e.target.value === "Active")} className={inputClass}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { if (form.name) { onSave(form); onOpenChange(false); } }}>
            {rule ? "Update" : "Add"} Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FineRules() {
  const [rules, setRules] = useState(initialRules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRule, setEditRule] = useState<FineRule | null>(null);
  const { toast } = useToast();

  const handleSave = (data: Omit<FineRule, "id">) => {
    if (editRule) {
      setRules(prev => prev.map(r => r.id === editRule.id ? { ...r, ...data } : r));
      toast({ title: "Rule Updated", description: `"${data.name}" has been updated.` });
    } else {
      setRules(prev => [...prev, { ...data, id: Date.now() }]);
      toast({ title: "Rule Added", description: `"${data.name}" has been created.` });
    }
    setEditRule(null);
  };

  const toggleActive = (id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id: number) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast({ title: "Rule Deleted", description: "Fine rule has been removed." });
  };

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Fine Rules</h1>
            <p className="text-sm text-muted-foreground">Configure and manage library fine policies</p>
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditRule(null); setModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Rule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-accent">{rules.length}</p><p className="text-sm text-muted-foreground">Total Rules</p></div>
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-success">{rules.filter(r => r.active).length}</p><p className="text-sm text-muted-foreground">Active Rules</p></div>
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-warning">{rules.filter(r => !r.active).length}</p><p className="text-sm text-muted-foreground">Inactive Rules</p></div>
        </div>

        {/* Rules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <div key={rule.id} className={`rounded-xl border bg-card p-5 transition-all ${rule.active ? "border-border" : "border-border/50 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold font-display">{rule.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(rule.id)} className="rounded p-1 text-muted-foreground hover:text-accent transition-colors">
                    {rule.active ? <ToggleRight className="h-5 w-5 text-success" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button onClick={() => { setEditRule(rule); setModalOpen(true); }} className="rounded p-1 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => deleteRule(rule.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Rate: </span>
                  <span className="font-medium">{rule.amountPerDay > 0 ? `₹${rule.amountPerDay}/day` : "Fixed"}</span>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Grace: </span>
                  <span className="font-medium">{rule.gracePeriod} days</span>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">Max: </span>
                  <span className="font-medium">{rule.maxFine > 0 ? `₹${rule.maxFine}` : "Book cost"}</span>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">For: </span>
                  <span className="font-medium">{rule.applicableTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <RuleModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditRule(null); }} rule={editRule} onSave={handleSave} />
      </div>
    </LibrarianLayout>
  );
}
