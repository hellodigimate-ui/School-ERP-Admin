"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Image } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export default function CMSGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", imageUrl: "", category: "" });

  const save = () => {
    setItems([...items, { id: Date.now().toString(), ...form }]);
    setOpen(false);
    setForm({ title: "", imageUrl: "", category: "" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Gallery</h1>
            <p className="text-sm text-muted-foreground">Manage school gallery images</p>
          </div>
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
        </div>

        {items.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3" />
            <p>No gallery images yet. Add your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden bg-muted aspect-square">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-muted-foreground" /></div>
                )}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-background">{item.title}</p>
                    <p className="text-xs text-background/70">{item.category}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-background" onClick={() => setItems(items.filter((x) => x.id !== item.id))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Image URL</label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Category</label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={save}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}
