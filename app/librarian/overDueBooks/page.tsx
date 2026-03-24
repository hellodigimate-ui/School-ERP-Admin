"use client"

import { useState } from "react";
import { Search, AlertTriangle, Send, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import LibrarianLayout from "../shell/page";

type OverdueRecord = {
  id: number; student: string; class: string; book: string; isbn: string;
  issueDate: string; dueDate: string; daysOverdue: number; fine: number; contact: string; status: "Overdue" | "Notified" | "Returned";
};

const initialRecords: OverdueRecord[] = [
  { id: 1, student: "Sneha Gupta", class: "8-A", book: "Mathematics NCERT", isbn: "978-81-7450-636-0", issueDate: "01 Feb 2026", dueDate: "15 Feb 2026", daysOverdue: 6, fine: 30, contact: "9876543210", status: "Overdue" },
  { id: 2, student: "Priya Patel", class: "9-B", book: "English Literature", isbn: "978-0-14-018546-0", issueDate: "05 Feb 2026", dueDate: "19 Feb 2026", daysOverdue: 2, fine: 10, contact: "9876543211", status: "Notified" },
  { id: 3, student: "Amit Kumar", class: "10-C", book: "History of Modern India", isbn: "978-93-5260-011-8", issueDate: "28 Jan 2026", dueDate: "11 Feb 2026", daysOverdue: 10, fine: 50, contact: "9876543212", status: "Overdue" },
  { id: 4, student: "Ritu Sharma", class: "11-A", book: "Physics Vol. 2", isbn: "978-81-7709-147-2", issueDate: "02 Feb 2026", dueDate: "16 Feb 2026", daysOverdue: 5, fine: 25, contact: "9876543213", status: "Overdue" },
  { id: 5, student: "Deepak Yadav", class: "12-B", book: "Chemistry Lab Manual", isbn: "978-81-7709-234-9", issueDate: "25 Jan 2026", dueDate: "08 Feb 2026", daysOverdue: 13, fine: 65, contact: "9876543214", status: "Notified" },
  { id: 6, student: "Kavita Singh", class: "7-A", book: "Hindi Sahitya", isbn: "978-81-2670-123-0", issueDate: "30 Jan 2026", dueDate: "13 Feb 2026", daysOverdue: 8, fine: 40, contact: "9876543215", status: "Overdue" },
];

const inputClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

function ReturnModal({ open, onOpenChange, record, onReturn }: {
  open: boolean; onOpenChange: (v: boolean) => void; record: OverdueRecord; onReturn: (id: number, fine: number) => void;
}) {
  const [fine, setFine] = useState(record.fine);
  const [condition, setCondition] = useState("Good");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Return Overdue Book</DialogTitle>
          <DialogDescription>Process return for {record.student}`s book.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 text-sm">
          <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Book</span><span className="font-medium">{record.book}</span></div>
          <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Days Overdue</span><span className="font-medium text-destructive">{record.daysOverdue} days</span></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Fine Amount (₹)</label>
              <input type="number" value={fine} onChange={e => setFine(+e.target.value)} min={0} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Book Condition</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} className={inputClass}>
                <option>Good</option><option>Fair</option><option>Damaged</option><option>Lost</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => { onReturn(record.id, fine); onOpenChange(false); }}>
            <CheckCircle className="mr-1 h-4 w-4" /> Mark Returned
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OverdueBooks() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [returnRecord, setReturnRecord] = useState<OverdueRecord | null>(null);
  const { toast } = useToast();

  const active = records.filter(r => r.status !== "Returned");
  const filtered = active.filter(r => r.student.toLowerCase().includes(search.toLowerCase()) || r.book.toLowerCase().includes(search.toLowerCase()));

  const sendReminder = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Notified" as const } : r));
    toast({ title: "Reminder Sent", description: "Overdue notification has been sent to the student." });
  };

  const handleReturn = (id: number, fine: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Returned" as const, fine } : r));
    toast({ title: "Book Returned", description: `Book marked as returned. Fine: ₹${fine}` });
  };

  const totalFine = active.reduce((s, r) => s + r.fine, 0);

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Overdue Books</h1>
            <p className="text-sm text-muted-foreground">Track and manage overdue book returns</p>
          </div>
          <Button size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90" onClick={() => { active.filter(r => r.status === "Overdue").forEach(r => sendReminder(r.id)); }}>
            <Send className="mr-2 h-4 w-4" /> Send All Reminders
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card stat-card-gradient"><AlertTriangle className="h-5 w-5 text-destructive mb-2" /><p className="text-2xl font-bold font-display text-destructive">{active.length}</p><p className="text-sm text-muted-foreground">Total Overdue</p></div>
          <div className="stat-card stat-card-gradient"><Clock className="h-5 w-5 text-warning mb-2" /><p className="text-2xl font-bold font-display text-warning">{active.filter(r => r.daysOverdue > 7).length}</p><p className="text-sm text-muted-foreground">Critical (7+ days)</p></div>
          <div className="stat-card stat-card-gradient"><Send className="h-5 w-5 text-info mb-2" /><p className="text-2xl font-bold font-display text-info">{active.filter(r => r.status === "Notified").length}</p><p className="text-sm text-muted-foreground">Notified</p></div>
          <div className="stat-card stat-card-gradient"><span className="text-lg mb-1">₹</span><p className="text-2xl font-bold font-display text-accent">{totalFine}</p><p className="text-sm text-muted-foreground">Total Fines</p></div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or book..." className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["#", "Student", "Class", "Book", "Issue Date", "Due Date", "Overdue", "Fine (₹)", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.class}</td>
                  <td className="px-4 py-3">{r.book}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.issueDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.dueDate}</td>
                  <td className="px-4 py-3"><span className={`font-medium ${r.daysOverdue > 7 ? "text-destructive" : "text-warning"}`}>{r.daysOverdue} days</span></td>
                  <td className="px-4 py-3 font-medium">₹{r.fine}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "Notified" ? "bg-info/10 text-info" : "bg-destructive/10 text-destructive"}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {r.status === "Overdue" && (
                        <button onClick={() => sendReminder(r.id)} className="rounded p-1 text-muted-foreground hover:text-info hover:bg-info/10 transition-colors" title="Send Reminder"><Send className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => setReturnRecord(r)} className="rounded p-1 text-muted-foreground hover:text-success hover:bg-success/10 transition-colors" title="Mark Returned"><CheckCircle className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {returnRecord && <ReturnModal open={!!returnRecord} onOpenChange={() => setReturnRecord(null)} record={returnRecord} onReturn={handleReturn} />}
      </div>
    </LibrarianLayout>
  );
}