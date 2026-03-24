"use client";

import { useState } from "react";

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
  GripVertical,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

const initialMenus: MenuItem[] = [
  { id: "1", label: "Home", url: "/", order: 1 },
  { id: "2", label: "About", url: "/about", order: 2 },
  { id: "3", label: "Admissions", url: "/admissions", order: 3 },
  { id: "4", label: "Contact", url: "/contact", order: 4 },
];

export default function CMSMenus() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    label: "",
    url: "",
  });

  const openNew = () => {
    setEditing(null);
    setForm({ label: "", url: "" });
    setOpen(true);
  };

  const openEdit = (m: MenuItem) => {
    setEditing(m);
    setForm({
      label: m.label,
      url: m.url,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setMenus((prev) =>
        prev.map((m) =>
          m.id === editing.id ? { ...m, ...form } : m
        )
      );
    } else {
      setMenus((prev) => [
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

  const deleteMenu = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Navigation Menus
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage navbar links and routes for the landing page
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* Menu List */}
        <div className="space-y-2">
          {menus.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center gap-4 p-3">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

                <div className="flex-1">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-sm text-muted-foreground ml-3">
                    {m.url}
                  </span>
                </div>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(m)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMenu(m.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={form.label}
                  onChange={(e) =>
                    setForm({ ...form, label: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  URL / Route
                </label>
                <Input
                  value={form.url}
                  onChange={(e) =>
                    setForm({ ...form, url: e.target.value })
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