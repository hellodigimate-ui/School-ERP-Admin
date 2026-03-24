"use client"


import { useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
}

const initialStock: StockItem[] = [
  { id: "1", name: "Rice", category: "Grains", quantity: 50, unit: "kg", minThreshold: 10, lastUpdated: "2026-02-28" },
  { id: "2", name: "Cooking Oil", category: "Oils", quantity: 8, unit: "liters", minThreshold: 5, lastUpdated: "2026-02-27" },
  { id: "3", name: "Bread", category: "Bakery", quantity: 30, unit: "packs", minThreshold: 10, lastUpdated: "2026-02-28" },
  { id: "4", name: "Milk", category: "Dairy", quantity: 20, unit: "liters", minThreshold: 15, lastUpdated: "2026-02-28" },
  { id: "5", name: "Sugar", category: "Grains", quantity: 4, unit: "kg", minThreshold: 5, lastUpdated: "2026-02-26" },
  { id: "6", name: "Tea Powder", category: "Beverages", quantity: 3, unit: "kg", minThreshold: 2, lastUpdated: "2026-02-27" },
  { id: "7", name: "Potatoes", category: "Vegetables", quantity: 25, unit: "kg", minThreshold: 10, lastUpdated: "2026-02-28" },
  { id: "8", name: "Onions", category: "Vegetables", quantity: 15, unit: "kg", minThreshold: 8, lastUpdated: "2026-02-28" },
];

const StockManagement = () => {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adjustDialog, setAdjustDialog] = useState<StockItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustType, setAdjustType] = useState<"add" | "remove">("add");
  const [newItem, setNewItem] = useState({ name: "", category: "Grains", unit: "kg", quantity: "", minThreshold: "" });
  const { toast } = useToast();

  const lowStock = stock.filter((s) => s.quantity <= s.minThreshold);
  const filtered = stock.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddStock = () => {
    if (!newItem.name || !newItem.quantity) return;
    setStock((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        minThreshold: Number(newItem.minThreshold) || 5,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    ]);
    setDialogOpen(false);
    setNewItem({ name: "", category: "Grains", unit: "kg", quantity: "", minThreshold: "" });
    toast({ title: "Stock Added", description: `${newItem.name} added to inventory` });
  };

  const handleAdjust = () => {
    if (!adjustDialog || !adjustQty) return;
    const qty = Number(adjustQty);
    setStock((prev) =>
      prev.map((s) =>
        s.id === adjustDialog.id
          ? { ...s, quantity: adjustType === "add" ? s.quantity + qty : Math.max(0, s.quantity - qty), lastUpdated: new Date().toISOString().split("T")[0] }
          : s
      )
    );
    toast({ title: "Stock Updated", description: `${adjustDialog.name}: ${adjustType === "add" ? "+" : "-"}${qty} ${adjustDialog.unit}` });
    setAdjustDialog(null);
    setAdjustQty("");
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-sm">Low Stock Alert</p>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStock.map((s) => s.name).join(", ")} — running below minimum threshold.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold">Inventory Stock</h3>
          <p className="text-sm text-muted-foreground">{stock.length} items tracked · {lowStock.length} low stock</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Stock Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Add Stock Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Flour" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newItem.category} onValueChange={(v) => setNewItem((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Grains", "Oils", "Dairy", "Vegetables", "Bakery", "Beverages", "Spices", "Other"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={newItem.unit} onValueChange={(v) => setNewItem((p) => ({ ...p, unit: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["kg", "liters", "packs", "pieces", "dozen"].map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" value={newItem.quantity} onChange={(e) => setNewItem((p) => ({ ...p, quantity: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Min Threshold</Label>
                  <Input type="number" value={newItem.minThreshold} onChange={(e) => setNewItem((p) => ({ ...p, minThreshold: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleAddStock} className="w-full">Add to Inventory</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stock..." className="pl-9" />
      </div>

      {/* Stock Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Min Threshold</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-3 px-4 font-semibold">{item.quantity} {item.unit}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.minThreshold} {item.unit}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.quantity <= item.minThreshold ? "destructive" : "default"} className="text-xs">
                        {item.quantity <= item.minThreshold ? "Low" : "OK"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.lastUpdated}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => { setAdjustDialog(item); setAdjustType("add"); }}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setAdjustDialog(item); setAdjustType("remove"); }}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Dialog */}
      <Dialog open={!!adjustDialog} onOpenChange={(open) => { if (!open) setAdjustDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{adjustType === "add" ? "Add" : "Remove"} Stock — {adjustDialog?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Current: {adjustDialog?.quantity} {adjustDialog?.unit}</p>
            <div className="space-y-2">
              <Label>Quantity to {adjustType}</Label>
              <Input type="number" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="0" />
            </div>
            <Button onClick={handleAdjust} className="w-full" variant={adjustType === "add" ? "default" : "destructive"}>
              {adjustType === "add" ? "Add Stock" : "Remove Stock"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockManagement;
