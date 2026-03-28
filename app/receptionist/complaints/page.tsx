/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/receptionist/DataTable";
import { StatusBadge } from "@/components/receptionist/StatusBadge";

import {
  Plus,
  MessageSquareWarning
} from "lucide-react";

import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const API = "/api/v1/complaints";

const empty = {
  name: "",
  phone: "",
  type: "General",
  assignTo: "",
  source: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  status: "PENDING",
  note: "",
};

export default function ComplaintsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);

  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(API, {
        params: {
          page,
          limit: 10,
        },
      });

      const formatted =
        res?.data?.data?.map((i: any) => ({
          id: i._id || i.id,

          name: i.name || "",

          type: i.type || "General",

          source: i.source || "In Person",

          description: i.description || "",

          assignTo: i.assignTo || "",

          date: i.date
            ? new Date(i.date).toISOString().slice(0, 10)
            : "",

          status: i.status || "PENDING",

          note: i.note || "",
        })) || [];

      setData(formatted);

      setTotalPages(res?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch complaints");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form.name || !form.description) {
      toast.error("Required fields missing");
      return;
    }

    try {
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
      };

      if (modal === "add") {
        await axiosInstance.post(API, payload);
        toast.success("Complaint Added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API}/${editId}`, payload);
        toast.success("Complaint Updated");
      }

      setModal(null);
      setForm(empty);
      setEditId(null);

      fetchData();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`${API}/${id}`);
      toast.success("Deleted Successfully");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    { key: "name", label: "Complaint By" },
    { key: "type", label: "Type" },
    { key: "source", label: "Source" },
    { key: "date", label: "Date" },
    { key: "assignTo", label: "Assign To" },
    {
      key: "status",
      label: "Status",
      render: (i: any) => <StatusBadge status={i.status} />,
    },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <MessageSquareWarning className="w-6 h-6" />
              Complaints
            </h2>

            <p className="text-muted-foreground">
              Manage complaints efficiently
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            onClick={() => {
              setForm(empty);
              setModal("add");
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Complaint
          </Button>
        </div>

        {/* Table */}

        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          searchKey="name"
          onView={(i: any) => {
            const { id, ...rest } = i;
            setForm(rest);
            setEditId(id);
            setModal("view");
          }}
          onEdit={(i: any) => {
            const { id, ...rest } = i;
            setForm(rest);
            setEditId(id);
            setModal("edit");
          }}
          onDelete={(i: any) => {
            handleDelete(i.id);
          }}
        />

        {/* Pagination */}

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="px-4 py-2 font-medium">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>

        {/* Dialog */}

<Dialog
  open={modal !== null}
  onOpenChange={() => {
    setModal(null);
    setEditId(null);
  }}
>
  <DialogContent
    className="sm:max-w-3xl rounded-3xl p-8 
    bg-background/80 backdrop-blur-xl 
    border shadow-2xl max-h-[85vh] overflow-y-auto"
  >
    <DialogHeader className="space-y-2">
      <DialogTitle
        className="text-2xl font-semibold 
        bg-gradient-to-r from-indigo-600 to-purple-600 
        bg-clip-text text-transparent"
      >
        {modal === "add" && "Add Complaint"}
        {modal === "edit" && "Edit Complaint"}
        {modal === "view" && "View Complaint"}
      </DialogTitle>

      <p className="text-sm text-muted-foreground">
        Fill complaint information
      </p>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

      {/* Complaint By */}
      <div className="space-y-2">
        <Label>Complaint By *</Label>
        <Input
          placeholder="Enter Name"
          value={form.name}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="h-11 rounded-xl bg-muted/40 border-purple-400/20
          focus-visible:ring-2 focus-visible:ring-purple-400/40"
        />
      </div>


      {/* Phone */}
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          placeholder="Enter Phone"
          value={form.phone || ""}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          className="h-11 rounded-xl bg-muted/40 border-purple-400/20
          focus-visible:ring-2 focus-visible:ring-purple-400/40"
        />
      </div>


      {/* Type */}
      <div className="space-y-2">
        <Label>Type</Label>

        <Select
          value={form.type}
          disabled={isView}
          onValueChange={(v) =>
            setForm({
              ...form,
              type: v,
            })
          }
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>

          <SelectContent>
            {[
              "General",
              "Academic",
              "Facility",
              "Staff",
              "Transport",
              "Hostel",
              "Canteen",
              "Other",
            ].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {/* Source */}
      <div className="space-y-2">
        <Label>Source</Label>

        <Select
          value={form.source}
          disabled={isView}
          onValueChange={(v) =>
            setForm({
              ...form,
              source: v,
            })
          }
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Parent">Parent</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>


      {/* Assign To */}
      <div className="space-y-2">
        <Label>Assign To</Label>

        <Input
          placeholder="Assign To"
          value={form.assignTo || ""}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              assignTo: e.target.value,
            })
          }
          className="h-11 rounded-xl bg-muted/40 border-purple-400/20
          focus-visible:ring-2 focus-visible:ring-purple-400/40"
        />
      </div>


      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>

        <Select
          value={form.status}
          disabled={isView}
          onValueChange={(v) =>
            setForm({
              ...form,
              status: v,
            })
          }
        >
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {["PENDING", "OPEN", "RESOLVED"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {/* Date */}
      <div className="space-y-2">
        <Label>Date</Label>

        <Input
          type="date"
          value={form.date}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
          className="h-11 rounded-xl bg-purple-500/5 border-purple-400/30"
        />
      </div>


      {/* Description */}
      <div className="col-span-full space-y-2">
        <Label>Description *</Label>

        <Textarea
          placeholder="Complaint Description..."
          value={form.description}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="rounded-xl min-h-[110px] bg-muted/40 border-purple-400/20"
        />
      </div>

    </div>


    {!isView && (
      <div className="flex justify-end gap-3 pt-6 border-t mt-4">

        <Button
          variant="outline"
          onClick={() => setModal(null)}
          className="rounded-xl h-11 px-6"
        >
          Cancel
        </Button>

        <Button
          className="rounded-xl h-11 px-6 text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:shadow-lg transition-all"
          onClick={handleSave}
        >
          {modal === "add" ? "Add Complaint" : "Update Complaint"}
        </Button>

      </div>
    )}

  </DialogContent>
</Dialog>

      </div>
    </ReceptionistLayout>
  );
}