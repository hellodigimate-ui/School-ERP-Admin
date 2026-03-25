/* eslint-disable react-hooks/set-state-in-effect */
"use client"


import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Warehouse, ArrowRightLeft, AlertTriangle, Trash2, Edit, ChevronsUpDown, Check, BookMarked } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface User {
  id: string
  name: string
  email: string
}

interface IssuedItem {
  id: string
  user: User
  item: Item
  type: string
  createdAt: string
  returnDate: string
  dueDate: string
  status: "ISSUED" | "RETURNED" | "OVERDUE"
  fine?: number
}

type Item = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  status: string;
  type: string;
  store: string;
  price: number;
};

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([])
  const [selectedIssue, setSelectedIssue] = useState<IssuedItem | null>(null)
  const [returnOpen, setReturnOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [itemSearchTerm, setItemSearchTerm] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [currentItem, setCurrentItem] = useState({
    id: 0,
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    type: "OTHER",
    status:"",
    store: "",
    price: 0,
    minStock:0,
  });
  const [newItem, setNewItem] = useState({
    id: 0,
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    type: "OTHER",
    status:"",
    store: "",
    price: 0,
    minStock: 0
  });
  const [returnForm, setReturnForm] = useState({
    status: "",
    returnDate: "",
    fine: 0
  })

  const [stats, setStats] = useState([
    { label: "Total Items", value: "0", icon: Package, gradient: "from-indigo-500 to-blue-500" },
    { label: "Out of Stocks Items", value: "0", icon: Warehouse, gradient: "from-emerald-500 to-teal-500" },
    { label: "Items Issued", value: "0", icon: ArrowRightLeft, gradient: "from-amber-500 to-orange-500" },
    { label: "Low Stocks Items", value: "0", icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
  ]);

  const [issueForm, setIssueForm] = useState({
    userId: "",
    itemId: "",
    createdAt: new Date().toISOString().slice(0,10),
    returnDate: "",
    type: "",
    dueDate: "",
  })

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)


// Fetch Stats
const fetchStats = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/items/stats");
    const data = res.data;
    if (data.success) {
      setStats([
        { label: "Total Items", value: data.data.totalItems, icon: Package, gradient: "from-indigo-500 to-blue-500" },
        { label: "Out of Stock Items", value: data.data.outOfStockItems, icon: Warehouse, gradient: "from-emerald-500 to-teal-500" },
        { label: "Items Issued", value: data.data.issuedItems, icon: ArrowRightLeft, gradient: "from-amber-500 to-orange-500" },
        { label: "Low Stock Items", value: data.data.lowStockItems, icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
      ]);
    }
  } catch (error) {
    console.error("Failed to fetch stats", error);
  }
};

useEffect(() => {
  fetchStats();
}, []);


// Fetch Items
useEffect(() => {
  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/items",{
              params: {
              type: "OTHER",
              name: searchTerm,
            },
      });
      const data = res.data;
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };
  fetchItems();
}, [searchTerm, category]);


const openEditModal = (item) => {
  setCurrentItem(item);
  setIsEditOpen(true);
};

// Save Edited Item
const handleSave = async () => {
  try {
    const res = await axiosInstance.put(`/api/v1/items/${currentItem.id}`, currentItem);
    const data = res.data;
    if (data.success) {
      setItems(items.map(i => i.id === currentItem.id ? data.data : i));
      setIsEditOpen(false);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};


// Delete Item
const handleDelete = async (itemId: number) => {
  try {
    const res = await axiosInstance.delete(`/api/v1/items/${itemId}`);
    const data = res.data;
    if (data.success) {
      setItems(items.filter(i => i.id !== itemId));
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

// Add New Item 
const handleAddItem = async () => {
  try {
    const res = await axiosInstance.post("/api/v1/items", {
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity,
      unit: newItem.unit,
      type: "OTHER",
      store: newItem.store,
      price: newItem.price,
      minStock: newItem.minStock
    });

    const data = res.data;
    if (data.success) {
      setItems([...items, data.data]);
      setNewItem({
        id: 0,
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        type: "OTHER",
        status: "",
        store: "",
        price: 0,
        minStock: 0
      });
      setIsAddOpen(false);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users")

      if (res.data.success) {
        setUsers(res.data.data)
      }

    } catch (error) {
      console.error("Failed to fetch users", error)
    }
  }

  fetchUsers()
}, [])

const fetchIssuedItems = async () => {
  try {

    const res = await axiosInstance.get("/api/v1/items/issue", {
      params: { type: "OTHER" }
    })

    if (res.data.success) {
      setIssuedItems(res.data.data)
    }

  } catch (error) {
    console.error("Failed to fetch issued items", error)
  }
}

useEffect(() => {
  fetchIssuedItems()
  fetchStats()
}, [])

const handleIssueItem = async (
  userId: string,
  itemId: string,
  dueDate: string,
  createdAt: string
) => {
  try {

    const payload = {
      userId,           // keep as string
      itemId,           // keep as string
      dueDate: new Date(dueDate).toISOString(),
      type: "OTHER"
    }

    const res = await axiosInstance.post("/api/v1/items/issue", payload)

    if (res.data.success) {

      // update UI
      setIssuedItems((prev) => [...prev, res.data.data])

      await fetchIssuedItems()
      await fetchStats()

      return true
    }

    return false

  } catch (error) {

    console.error("Issue Item Failed:", error)
    alert("Failed to issue item")
    return false

  }
}

const handleReturnItem = async () => {

  if (!selectedIssue) return

  try {

    const payload = {
      status: returnForm.status,
      fine: returnForm.fine,
      returnDate: new Date(returnForm.returnDate).toISOString()
    }

    const res = await axiosInstance.put(
      `/api/v1/items/issue/${selectedIssue.id}`,
      payload
    )

    if (res.data.success) {

      setIssuedItems((prev) =>
        prev.map((issue) =>
          issue.id === selectedIssue.id ? res.data.data : issue
        )
      )

      await fetchIssuedItems()
      await fetchStats()

      setReturnOpen(false)

    }

  } catch (error) {

    console.error("Return failed", error)

  }
}

const handleDeleteIssue = async (id: string) => {

  try {

    const res = await axiosInstance.delete(
      `/api/v1/items/issues/${id}`
    )

    if (res.data.success) {

      setIssuedItems((prev) =>
        prev.filter((issue) => issue.id !== id)
      )

      await fetchStats()

    }

  } catch (error) {

    console.error("Delete issue failed", error)

  }
}

  return (
    <AdminLayout>
        <div className="space-y-6">
          <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Inventory Management
              </h1>
              <p className="text-muted-foreground mt-1">Manage items, stores, issue & track stock levels</p>
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

          <Tabs defaultValue="items" className="space-y-4">
              <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="items">Item List</TabsTrigger>
                  <TabsTrigger value="issue">Issue / Return</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                      <div className="flex gap-2 flex-1">
                      <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search items..." className="pl-9"                 value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                      <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="stationery">Stationery</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="lab">Lab Equipment</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          </SelectContent>
                      </Select>
                      </div>
                      <Button  onClick={() => setIsAddOpen(true)}>
                          Add Item
                      </Button>
                      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                      <DialogContent>
                          <DialogHeader>
                          <DialogTitle>Add New Item</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                              <label>Item Name</label>
                              <Input
                                  placeholder="Item Name"
                                  value={newItem.name}
                                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              />

                              <label>Category</label>
                              <Select
                                  value={newItem.category}
                                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                              >
                                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="Stationery">Stationery</SelectItem>
                                  <SelectItem value="Electronics">Electronics</SelectItem>
                                  <SelectItem value="Furniture">Furniture</SelectItem>
                                  <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                                  <SelectItem value="Sports">Sports</SelectItem>
                                  </SelectContent>
                              </Select>

                              <label>Quantity</label>
                              <Input
                                  type="number"
                                  placeholder="Quantity"
                                  value={newItem.quantity}
                                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                              />


                              <label>Price</label>
                              <Input
                                  type="number"
                                  placeholder="Price"
                                  value={newItem.price}
                                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                              />

                              <label>Minimum Stock</label>
                              <Input
                                  type="number"
                                  placeholder="Minimum Stock"
                                  value={newItem.minStock}
                                  onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                              />
                          </div>
                          <DialogFooter className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                          <Button onClick={()=>handleAddItem()}>Add Item</Button>
                          </DialogFooter>
                      </DialogContent>
                      </Dialog>
                  </div>
                  <Card>
                      <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price (₹)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="flex justify-center items-center">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {items.map((item) => (
                          <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell><Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{item.category}</Badge></TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.price}</TableCell>
                              <TableCell>
                              <Badge className={item.quantity <= item.minStock ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}>
                                  {item.status}
                              </Badge>
                              </TableCell>
                              <TableCell>
                                  <div className="gap-2 flex justify-center">
                                      <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                      onClick={() => openEditModal(item)}
                                      >
                                          <Edit/>
                                      </Button>
                                      <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                      onClick={() => handleDelete(item.id)}>
                                          <Trash2/>
                                      </Button>
                                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                          <DialogContent>
                                              <DialogHeader>
                                              <DialogTitle>Edit Item</DialogTitle>
                                              </DialogHeader>
                                              {currentItem && (
                                              <div className="space-y-4">
                                                  <Input
                                                  value={currentItem.name}
                                                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                                  placeholder="Item Name"
                                                  />

                                                  <Select value={currentItem.category} onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}>
                                                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="Stationery">Stationery</SelectItem>
                                                      <SelectItem value="Electronics">Electronics</SelectItem>
                                                      <SelectItem value="Furniture">Furniture</SelectItem>
                                                      <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                                                      <SelectItem value="Sports">Sports</SelectItem>
                                                  </SelectContent>
                                                  </Select>

                                                  <Select value={currentItem.status} onValueChange={(value) => setCurrentItem({ ...currentItem, status: value })}>
                                                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="INSTOCK">In Stock</SelectItem>
                                                      <SelectItem value="OUTOFSTOCK">Out Of Stock</SelectItem>
                                                      <SelectItem value="LOWOFSTOCK">Low Of Stock</SelectItem>
                                                      
                                                  </SelectContent>
                                                  </Select>

                                                  <Input
                                                  type="number"
                                                  value={currentItem.quantity}
                                                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                                                  placeholder="Quantity"
                                                  />
                                                  <Input
                                                  type="number"
                                                  value={currentItem.price}
                                                  onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                                                  placeholder="Price"
                                                  />
                                              </div>
                                              )}
                                              <DialogFooter className="mt-4 flex justify-end gap-2">
                                              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                              <Button onClick={handleSave}>Save</Button>
                                              </DialogFooter>
                                          </DialogContent>
                                      </Dialog>
                                  </div>
                              </TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                      </Table>
                  </Card>
              </TabsContent>

              <TabsContent value="issue" className="space-y-4">
                  <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                <BookMarked className="h-4 w-4 mr-2" />
                                Issue Item
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Issue Item</DialogTitle>
                                </DialogHeader>

                                <div className=" gap-4">
                                    <label>Student</label>
                                    <Popover>
                                        <PopoverTrigger asChild>

                                        <Button
                                        variant="outline"
                                        role="combobox"
                                        className="justify-between w-full"
                                        >

                                        {issueForm.userId
                                        ? users.find((u) => String(u.id) === issueForm.userId)?.name
                                        : "Select Student"}

                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />

                                        </Button>

                                        </PopoverTrigger>

                                        <PopoverContent className="p-0 w-full">

                                        <Command>

                                            <CommandInput
                                            placeholder="Search student..."
                                            value={studentSearchTerm}
                                            onValueChange={(value) => setStudentSearchTerm(value)}
                                            />

                                            <CommandEmpty>No student found.</CommandEmpty>

                                            <CommandGroup>

                                            {users
                                            .filter((user) =>
                                            user.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                            )
                                            .map((user) => (

                                            <CommandItem
                                            key={user.id}
                                            value={user.name}
                                            onSelect={() =>
                                            setIssueForm({
                                            ...issueForm,
                                            userId: String(user.id),
                                            })
                                            }
                                            >

                                            <Check
                                            className={`mr-2 h-4 w-4 ${
                                            issueForm.userId === String(user.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                            }`}
                                            />

                                            {user.name} ({user.email})

                                            </CommandItem>

                                            ))}

                                            </CommandGroup>

                                        </Command>

                                        </PopoverContent>
                                    </Popover>

                                    <label>Item</label>
                                    <Popover>

                                    <PopoverTrigger asChild>

                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    className="justify-between w-full"
                                    >

                                    {issueForm.itemId
                                    ? items.find((item) => String(item.id) === issueForm.itemId)?.name
                                    : "Select Item"}

                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />

                                    </Button>

                                    </PopoverTrigger>

                                    <PopoverContent className="p-0 w-full">

                                    <Command>

                                    <CommandInput
                                    placeholder="Search item..."
                                    value={itemSearchTerm}
                                    onValueChange={(value) => setItemSearchTerm(value)}
                                    />

                                    <CommandEmpty>No item found.</CommandEmpty>

                                    <CommandGroup>

                                    {items
                                    .filter((item) =>
                                    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
                                    )
                                    .map((item) => (

                                    <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() =>
                                    setIssueForm((prev) => ({
                                    ...prev,
                                    itemId: String(item.id),
                                    }))
                                    }
                                    >

                                    <Check
                                    className={`mr-2 h-4 w-4 ${
                                    issueForm.itemId === String(item.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                    }`}
                                    />

                                    {item.name}

                                    </CommandItem>

                                    ))}

                                    </CommandGroup>

                                    </Command>

                                    </PopoverContent>

                                    </Popover>

                                    <div className="grid grid-rows-2">
                                    <label>Issue Date</label>
                                    <Input
                                        type="date"
                                        value={issueForm.createdAt}
                                        onChange={(e) =>
                                        setIssueForm({ ...issueForm, createdAt: e.target.value })
                                        }
                                    />

                                    <label className="text-sm font-medium">Due Date</label>

                                    <Input
                                    type="date"
                                    className="w-full border rounded-md p-2"
                                    value={issueForm.dueDate}
                                    onChange={(e) =>
                                    setIssueForm({
                                    ...issueForm,
                                    dueDate: e.target.value,
                                    })
                                    }
                                    />
                                    </div>
                                </div>

                                <DialogFooter>

                                {/* Submit */}
                                <Button
                                  disabled={
                                    !issueForm.userId ||
                                    !issueForm.itemId ||
                                    !issueForm.dueDate ||
                                    !issueForm.createdAt
                                  }
                                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                                  onClick={async () => {

                                    const success = await handleIssueItem(
                                      issueForm.userId,
                                      issueForm.itemId,
                                      issueForm.dueDate,
                                      issueForm.createdAt
                                    )

                                    if (success) {

                                      setIsIssueModalOpen(false)

                                      setIssueForm({
                                        userId: "",
                                        itemId: "",
                                        createdAt: new Date().toISOString().slice(0,10),
                                        returnDate: "",
                                        type: "",
                                        dueDate: "",
                                      })

                                    }

                                  }}
                                >
                                  Issue Item
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                      </div>

                  </div>
                  <Card>
                    <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Issued To</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Return Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Fine</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {issuedItems.map((issue) => (
                          <TableRow key={issue.id}>
                              <TableCell className="font-medium">{issue.item?.name}</TableCell>
                              <TableCell>{issue.user?.name}</TableCell>
                              <TableCell>{issue.createdAt.slice(0, 10)}</TableCell>
                              <TableCell>{issue.returnDate ? issue.returnDate.slice(0,10) : "-"}</TableCell>
                              <TableCell>{issue.dueDate.slice(0, 10)}</TableCell>
                              <TableCell>{issue.fine ?? "-"}</TableCell>
                              <TableCell>
                              <Badge className={issue.status === "RETURNED" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}>{issue.status}</Badge>
                              </TableCell>
                              <TableCell>
                                  <div className="gap-2">
                                  {/* Edit / Return Book */}
                                  <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
                                      <DialogTrigger asChild>
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                          onClick={() => {
                                          setSelectedIssue(issue)
                                          setReturnForm({
                                            status: issue.status,
                                            returnDate: issue.returnDate || "",
                                            fine: issue.fine || 0
                                          })
                                          setReturnOpen(true)
                                        }}
                                      >
                                          <Edit className="w-4 h-4 text-emerald-600" />
                                      </Button>
                                      </DialogTrigger>

                                      <DialogContent>
                                      <DialogHeader>
                                          <DialogTitle>Return Book</DialogTitle>
                                      </DialogHeader>

                                      <div className="grid gap-4">

                                          <label>Status</label>
                                          <Select
                                          value={returnForm.status}
                                          onValueChange={(value) =>
                                            setReturnForm({ ...returnForm, status: value })
                                          }                                     
                                          >
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              
                                              <SelectItem value="RETURNED">RETURNED</SelectItem>
                                              <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                                          </SelectContent>
                                          </Select>

                                          <label>Return Date</label>
                                          <Input
                                          type="date"
                                          value={returnForm.returnDate}
                                          onChange={(e) =>
                                            setReturnForm({ ...returnForm, returnDate: e.target.value })
                                          }
                                          />

                                          <label>Fine (₹)</label>
                                              <Input
                                              type="number"
                                              value={returnForm.fine}
                                              onChange={(e) =>
                                                setReturnForm({
                                                  ...returnForm,
                                                  fine: Number(e.target.value),
                                                })
                                              }
                                              />
                                      </div>

                                      <DialogFooter>
                                          <Button variant="outline" onClick={() => setReturnOpen(false)}>
                                          Cancel
                                          </Button>

                                          {/* Update / Confirm Return API */}
                                          <Button
                                          onClick={handleReturnItem}
                                          >
                                          Confirm Return
                                          </Button>
                                      </DialogFooter>
                                      </DialogContent>
                                  </Dialog>

                                  {/* Delete Issue Record */}
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                      onClick={() => handleDeleteIssue(issue.id)}
                                  >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                  </div>
                              </TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Card>
              </TabsContent>

          </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;