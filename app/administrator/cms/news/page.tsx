"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  status: "published" | "draft";
}

export default function CMSNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
    status: "draft" as "published" | "draft",
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      title: "",
      date: "",
      content: "",
      status: "draft",
    });
    setOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setEditing(n);
    setForm({
      title: n.title,
      date: n.date,
      content: n.content,
      status: n.status,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === editing.id ? { ...n, ...form } : n
        )
      );
    } else {
      setNews((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
    }

    setOpen(false);
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">News</h1>
            <p className="text-sm text-muted-foreground">
              Manage school news articles
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button>
        </div>

        {/* Empty State */}
        {news.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <Newspaper className="w-12 h-12 mx-auto mb-3" />
            <p>No news articles yet.</p>
          </div>
        ) : (
          /* News List */
          <div className="grid gap-3">
            {news.map((n) => (
              <Card key={n.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {n.date}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      n.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {n.status}
                  </span>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(n)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNews(n.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit News" : "Add News"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button onClick={save}>
                  {editing ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}