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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dumbbell, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface SportsListProps {
  branchId?: string;
}

export default function SportsList({ branchId }: SportsListProps) {
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  // ================= FETCH SPORTS =================
  const fetchSports = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { name: search }),
        ...(branchId ? { branchId } : {}),
      });

      const res = await axiosInstance.get(`/api/v1/sports?${params}`);
      const json = res.data;

      if (json.success) {
        setSports(json.data);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch sports", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CRUD =================
  const handleCreate = async () => {
    try {
      const localBranchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;

      const payload = {
        ...form,
        ...(localBranchId ? { branchId: localBranchId } : {}),
      };

      const res = await axiosInstance.post("/api/v1/sports", payload);

      console.log("Create response:", res.data);

      if (res.data.success) {
        setShowDialog(false);
        setForm({ name: "", description: "" });
        fetchSports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/sports/${selected.id}`,
        editForm,
      );

      if (res.data.success) {
        setSelected(null);
        fetchSports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/sports/${id}`);
      fetchSports();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    fetchSports();
  }, [page, search]);

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* 🔥 Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={14}
          />
          <Input
            placeholder="Search sports..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* ADD SPORT */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Add Sport
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogTitle>Add Sport</DialogTitle>

            <div className="space-y-4">
              <Input
                placeholder="Sport name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-10">Loading...</div>
        ) : sports.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No sports found
          </div>
        ) : (
          sports.map((sport) => (
            <div
              key={sport.id}
              className="bg-card rounded-2xl border p-4 shadow-sm hover:shadow-lg"
            >
              <div className="flex justify-between">
                <Dumbbell size={18} />
                <Badge>{sport.status || "Active"}</Badge>
              </div>

              <h3 className="mt-3 font-semibold">{sport.name}</h3>
              <p className="text-xs text-muted-foreground">
                {sport.description}
              </p>

              <div className="flex justify-between mt-4 pt-3 border-t">
                {/* EDIT */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelected(sport);
                        setEditForm({
                          name: sport.name,
                          description: sport.description || "",
                        });
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>Edit Sport</DialogTitle>

                    <div className="space-y-4">
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelected(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleUpdate}>Update</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* DELETE */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm("Delete this sport?")) {
                      handleDelete(sport.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 Pagination */}
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
