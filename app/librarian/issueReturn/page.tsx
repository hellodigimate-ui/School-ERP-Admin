"use client"


import { useState } from "react";
import { Search, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import LibrarianLayout from "../shell/page";

type Transaction = {
  id: number;
  student: string;
  class: string;
  book: string;
  issueDate: string;
  dueDate: string;
  status: "Issued" | "Returned" | "Overdue";
};

const transactions: Transaction[] = [
  { id: 1, student: "Aarav Sharma", class: "10-A", book: "Physics Vol. 2", issueDate: "10 Feb 2026", dueDate: "24 Feb 2026", status: "Issued" },
  { id: 2, student: "Priya Patel", class: "9-B", book: "English Literature", issueDate: "05 Feb 2026", dueDate: "19 Feb 2026", status: "Overdue" },
  { id: 3, student: "Rahul Verma", class: "11-C", book: "Chemistry Lab Manual", issueDate: "15 Feb 2026", dueDate: "01 Mar 2026", status: "Issued" },
  { id: 4, student: "Sneha Gupta", class: "8-A", book: "Mathematics NCERT", issueDate: "01 Feb 2026", dueDate: "15 Feb 2026", status: "Overdue" },
  { id: 5, student: "Vikram Singh", class: "12-B", book: "Biology Textbook", issueDate: "12 Feb 2026", dueDate: "26 Feb 2026", status: "Returned" },
  { id: 6, student: "Ananya Roy", class: "10-C", book: "Computer Science", issueDate: "18 Feb 2026", dueDate: "04 Mar 2026", status: "Issued" },
];

const statusStyles: Record<string, string> = {
  Issued: "bg-info/10 text-info",
  Returned: "bg-success/10 text-success",
  Overdue: "bg-destructive/10 text-destructive",
};

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

function IssueBookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Issue Book</DialogTitle>
          <DialogDescription>Fill in the details to issue a book to a student or staff member.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Student / Staff Name</label>
              <input type="text" placeholder="Search name..." className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Class / Department</label>
              <input type="text" placeholder="e.g. 10-A" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Book Title</label>
            <input type="text" placeholder="Search book..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">ISBN / Accession No.</label>
              <input type="text" placeholder="e.g. 978-3-16-148410-0" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Issue Date</label>
              <input type="date" defaultValue="2026-02-20" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Due Date</label>
              <input type="date" defaultValue="2026-03-06" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Quantity</label>
              <input type="number" defaultValue={1} min={1} className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
            <textarea rows={2} placeholder="Any notes..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" className="bg-info text-info-foreground hover:bg-info/90">
            <ArrowRight className="mr-1 h-4 w-4" /> Issue Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReturnBookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Return Book</DialogTitle>
          <DialogDescription>Search for the issued book and process the return.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Student / Staff Name</label>
            <input type="text" placeholder="Search name..." className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Book Title / ISBN</label>
            <input type="text" placeholder="Search book or ISBN..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Return Date</label>
              <input type="date" defaultValue="2026-02-20" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Book Condition</label>
              <select className={inputClass}>
                <option>Good</option>
                <option>Fair</option>
                <option>Damaged</option>
                <option>Lost</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Fine Amount (₹)</label>
              <input type="number" defaultValue={0} min={0} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Fine Reason</label>
              <select className={inputClass}>
                <option value="">None</option>
                <option>Late Return</option>
                <option>Damaged Book</option>
                <option>Lost Book</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
            <textarea rows={2} placeholder="Any notes..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="mr-1 h-4 w-4" /> Return Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function IssueReturn() {
  const [tab, setTab] = useState<"all" | "issued" | "returned" | "overdue">("all");
  const [search, setSearch] = useState("");
  const [issueOpen, setIssueOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const filtered = transactions.filter(
    (t) =>
      (tab === "all" || t.status.toLowerCase() === tab) &&
      (t.student.toLowerCase().includes(search.toLowerCase()) || t.book.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Issue / Return</h1>
            <p className="text-sm text-muted-foreground">Manage book issue and return transactions</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-info text-info-foreground hover:bg-info/90" onClick={() => setIssueOpen(true)}>
              <ArrowRight className="mr-2 h-4 w-4" /> Issue Book
            </Button>
            <Button size="sm" variant="outline" onClick={() => setReturnOpen(true)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return Book
            </Button>
          </div>
        </div>

        {/* Modals */}
        <IssueBookModal open={issueOpen} onOpenChange={setIssueOpen} />
        <ReturnBookModal open={returnOpen} onOpenChange={setReturnOpen} />

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student or book..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "issued", "returned", "overdue"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  tab === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Book</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issue Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{t.student}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.class}</td>
                  <td className="px-4 py-3">{t.book}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.issueDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {t.status === "Issued" || t.status === "Overdue" ? (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReturnOpen(true)}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Return
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LibrarianLayout>
  );
}