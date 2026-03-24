"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Image as ImageIcon,
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
}

const initialBanners: Banner[] = [
  { id: "1", title: "Welcome Banner", imageUrl: "", linkUrl: "/", order: 1 },
  { id: "2", title: "Admissions Open", imageUrl: "", linkUrl: "/admissions", order: 2 },
];

export default function CMSBanners() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", imageUrl: "", linkUrl: "" });
    setOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editing.id ? { ...b, ...form } : b
        )
      );
    } else {
      setBanners((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...form,
          order: prev.length + 1,
        },
      ]);
    }

    setOpen(false);
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Banner Images
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage landing page banners and hero images
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banner Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              <div className="h-40 relative bg-muted">
                {b.imageUrl ? (
                  <Image
                    src={b.imageUrl}
                    alt={b.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Link: {b.linkUrl}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(b)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBanner(b.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Banner" : "Add Banner"}
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
                <label className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Link URL
                </label>
                <Input
                  value={form.linkUrl}
                  onChange={(e) =>
                    setForm({ ...form, linkUrl: e.target.value })
                  }
                  placeholder="/page"
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