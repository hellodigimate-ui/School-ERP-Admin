/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const Page = () => {

  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [discounts, setDiscounts] = useState<any[]>([])
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null)

  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    value: "",
    isActive: true
  })

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      type: "",
      value: "",
      isActive: true
    })
  }

  // FETCH
  const fetchDiscounts = async () => {

    try {

      setLoading(true)

      const res = await axiosInstance.get("/api/v1/discounts", {
        params: { page, perPage }
      })

      setDiscounts(res.data.data.discounts)
      setTotalPages(res.data.data.pagination.totalPages)

    } catch (error) {

      console.error("Failed to fetch discounts", error)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {
    fetchDiscounts()
  }, [page])

  // CREATE
  const createDiscount = async () => {

    try {

      await axiosInstance.post("/api/v1/discounts", {
        name: form.name,
        description: form.description,
        type: form.type,
        value: Number(form.value),
        isActive: true
      })

      fetchDiscounts()
      resetForm()
      setOpen(false)

    } catch (error) {

      console.error("Create failed", error)

    }

  }

  // OPEN EDIT
  const openEdit = (discount: any) => {

    setSelectedDiscount(discount)

    setForm({
      name: discount.name,
      description: discount.description || "",
      type: discount.type,
      value: String(discount.value),
      isActive: discount.isActive
    })

    setEditOpen(true)

  }

  // UPDATE
  const updateDiscount = async () => {

    try {

      await axiosInstance.put(`/api/v1/discounts/${selectedDiscount.id}`, {
        name: form.name,
        description: form.description,
        type: form.type,
        value: Number(form.value),
        isActive: form.isActive
      })

      fetchDiscounts()
      setEditOpen(false)

    } catch (error) {

      console.error("Update failed", error)

    }

  }

  // DELETE
  const deleteDiscount = async (id: number) => {

    try {

      await axiosInstance.delete(`/api/v1/discounts/${id}`)

      fetchDiscounts()

    } catch (error) {

      console.error("Delete failed", error)

    }

  }

  return (

    <AdminLayout>

      <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">

        {/* HEADER */}

        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border">
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fee Discounts
            </h1>
            <p className="text-sm text-gray-500">
              Manage all student fee discounts
            </p>
          </div>

          {/* ADD DISCOUNT */}

          <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>

              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus size={16} /> Add Discount
              </Button>

            </DialogTrigger>

            <DialogContent>

              <DialogHeader>
                <DialogTitle>Add Discount</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">

                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label>Type</Label>

                    <Select
                      value={form.type}
                      onValueChange={(value) => setForm({ ...form, type: value })}
                    >

                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount</SelectItem>
                      </SelectContent>

                    </Select>

                  </div>

                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                    />
                  </div>

                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <Button onClick={createDiscount}>
                  Save
                </Button>

              </div>

            </DialogContent>

          </Dialog>

        </div>

        {/* TABLE */}

        <Card className="rounded-2xl shadow-lg border bg-white/80 backdrop-blur-md">

          <CardContent className="p-6">

            <Table>

            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">#</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

              <TableBody>

                {discounts.map((d, index) => (

                  <TableRow key={d.id}>

                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{d.name}</TableCell>

                    <TableCell>{d.type}</TableCell>

                    <TableCell>
                      {d.type === "PERCENTAGE" ? `${d.value}%` : `₹${d.value}`}
                    </TableCell>

                    <TableCell>

                      <Badge
                        className={
                          d.isActive
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </Badge>

                    </TableCell>

                    <TableCell className="flex gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-indigo-100 text-indigo-600"
                      onClick={() => openEdit(d)}
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-100 text-red-600"
                      onClick={() => deleteDiscount(d.id)}
                    >
                      <Trash2 size={16} />
                    </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>

      {/* EDIT MODAL */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>

        <DialogContent>

          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />

            <Select
              value={form.isActive ? "active" : "inactive"}
              onValueChange={(v) =>
                setForm({ ...form, isActive: v === "active" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>

            </Select>

            <Button onClick={updateDiscount}>
              Update
            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </AdminLayout>

  )

}

export default Page