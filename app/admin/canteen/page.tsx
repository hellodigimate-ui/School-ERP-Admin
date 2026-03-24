/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Wallet, ShoppingCart, Clock, Plus, Search, IndianRupee, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const orders = [
  { id: "ORD001", student: "Rahul Sharma", items: "Veg Thali, Cold Coffee", total: 85, status: "Delivered", time: "12:30 PM" },
  { id: "ORD002", student: "Priya Patel", items: "Masala Dosa", total: 40, status: "Preparing", time: "12:45 PM" },
  { id: "ORD003", student: "Amit Kumar", items: "Sandwich, Samosa", total: 45, status: "Ready", time: "12:50 PM" },
];



const Page = () => {

  const [menuItems, setMenuItems] = useState([
  { id: 1, name: "Burger", category: "Fast Food", price: 120, available: true, popular: true },
  { id: 2, name: "Pizza", category: "Fast Food", price: 250, available: true, popular: false },
]);

const [searchTerm, setSearchTerm] = useState("");

const [isAddOpen, setIsAddOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);

const [currentItem, setCurrentItem] = useState<any>(null);

const [formData, setFormData] = useState({
  name: "",
  category: "",
  price: "",
  available: true,
  popular: false,
});


const handleAdd = () => {
  const newItem = {
    id: Date.now(),
    ...formData,
    price: Number(formData.price),
  };

  setMenuItems((prev) => [...prev, newItem]);
  setIsAddOpen(false);
  resetForm();
};

const handleEdit = () => {
  setMenuItems((prev) =>
    prev.map((item) =>
      item.id === currentItem.id ? { ...currentItem, ...formData, price: Number(formData.price) } : item
    )
  );

  setIsEditOpen(false);
  resetForm();
};

const handleEditClick = (item: any) => {
  setCurrentItem(item);
  setFormData(item);
  setIsEditOpen(true);
};

const resetForm = () => {
  setFormData({
    name: "",
    category: "",
    price: "",
    available: true,
    popular: false,
  });
};

  const stats = [
    { label: "Today's Orders", value: "156", icon: ShoppingCart, gradient: "from-amber-500 to-orange-500" },
    { label: "Revenue Today", value: "₹8,450", icon: IndianRupee, gradient: "from-emerald-500 to-teal-500" },
    { label: "Active Wallets", value: "1,234", icon: Wallet, gradient: "from-indigo-500 to-purple-500" },
    { label: "Low Balance Alerts", value: "23", icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Canteen Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage menu, wallets, orders & parental controls</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden border-0 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}>
                    <stat.icon className="h-5 w-5" />
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        <Tabs defaultValue="menu" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search menu..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Button onClick={() => setIsAddOpen(true)}  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                </div>
                <Card>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Popular</TableHead>
                        <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{item.category}</Badge>
                            </TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell><Switch checked={item.available} /></TableCell>
                            <TableCell>{item.popular && <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">Popular</Badge>}</TableCell>
                            <TableCell>
                            <Button onClick={() => handleEditClick(item)} variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Menu Item</DialogTitle>
    </DialogHeader>

    <div className="space-y-3">
      <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
      <Input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

      <div className="flex justify-between">
        <span>Available</span>
        <Switch checked={formData.available} onCheckedChange={(v) => setFormData({ ...formData, available: v })} />
      </div>

      <div className="flex justify-between">
        <span>Popular</span>
        <Switch checked={formData.popular} onCheckedChange={(v) => setFormData({ ...formData, popular: v })} />
      </div>

      <Button onClick={handleAdd} className="w-full">Add Item</Button>
    </div>
  </DialogContent>
</Dialog>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

                        <div className="flex justify-between">
                            <span>Available</span>
                            <Switch checked={formData.available} onCheckedChange={(v) => setFormData({ ...formData, available: v })} />
                        </div>

                        <div className="flex justify-between">
                            <span>Popular</span>
                            <Switch checked={formData.popular} onCheckedChange={(v) => setFormData({ ...formData, popular: v })} />
                        </div>

                        <Button onClick={handleEdit} className="w-full">Update Item</Button>
                        </div>
                    </DialogContent>
                    </Dialog>
                </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /> Today`s Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">{order.id}</TableCell>
                            <TableCell className="font-medium">{order.student}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>₹{order.total}</TableCell>
                            <TableCell>
                                <Badge className={
                                order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                                order.status === "Ready" ? "bg-blue-100 text-blue-700" :
                                "bg-amber-100 text-amber-700"
                                }>{order.status}</Badge>
                            </TableCell>
                            <TableCell>{order.time}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;