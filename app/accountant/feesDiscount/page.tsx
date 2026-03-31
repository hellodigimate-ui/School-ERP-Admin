/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import Layout from "@/components/accountant/Layout";

const Page = () => {

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


  return (

    <Layout>

      <div className="min-h-screen p-8 space-y-8 bg-background">

        {/* HEADER */}

        <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-border">
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fee Discounts
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all student fee discounts
            </p>
          </div>

        </div>

        {/* TABLE */}

        <Card className="rounded-2xl shadow-lg border border-border bg-card/80 backdrop-blur-md">

          <CardContent className="p-6">

            <Table>

            <TableHeader>
              <TableRow className="bg-secondary/50 dark:bg-secondary/30">
                <TableHead className="font-semibold text-foreground">#</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Type</TableHead>
                <TableHead className="font-semibold text-foreground">Value</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Actions</TableHead>
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
                            ? "bg-secondary/70 text-foreground border border-border"
                            : "bg-secondary/70 text-foreground border border-border"
                        }
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </Badge>

                    </TableCell>

                    <TableCell className="flex gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-secondary/40"
                      onClick={() => openEdit(d)}
                    >
                      <Eye size={16} />
                    </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </CardContent>

        </Card>

      </div>


      {/* VIEW MODAL */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">

          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Discount Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">

            {/* Name */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{form.name || "-"}</span>
            </div>

            {/* Type */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{form.type || "-"}</span>
            </div>

            {/* Value */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Value</span>
              <span className="font-medium">
                {form.type === "PERCENTAGE"
                  ? `${form.value}%`
                  : `₹${form.value}`}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                ${
                  form.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Close
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </Layout>

  )

}

export default Page