/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ScholarshipTypes() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    amount: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    amount: "",
    isActive: true,
  });

  // ================= FETCH =================
  const fetchScholarships = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await axiosInstance.get(`/api/v1/scholarships?${params}`);

      const json = res.data;

      if (json.success) {
        setList(json.data);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [page, search]);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await axiosInstance.post("/api/v1/scholarships", {
        name: form.name,
        type: form.type,
        amount: form.amount,
      });

      setShowDialog(false);
      setForm({ name: "", type: "", amount: "" });
      fetchScholarships();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!selected) return;

    try {
      await axiosInstance.put(`/api/v1/scholarships/${selected.id}`, {
        name: editForm.name,
        amount: editForm.amount,
        isActive: editForm.isActive,
      });

      setSelected(null);
      fetchScholarships();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scholarship?")) return;

    try {
      await axiosInstance.delete(`/api/v1/scholarships/${id}`);
      fetchScholarships();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const openEdit = (item: any) => {
    setSelected(item);
    setEditForm({
      name: item.name,
      amount: item.value,
      isActive: item.isActive,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="text-primary" />
        <h2 className="text-xl font-semibold">Scholarship Types</h2>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Add Scholarship</DialogTitle>

            <div className="space-y-3 mt-3">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <Button onClick={handleCreate} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No data found
                </td>
              </tr>
            ) : (
              list.map((item, i) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">
                    {item.type === "PERCENTAGE"
                      ? `${item.value}%`
                     : `₹ ${item.value}`}
                  </td>

                  <td className="p-3">
                    <Badge
                      className={
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Pencil
                        onClick={() => openEdit(item)}
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => handleDelete(item.id)}
                        className="w-4 h-4 text-red-500 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogTitle>Edit Scholarship</DialogTitle>

          <div className="space-y-3 mt-3">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />

            <Input
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: e.target.value })
              }
            />

            <Select
              value={editForm.isActive ? "true" : "false"}
              onValueChange={(val) =>
                setEditForm({
                  ...editForm,
                  isActive: val === "true",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleUpdate} className="w-full">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>

        <span className="px-2 py-1 text-sm">
          Page {page} / {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
