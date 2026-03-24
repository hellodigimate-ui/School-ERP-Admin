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
  Calendar,
} from "lucide-react";

interface CMSEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function CMSEvents() {
  const [events, setEvents] = useState<CMSEvent[]>([]);
  const [editing, setEditing] = useState<CMSEvent | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", date: "", description: "" });
    setOpen(true);
  };

  const openEdit = (event: CMSEvent) => {
    setEditing(event);
    setForm({
      title: event.title,
      date: event.date,
      description: event.description,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editing.id ? { ...e, ...form } : e
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
    }

    setOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Events</h1>
            <p className="text-sm text-muted-foreground">
              Manage school events displayed on the website
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3" />
            <p>No events yet. Create your first event.</p>
          </div>
        ) : (
          /* Events List */
          <div className="grid gap-3">
            {events.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {e.date}
                    </p>
                  </div>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(e)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEvent(e.id)}
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
                {editing ? "Edit Event" : "Add Event"}
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
                <label className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
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