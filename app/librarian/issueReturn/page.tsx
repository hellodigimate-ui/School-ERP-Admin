"use client"


import { useState } from "react";
import { Search, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="sm:max-w-lg p-0 rounded-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r rounded-xl from-blue-500 via-indigo-500 to-purple-500 p-5 text-white">
          <DialogTitle className="font-display text-lg">
            Issue Book
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm">
            Fill in the details to issue a book
          </DialogDescription>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">

          {/* Student Info */}
          <div className="bg-muted/40 p-4 rounded-xl border space-y-4">
            <h4 className="text-sm font-semibold">Student / Staff Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Student / Staff Name
                </label>
                <input
                  type="text"
                  placeholder="Search name..."
                  className={`${inputClass} focus:ring-2 focus:ring-blue-500/30`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Class / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10-A"
                  className={`${inputClass} focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="bg-muted/40 p-4 rounded-xl border space-y-4">
            <h4 className="text-sm font-semibold">Book Details</h4>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Book Title
              </label>
              <input
                type="text"
                placeholder="Search book..."
                className={`${inputClass} focus:ring-2 focus:ring-purple-500/30`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  ISBN / Accession No.
                </label>
                <input
                  type="text"
                  placeholder="978-3-16-148410-0"
                  className={`${inputClass} focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Quantity
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  className={`${inputClass} focus:ring-2 focus:ring-blue-500/30`}
                />
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div className="bg-muted/40 p-4 rounded-xl border space-y-4">
            <h4 className="text-sm font-semibold">Issue Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Issue Date
                </label>
                <input
                  type="date"
                  defaultValue="2026-02-20"
                  className={`${inputClass} focus:ring-2 focus:ring-blue-500/30`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Due Date
                </label>
                <input
                  type="date"
                  defaultValue="2026-03-06"
                  className={`${inputClass} focus:ring-2 focus:ring-purple-500/30`}
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Any notes..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t bg-muted/30">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-md"
          >
            <ArrowRight className="mr-1 h-4 w-4" />
            Issue Book
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

function ReturnBookModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 rounded-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r rounded-xl from-indigo-500 via-purple-500 to-pink-500 p-5 text-white">
          <DialogTitle className="font-display text-lg">
            Return Book
          </DialogTitle>
          <DialogDescription className="text-white/90 text-sm">
            Search issued book and process return
          </DialogDescription>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* Student */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Student / Staff Name
            </label>
            <input
              type="text"
              placeholder="Search name..."
              className={`${inputClass} focus:ring-2 focus:ring-indigo-500/30`}
            />
          </div>

          {/* Book */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Book Title / ISBN
            </label>
            <input
              type="text"
              placeholder="Search book or ISBN..."
              className={`${inputClass} focus:ring-2 focus:ring-purple-500/30`}
            />
          </div>

          {/* Date + Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Return Date
              </label>
              <input
                type="date"
                defaultValue="2026-02-20"
                className={`${inputClass} focus:ring-2 focus:ring-pink-500/30`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Book Condition
              </label>
              <select
                className={`${inputClass} focus:ring-2 focus:ring-indigo-500/30`}
              >
                <option>Good</option>
                <option>Fair</option>
                <option>Damaged</option>
                <option>Lost</option>
              </select>
            </div>
          </div>

          {/* Fine Section */}
          <div className="bg-muted/40 p-4 rounded-xl space-y-4 border">
            <h4 className="text-sm font-semibold text-foreground">
              Fine Details
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Fine Amount (₹)
                </label>
                <input
                  type="number"
                  defaultValue={0}
                  min={0}
                  className={`${inputClass} focus:ring-2 focus:ring-red-500/30`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Fine Reason
                </label>
                <select
                  className={`${inputClass} focus:ring-2 focus:ring-orange-500/30`}
                >
                  <option value="">None</option>
                  <option>Late Return</option>
                  <option>Damaged Book</option>
                  <option>Lost Book</option>
                </select>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Any notes..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t bg-muted/30">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>

          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-md"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Return Book
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

        {/* Header */}
        <div className="flex items-center justify-between p-5 rounded-2xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
          <div>
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Issue / Return
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage book issue and return transactions
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:opacity-90"
              onClick={() => setIssueOpen(true)}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Issue Book
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              onClick={() => setReturnOpen(true)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Book
            </Button>
          </div>
        </div>

        {/* Modals */}
        <IssueBookModal open={issueOpen} onOpenChange={setIssueOpen} />
        <ReturnBookModal open={returnOpen} onOpenChange={setReturnOpen} />

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 items-center bg-card p-4 rounded-2xl border shadow-sm">

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student or book..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
            />
          </div>

          {/* Filter */}
          <div className="w-44">
            <select
              value={tab}
              onChange={(e) =>
                setTab(e.target.value as "all" | "issued" | "returned" | "overdue")
              }
              className="block w-full rounded-xl border border-input bg-background text-sm px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500/30 transition"
            >
              <option value="all">All Transactions</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Class</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Book</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Issue Date</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-all"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {i + 1}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {t.student}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {t.class}
                  </td>

                  <td className="px-4 py-3">
                    {t.book}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {t.issueDate}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {t.dueDate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium shadow-sm ${statusStyles[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {t.status === "Issued" || t.status === "Overdue" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => setReturnOpen(true)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Return
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        —
                      </span>
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