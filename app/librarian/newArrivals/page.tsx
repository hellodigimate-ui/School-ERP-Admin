/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import LibrarianLayout from "../shell/page";

type Book = {
  id: number; title: string; author: string; isbn: string; category: string;
  copies: number; arrivalDate: string; price: number; supplier: string; shelf: string;
};

const initialBooks: Book[] = [
  { id: 1, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", isbn: "978-0-13-604259-4", category: "Computer Science", copies: 10, arrivalDate: "2026-02-18", price: 850, supplier: "Pearson India", shelf: "E-02" },
  { id: 2, title: "Organic Chemistry", author: "Morrison & Boyd", isbn: "978-93-325-5085-0", category: "Science", copies: 15, arrivalDate: "2026-02-15", price: 520, supplier: "CBS Publishers", shelf: "A-20" },
  { id: 3, title: "Indian Polity", author: "M. Laxmikanth", isbn: "978-93-5260-432-1", category: "Social Studies", copies: 20, arrivalDate: "2026-02-12", price: 450, supplier: "McGraw Hill", shelf: "D-05" },
  { id: 4, title: "Data Structures in C", author: "Yashavant Kanetkar", isbn: "978-93-5213-124-5", category: "Computer Science", copies: 8, arrivalDate: "2026-02-10", price: 380, supplier: "BPB Publications", shelf: "E-04" },
  { id: 5, title: "English Grammar & Composition", author: "Wren & Martin", isbn: "978-81-219-0298-9", category: "Literature", copies: 25, arrivalDate: "2026-02-08", price: 320, supplier: "S. Chand", shelf: "C-12" },
  { id: 6, title: "Economics for Class 12", author: "T.R. Jain", isbn: "978-81-904362-8-6", category: "Commerce", copies: 18, arrivalDate: "2026-02-05", price: 290, supplier: "VK Publications", shelf: "D-08" },
];

const inputClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

function AddBookModal({ open, onOpenChange, book, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  book: Book | null;
  onSave: (b: Omit<Book, "id">) => void;
}) {
  const [form, setForm] = useState({
    title: book?.title || "", author: book?.author || "", isbn: book?.isbn || "",
    category: book?.category || "", copies: book?.copies || 1, arrivalDate: book?.arrivalDate || new Date().toISOString().split("T")[0],
    price: book?.price || 0, supplier: book?.supplier || "", shelf: book?.shelf || "",
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{book ? "Edit Book" : "Add New Arrival"}</DialogTitle>
          <DialogDescription>Enter book details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Book Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Book title" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Author *</label>
              <input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Author name" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">ISBN</label>
              <input value={form.isbn} onChange={e => set("isbn", e.target.value)} placeholder="ISBN" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} placeholder="Category" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Copies</label>
              <input type="number" value={form.copies} onChange={e => set("copies", +e.target.value)} min={1} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => set("price", +e.target.value)} min={0} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Arrival Date</label>
              <input type="date" value={form.arrivalDate} onChange={e => set("arrivalDate", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Supplier</label>
              <input value={form.supplier} onChange={e => set("supplier", e.target.value)} placeholder="Supplier" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Shelf</label>
              <input value={form.shelf} onChange={e => set("shelf", e.target.value)} placeholder="e.g. A-12" className={inputClass} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { if (form.title && form.author) { onSave(form); onOpenChange(false); } }}>
            {book ? "Update" : "Add"} Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ViewBookModal({ open, onOpenChange, book }: { open: boolean; onOpenChange: (v: boolean) => void; book: Book }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display">{book.title}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2 text-sm">
          {[["Author", book.author], ["ISBN", book.isbn], ["Category", book.category], ["Copies", book.copies],
            ["Arrival Date", book.arrivalDate], ["Price", `₹${book.price}`], ["Supplier", book.supplier], ["Shelf", book.shelf]
          ].map(([k, v]) => (
            <div key={k as string} className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
        <DialogFooter><DialogClose asChild><Button variant="outline" size="sm">Close</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function NewArrivals() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [viewBook, setViewBook] = useState<Book | null>(null);

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (data: Omit<Book, "id">) => {
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === editBook.id ? { ...b, ...data } : b));
    } else {
      setBooks(prev => [{ ...data, id: Date.now() }, ...prev]);
    }
    setEditBook(null);
  };

  const handleDelete = (id: number) => setBooks(prev => prev.filter(b => b.id !== id));

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">New Arrivals</h1>
            <p className="text-sm text-muted-foreground">Recently added books to the library</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditBook(null); setAddOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author..." className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> <span>This Month: <strong className="text-foreground">{books.length} books</strong></span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["#", "Title", "Author", "ISBN", "Category", "Copies", "Price", "Arrival", "Shelf", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.author}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{b.isbn}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{b.category}</span></td>
                  <td className="px-4 py-3 text-center">{b.copies}</td>
                  <td className="px-4 py-3">₹{b.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.arrivalDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.shelf}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewBook(b)} className="rounded p-1 text-muted-foreground hover:text-info hover:bg-info/10 transition-colors"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => { setEditBook(b); setAddOpen(true); }} className="rounded p-1 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(b.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddBookModal open={addOpen} onOpenChange={v => { setAddOpen(v); if (!v) setEditBook(null); }} book={editBook} onSave={handleSave} />
        {viewBook && <ViewBookModal open={!!viewBook} onOpenChange={() => setViewBook(null)} book={viewBook} />}
      </div>
    </LibrarianLayout>
  );
}