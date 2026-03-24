"use client"


import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Veg Thali", category: "Meals", price: 80, emoji: "🍱" },
  { id: "2", name: "Paneer Sandwich", category: "Snacks", price: 45, emoji: "🥪" },
  { id: "3", name: "Masala Dosa", category: "Meals", price: 60, emoji: "🫓" },
  { id: "4", name: "Samosa", category: "Snacks", price: 20, emoji: "🥟" },
  { id: "5", name: "Tea", category: "Beverages", price: 15, emoji: "🍵" },
  { id: "6", name: "Coffee", category: "Beverages", price: 20, emoji: "☕" },
  { id: "7", name: "Pav Bhaji", category: "Meals", price: 55, emoji: "🍲" },
  { id: "8", name: "Fruit Salad", category: "Snacks", price: 40, emoji: "🥗" },
  { id: "9", name: "Gulab Jamun", category: "Desserts", price: 30, emoji: "🍩" },
  { id: "10", name: "Juice", category: "Beverages", price: 35, emoji: "🧃" },
  { id: "11", name: "Rice Bowl", category: "Meals", price: 85, emoji: "🍚" },
  { id: "12", name: "Cookie", category: "Desserts", price: 15, emoji: "🍪" },
];

const Billing = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredMenu = menuItems.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Add items to cart first", variant: "destructive" });
      return;
    }
    if (!paymentMethod) {
      toast({ title: "Select Payment", description: "Choose a payment method", variant: "destructive" });
      return;
    }
    toast({
      title: "Order Placed! ✅",
      description: `₹${total} charged via ${paymentMethod}${studentId ? ` for ${studentId}` : ""}`,
    });
    setCart([]);
    setPaymentMethod(null);
    setStudentId("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu..." className="pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredMenu.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className={`relative p-4 rounded-xl border transition-all duration-200 text-left hover:shadow-md ${
                  inCart ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {inCart && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 rounded-full text-xs">
                    {inCart.qty}
                  </Badge>
                )}
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <p className="font-bold text-primary mt-1">₹{item.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart */}
      <div className="space-y-4">
        <Card className="sticky top-0">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Current Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student ID */}
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Student ID (optional)"
              className="text-sm"
            />

            {/* Cart Items */}
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No items in cart</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            {cart.length > 0 && (
              <>
                <div className="border-t border-border pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "cash", label: "Cash", icon: Banknote },
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "wallet", label: "Wallet", icon: Smartphone },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs transition-all ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <method.icon className="h-4 w-4" />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full gap-2 font-heading font-semibold">
                  <ShoppingCart className="h-4 w-4" /> Checkout — ₹{total}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
