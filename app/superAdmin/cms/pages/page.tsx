"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  Eye,
  GripVertical,
} from "lucide-react";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
}

const initialPages: CMSPage[] = [
  { id: "1", title: "Home", slug: "/", content: "Landing page content", status: "published" },
  { id: "2", title: "About Us", slug: "/about", content: "About the school", status: "published" },
  { id: "3", title: "Contact", slug: "/contact", content: "Contact information", status: "published" },
  { id: "4", title: "Admissions", slug: "/admissions", content: "Admissions process", status: "draft" },
];

export default function CMSPages() {
  const [pages, setPages] = useState<CMSPage[]>(initialPages);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft" as "published" | "draft",
  });

  const openNew = () => {
    setEditingPage(null);
    setForm({ title: "", slug: "", content: "", status: "draft" });
    setIsDialogOpen(true);
  };

  const openEdit = (page: CMSPage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
    });
    setIsDialogOpen(true);
  };

  const save = () => {
    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id ? { ...p, ...form } : p
        )
      );
    } else {
      setPages((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
    }

    setIsDialogOpen(false);
  };

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">CMS Pages</h1>
            <p className="text-sm text-muted-foreground">
              Manage your website pages, routes and content
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </div>

        {/* Pages List */}
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {page.slug}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    page.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {page.status}
                </span>

                <div className="flex gap-2">
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(page)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Preview (Next.js routing) */}
                  <Link href={page.slug || "/"}>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePage(page.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? "Edit Page" : "Create New Page"}
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
                <label className="text-sm font-medium">Slug / Route</label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="/page-url"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={6}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button onClick={save}>
                  {editingPage ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}