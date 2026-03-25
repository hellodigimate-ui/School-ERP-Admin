/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  getItems,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from "@/lib/storage";

import type { Complaint } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

const KEY = "complaints";

const empty: Omit<Complaint, "id"> = {
  complaintBy: "",
  phone: "",
  type: "General",
  source: "In Person",
  description: "",
  actionTaken: "",
  date: new Date().toISOString().split("T")[0],
  status: "Pending",
  note: "",
};

export default function ComplaintsPage() {
  const [data, setData] = useState<Complaint[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<Complaint, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const reload = () => setData(getItems<Complaint>(KEY));

  useEffect(() => {
    reload();
  }, []);

  const handleSave = () => {
    if (!form.complaintBy || !form.description) {
      toast.error("Complaint by and description are required");
      return;
    }

    if (modal === "add") {
      addItem(KEY, { ...form, id: generateId() });
      toast.success("Complaint added");
    } else if (modal === "edit" && editId) {
      updateItem(KEY, { ...form, id: editId });
      toast.success("Complaint updated");
    }

    setModal(null);
    setForm(empty);
    setEditId(null);
    reload();
  };

  const columns = [
    { key: "complaintBy", label: "Complaint By" },
    { key: "phone", label: "Phone" },
    { key: "type", label: "Type" },
    { key: "source", label: "Source" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (i: Complaint) => <StatusBadge status={i.status} />,
    },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Complaints
          </h2>
          <p className="text-muted-foreground">
            Manage and track complaints
          </p>
        </div>

        <Button
          onClick={() => {
            setForm(empty);
            setModal("add");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Complaint
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        searchKey="complaintBy"
        onView={(i) => {
          const { id, ...rest } = i;
          setForm(rest);
          setModal("view");
        }}
        onEdit={(i) => {
          const { id, ...rest } = i;
          setForm(rest);
          setEditId(id);
          setModal("edit");
        }}
        onDelete={(i) => {
          deleteItem(KEY, i.id);
          toast.success("Deleted");
          reload();
        }}
      />

      {/* Dialog */}
      <Dialog
        open={modal !== null}
        onOpenChange={() => {
          setModal(null);
          setEditId(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Complaint"
                : modal === "edit"
                ? "Edit Complaint"
                : "View Complaint"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label>Complaint By *</Label>
              <Input
                value={form.complaintBy}
                onChange={(e) =>
                  setForm({ ...form, complaintBy: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v })
                }
                disabled={isView}
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) =>
                  setForm({ ...form, source: v })
                }
                disabled={isView}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "In Person",
                    "Phone",
                    "Email",
                    "Written",
                    "Online",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as any })
                }
                disabled={isView}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Pending", "In Progress", "Resolved"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Action Taken</Label>
              <Textarea
                value={form.actionTaken}
                onChange={(e) =>
                  setForm({ ...form, actionTaken: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Note</Label>
              <Textarea
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                disabled={isView}
              />
            </div>
          </div>

          {!isView && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {modal === "add" ? "Add" : "Update"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </ReceptionistLayout>
  );
}