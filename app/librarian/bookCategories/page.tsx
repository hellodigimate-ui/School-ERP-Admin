/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { useState } from "react";
import { Search, Plus, Edit, Trash2, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import LibrarianLayout from "../shell/page";

type Category = {
  id: number;
  name: string;
  code: string;
  description: string;
  bookCount: number;
  shelfLocation: string;
  status: "Active" | "Inactive";
};

const initialCategories: Category[] = [
  { id: 1, name: "Science", code: "SCI", description: "Physics, Chemistry, Biology textbooks", bookCount: 1240, shelfLocation: "A-Block", status: "Active" },
  { id: 2, name: "Mathematics", code: "MAT", description: "Algebra, Geometry, Calculus", bookCount: 980, shelfLocation: "B-Block", status: "Active" },
  { id: 3, name: "Literature", code: "LIT", description: "English and Hindi literature", bookCount: 760, shelfLocation: "C-Block", status: "Active" },
  { id: 4, name: "History", code: "HIS", description: "Ancient, Medieval, Modern History", bookCount: 540, shelfLocation: "D-Block", status: "Active" },
  { id: 5, name: "Computer Science", code: "CS", description: "Programming, Networks, Databases", bookCount: 420, shelfLocation: "E-Block", status: "Active" },
  { id: 6, name: "Reference", code: "REF", description: "Encyclopedias, Dictionaries", bookCount: 350, shelfLocation: "F-Block", status: "Active" },
  { id: 7, name: "Periodicals", code: "PER", description: "Magazines, Journals, Newspapers", bookCount: 280, shelfLocation: "G-Block", status: "Inactive" },
  { id: 8, name: "Fiction", code: "FIC", description: "Novels, Short stories", bookCount: 620, shelfLocation: "C-Block", status: "Active" },
];

const inputClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

function CategoryModal({ open, onOpenChange, category, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  category: Category | null;
  onSave: (c: Omit<Category, "id" | "bookCount">) => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [code, setCode] = useState(category?.code || "");
  const [description, setDescription] = useState(category?.description || "");
  const [shelfLocation, setShelfLocation] = useState(category?.shelfLocation || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(category?.status || "Active");

  const handleSave = () => {
    if (!name || !code) return;
    onSave({ name, code, description, shelfLocation, status });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{category ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>Fill in the category details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Science" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Code *</label>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SCI" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Category description..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Shelf Location</label>
              <input value={shelfLocation} onChange={e => setShelfLocation(e.target.value)} placeholder="e.g. A-Block" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className={inputClass}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave}>
            {category ? "Update" : "Add"} Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteModal({ open, onOpenChange, name, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; name: string; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-destructive">Delete Category</DialogTitle>
          <DialogDescription>Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
          <Button size="sm" variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BookCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Category, "id" | "bookCount">) => {
    if (editCat) {
      setCategories(prev => prev.map(c => c.id === editCat.id ? { ...c, ...data } : c));
    } else {
      setCategories(prev => [...prev, { ...data, id: Date.now(), bookCount: 0 }]);
    }
    setEditCat(null);
  };

  const handleDelete = () => {
    if (deleteCat) setCategories(prev => prev.filter(c => c.id !== deleteCat.id));
    setDeleteCat(null);
  };

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Book Categories</h1>
            <p className="text-sm text-muted-foreground">Organize your library collection by categories</p>
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditCat(null); setModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-accent">{categories.length}</p><p className="text-sm text-muted-foreground">Total Categories</p></div>
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-success">{categories.filter(c => c.status === "Active").length}</p><p className="text-sm text-muted-foreground">Active</p></div>
          <div className="stat-card stat-card-gradient"><p className="text-2xl font-bold font-display text-info">{categories.reduce((s, c) => s + c.bookCount, 0).toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Books</p></div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Books</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shelf</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium flex items-center gap-2"><BookMarked className="h-4 w-4 text-accent" />{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{c.description}</td>
                  <td className="px-4 py-3 text-center font-medium">{c.bookCount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.shelfLocation}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditCat(c); setModalOpen(true); }} className="rounded p-1 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteCat(c)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CategoryModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditCat(null); }} category={editCat} onSave={handleSave} />
        {deleteCat && <DeleteModal open={!!deleteCat} onOpenChange={() => setDeleteCat(null)} name={deleteCat.name} onConfirm={handleDelete} />}
      </div>
    </LibrarianLayout>
  );
}