"use client"


import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import LibrarianLayout from "../shell/page";

const booksData = [
  { id: 1, title: "Physics Vol. 2", author: "H.C. Verma", isbn: "978-81-7709-147-2", category: "Science", copies: 25, available: 18, shelf: "A-12" },
  { id: 2, title: "Mathematics NCERT Class 10", author: "NCERT", isbn: "978-81-7450-636-0", category: "Mathematics", copies: 40, available: 12, shelf: "B-03" },
  { id: 3, title: "English Literature", author: "R.K. Narayan", isbn: "978-0-14-018546-0", category: "Literature", copies: 30, available: 22, shelf: "C-07" },
  { id: 4, title: "Chemistry Lab Manual", author: "S.K. Jain", isbn: "978-81-7709-234-9", category: "Science", copies: 20, available: 5, shelf: "A-15" },
  { id: 5, title: "Biology Textbook", author: "Trueman", isbn: "978-81-8746-012-3", category: "Science", copies: 35, available: 28, shelf: "A-18" },
  { id: 6, title: "History of Modern India", author: "Bipan Chandra", isbn: "978-93-5260-011-8", category: "History", copies: 15, available: 10, shelf: "D-02" },
  { id: 7, title: "Computer Science with Python", author: "Sumita Arora", isbn: "978-93-5260-543-4", category: "Computer", copies: 20, available: 14, shelf: "E-01" },
  { id: 8, title: "Hindi Sahitya", author: "Premchand", isbn: "978-81-2670-123-0", category: "Literature", copies: 18, available: 15, shelf: "C-10" },
];

export default function BookList() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(booksData.map((b) => b.category))];
  const filtered = booksData.filter(
    (b) =>
      (categoryFilter === "All" || b.category === categoryFilter) &&
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.includes(search))
  );

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Book List</h1>
            <p className="text-sm text-muted-foreground">Manage your library book inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Author</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ISBN</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Copies</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Available</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shelf</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, i) => (
                  <tr key={book.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{book.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{book.isbn}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{book.copies}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={book.available < 10 ? "text-destructive font-medium" : "text-success font-medium"}>
                        {book.available}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{book.shelf}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="rounded p-1 text-muted-foreground hover:text-info hover:bg-info/10 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}