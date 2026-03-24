"use client"

import { useState } from "react";
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
}

const initialItems: FoodItem[] = [
  { id: "1", name: "Veg Thali", category: "Meals", price: 80, available: true, image: "🍱" },
  { id: "2", name: "Paneer Sandwich", category: "Snacks", price: 45, available: true, image: "🥪" },
  { id: "3", name: "Masala Dosa", category: "Meals", price: 60, available: true, image: "🫓" },
  { id: "4", name: "Samosa", category: "Snacks", price: 20, available: true, image: "🥟" },
  { id: "5", name: "Mango Lassi", category: "Beverages", price: 35, available: false, image: "🥤" },
  { id: "6", name: "Gulab Jamun", category: "Desserts", price: 30, available: true, image: "🍩" },
  { id: "7", name: "Tea", category: "Beverages", price: 15, available: true, image: "🍵" },
  { id: "8", name: "Pav Bhaji", category: "Meals", price: 55, available: true, image: "🍲" },
  { id: "9", name: "Fruit Salad", category: "Snacks", price: 40, available: true, image: "🥗" },
  { id: "10", name: "Coffee", category: "Beverages", price: 20, available: true, image: "☕" },
];

const categories = ["All", "Meals", "Snacks", "Beverages", "Desserts"];

const ItemManagement = () => {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Meals", price: "" });
  const { toast } = useToast();

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (editItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, name: formData.name, category: formData.category, price: Number(formData.price) } : item
        )
      );
      toast({ title: "Updated", description: `${formData.name} updated successfully` });
    } else {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        available: true,
        image: "🍽️",
      };
      setItems((prev) => [...prev, newItem]);
      toast({ title: "Added", description: `${formData.name} added successfully` });
    }
    setDialogOpen(false);
    setEditItem(null);
    setFormData({ name: "", category: "Meals", price: "" });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Item removed successfully" });
  };

  const openEdit = (item: FoodItem) => {
    setEditItem(item);
    setFormData({ name: item.name, category: item.category, price: item.price.toString() });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold">Menu Items</h3>
          <p className="text-sm text-muted-foreground">{items.length} items · {items.filter((i) => i.available).length} available</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditItem(null); setFormData({ name: "", category: "Meals", price: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">{editItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Veg Biryani" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} placeholder="0" />
              </div>
              <Button onClick={handleSave} className="w-full">{editItem ? "Update Item" : "Add Item"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className={`transition-all duration-200 hover:shadow-md ${!item.available ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{item.image}</div>
                <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <h4 className="font-heading font-semibold mt-3">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.category}</p>
              <p className="text-lg font-bold mt-1 text-primary">₹{item.price}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleAvailability(item.id)}>
                  {item.available ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemManagement;
