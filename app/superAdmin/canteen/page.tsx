/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useBranchContext } from "@/context/BranchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Wallet,
  ShoppingCart,
  Clock,
  Plus,
  Search,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const Page = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [stats, setStats] = useState<any[]>([
    {
      label: "Total Items",
      value: 0,
      icon: ShoppingCart,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Low Stock Items",
      value: 0,
      icon: AlertTriangle,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      label: "Available Items",
      value: 0,
      icon: Wallet,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      label: "Issued Items",
      value: 0,
      icon: Clock,
      gradient: "from-emerald-500 to-teal-500",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    branches: branchList,
    selectedBranch,
    selectedBranchId,
  } = useBranchContext();
  const [localBranch, setLocalBranch] = useState("all");
  const isGlobalBranchSelected =
    selectedBranch !== null && selectedBranch !== "all";
  const branchFilter = isGlobalBranchSelected
    ? selectedBranchId
    : localBranch !== "all"
      ? localBranch
      : undefined;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    available: true,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/items", {
        params: {
          type: "CANTEEN",
          perPage: 1000,
          branchId: branchFilter || undefined,
          name: searchTerm || undefined,
        },
      });

      const data = res.data;
      if (data.success) {
        setMenuItems(
          data.data.map((item: any) => ({
            ...item,
            available: item.status === "INSTOCK",
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/items/stats", {
        params: {
          type: "CANTEEN",
          branchId: branchFilter || undefined,
        },
      });
      const data = res.data;
      if (data.success) {
        setStats([
          {
            label: "Total Items",
            value: data.data.totalItems,
            icon: ShoppingCart,
            gradient: "from-amber-500 to-orange-500",
          },
          {
            label: "Low Stock Items",
            value: data.data.lowStockItems,
            icon: AlertTriangle,
            gradient: "from-rose-500 to-pink-500",
          },
          {
            label: "Available Items",
            value: data.data.availableItems,
            icon: Wallet,
            gradient: "from-indigo-500 to-purple-500",
          },
          {
            label: "Issued Items",
            value: data.data.issuedItems,
            icon: Clock,
            gradient: "from-emerald-500 to-teal-500",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axiosInstance.get("/api/v1/items/issue", {
        params: {
          type: "CANTEEN",
          perPage: 100,
          branchId: branchFilter || undefined,
        },
      });
      const data = res.data;
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isGlobalBranchSelected) {
      setLocalBranch("all");
    }
  }, [isGlobalBranchSelected]);

  useEffect(() => {
    fetchItems();
    fetchStats();
    fetchOrders();
  }, [branchFilter, searchTerm]);

  const handleAdd = async () => {
    try {
      const res = await axiosInstance.post("/api/v1/items", {
        branchId: formData.branchId || branchFilter || undefined,
        name: formData.name,
        category: formData.category,
        type: "CANTEEN",
        price: Number(formData.price),
        quantity: Number(formData.quantity || 0),
        status: formData.available ? "INSTOCK" : "OUTOFSTOCK",
      });
      const data = res.data;
      if (data.success) {
        fetchItems();
        fetchStats();
        setIsAddOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axiosInstance.put(`/api/v1/items/${currentItem.id}`, {
        branchId: formData.branchId || branchFilter || undefined,
        name: formData.name,
        category: formData.category,
        type: "CANTEEN",
        price: Number(formData.price),
        quantity: Number(formData.quantity || currentItem.quantity),
        status: formData.available ? "INSTOCK" : "OUTOFSTOCK",
      });
      const data = res.data;
      if (data.success) {
        fetchItems();
        fetchStats();
        setIsEditOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEditClick = (item: any) => {
    setCurrentItem(item);
    setFormData({
      branchId: item.branchId || branchFilter || "",
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      available: item.available,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      branchId: branchFilter || "",
      name: "",
      category: "",
      price: "",
      quantity: "",
      available: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await axiosInstance.delete(`/api/v1/items/${id}`);
      const data = res.data;
      if (data.success) {
        fetchItems();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleToggleAvailable = async (id: string, available: boolean) => {
    try {
      const res = await axiosInstance.put(`/api/v1/items/${id}`, {
        status: available ? "INSTOCK" : "OUTOFSTOCK",
      });
      const data = res.data;
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, available } : i)),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Canteen Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage menu, wallets, orders & parental controls
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-0 shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}
              />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}
                  >
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
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 min-w-[220px]">
                <div className="text-sm text-muted-foreground">Branch</div>
                <Select
                  value={
                    isGlobalBranchSelected
                      ? selectedBranchId || "all"
                      : localBranch
                  }
                  onValueChange={(value) => {
                    if (!isGlobalBranchSelected) setLocalBranch(value);
                  }}
                  disabled={isGlobalBranchSelected}
                >
                  <SelectTrigger className="h-11 rounded-xl border border-border bg-background/50 w-full">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branchList.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isGlobalBranchSelected ? (
                  <p className="text-xs text-muted-foreground">
                    Global branch filter is active.
                  </p>
                ) : null}
              </div>

              <Button
                onClick={() => setIsAddOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    menuItems
                      .filter((i) =>
                        i.name.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            {item.branch?.name || "All Branches"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Switch
                              checked={item.available}
                              onCheckedChange={(checked) =>
                                handleToggleAvailable(item.id, checked)
                              }
                            />
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              onClick={() => handleEditClick(item)}
                              variant="ghost"
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(item.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Menu Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to the canteen menu.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Branch
                      </div>
                      <Select
                        value={formData.branchId || selectedBranchId || "all"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, branchId: value })
                        }
                        disabled={isGlobalBranchSelected}
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-border bg-background/50 w-full">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {branchList.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between">
                      <span>Available</span>
                      <Switch
                        checked={formData.available}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, available: v })
                        }
                      />
                    </div>

                    <Button onClick={handleAdd} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Menu Item</DialogTitle>
                    <DialogDescription>
                      Update the details of the selected menu item.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Branch
                      </div>
                      <Select
                        value={formData.branchId || selectedBranchId || "all"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, branchId: value })
                        }
                        disabled={isGlobalBranchSelected}
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-border bg-background/50 w-full">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {branchList.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between">
                      <span>Available</span>
                      <Switch
                        checked={formData.available}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, available: v })
                        }
                      />
                    </div>

                    <Button onClick={handleEdit} className="w-full">
                      Update Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" /> Today`s Orders
                </CardTitle>
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
                    {loadingOrders ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Loading orders...
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No canteen orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.user?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {order.item?.name || "Canteen item"}
                          </TableCell>
                          <TableCell>₹{order.item?.price ?? 0}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                order.status === "ISSUED"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "RETURNED"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
