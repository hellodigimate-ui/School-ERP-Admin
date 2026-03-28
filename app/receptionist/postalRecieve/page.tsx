/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PostalRecord {
  id: string;
  fromTitle: string;
  referenceNo: string;
  date: string; // ISO string
  toTitle: string;
  note: string;
}

const API_URL = "/api/v1/postal";

const empty: Omit<PostalRecord, "id"> = {
  fromTitle: "",
  referenceNo: "",
  date: new Date().toISOString(), // full ISO string
  toTitle: "",
  note: "",
};

export default function PostalReceivePage() {
  const [data, setData] = useState<PostalRecord[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PostalRecord, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  

  /* ================= Fetch Data ================= */
const fetchData = async () => {
  try {
    const res = await axiosInstance.get(API_URL, {
      params: {
        type: "RECEIVE",
        search: debouncedSearch,
      },
    });

    const formatted = res?.data?.data?.map((item: any) => ({
      id: item._id || item.id,
      fromTitle: item.senderName || "",
      referenceNo: item.refrenceNo || "",
      date: item.receivedDate || new Date().toISOString(),
      toTitle: item.receiverName || "",
      note: item.note || "",
    }));

    setData(formatted || []);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchData();
}, [debouncedSearch]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  /* ================= Save ================= */
  const handleSave = async () => {
    if (!form.fromTitle) {
      toast.error("From/Title required");
      return;
    }

    const payload = {
      senderName: form.fromTitle,
      receiverName: form.toTitle,
      refrenceNo: form.referenceNo,
      receivedDate: form.date, // ISO string
      note: form.note,
      type: "RECEIVE",
    };

    try {
      if (modal === "add") {
        await axiosInstance.post(API_URL, payload);
        toast.success("Added successfully");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, payload);
        toast.success("Updated successfully");
      }

      setModal(null);
      setForm(empty);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= Edit ================= */
  const handleEdit = (item: PostalRecord) => {
    const { id, ...rest } = item;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  };

  /* ================= Delete ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete record?")) return;

    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center 
                        p-6 rounded-3xl shadow-xl 
                        bg-gradient-to-r 
                        from-primary/10 via-background to-pink-500/10">

          <div>
            <h1 className="text-2xl font-bold 
                           bg-gradient-to-r 
                           from-primary to-pink-500 
                           text-transparent bg-clip-text">
              Postal Receive
            </h1>
            <p className="text-muted-foreground">
              Manage received postal records
            </p>
          </div>

          <Button
            className="gap-2 bg-gradient-to-r 
                       from-primary to-pink-500 text-white"
            onClick={() => {
              setForm(empty);
              setModal("add");
            }}
          >
            <Plus className="w-4 h-4" />
            Add Record
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead>#</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.fromTitle}</TableCell>
                  <TableCell>{item.referenceNo}</TableCell>
                  <TableCell>{item.toTitle}</TableCell>
                  <TableCell>{item.date.split("T")[0]}</TableCell> {/* show YYYY-MM-DD */}
                  <TableCell>{item.note}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal */}
        <Dialog open={modal !== null} onOpenChange={() => setModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle>
                {modal === "add" ? "Add Postal" : modal === "edit" ? "Edit Postal" : "View Postal"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Title</Label>
                <Input
                  value={form.fromTitle}
                  disabled={isView}
                  onChange={(e) => setForm({ ...form, fromTitle: e.target.value })}
                />
              </div>

              <div>
                <Label>Reference No</Label>
                <Input
                  value={form.referenceNo}
                  disabled={isView}
                  onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                />
              </div>

              <div>
                <Label>To</Label>
                <Input
                  value={form.toTitle}
                  disabled={isView}
                  onChange={(e) => setForm({ ...form, toTitle: e.target.value })}
                />
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date.split("T")[0]} // display YYYY-MM-DD
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, date: new Date(e.target.value).toISOString() }) // store full ISO
                  }
                />
              </div>

              <div className="col-span-2">
                <Label>Note</Label>
                <Textarea
                  value={form.note}
                  disabled={isView}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            {!isView && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setModal(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ReceptionistLayout>
  );
}