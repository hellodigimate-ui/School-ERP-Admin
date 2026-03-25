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
import type { AdmissionEnquiry as AEType } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

const STORAGE_KEY = "admission_enquiries";

const emptyForm: Omit<AEType, "id"> = {
  name: "",
  phone: "",
  email: "",
  class: "",
  source: "Walk-in",
  description: "",
  followUpDate: "",
  status: "Open",
  date: new Date().toISOString().split("T")[0],
};

export default function AdmissionEnquiryPage() {
  const [data, setData] = useState<AEType[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<AEType, "id">>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const reload = () => setData(getItems<AEType>(STORAGE_KEY));

  useEffect(() => {
    reload();
  }, []);

  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }

    if (modal === "add") {
      addItem(STORAGE_KEY, { ...form, id: generateId() });
      toast.success("Enquiry added");
    } else if (modal === "edit" && editId) {
      updateItem(STORAGE_KEY, { ...form, id: editId });
      toast.success("Enquiry updated");
    }

    setModal(null);
    setForm(emptyForm);
    setEditId(null);
    reload();
  };

  const handleDelete = (item: AEType) => {
    deleteItem(STORAGE_KEY, item.id);
    toast.success("Enquiry deleted");
    reload();
  };

  const openEdit = (item: AEType) => {
    const { id, ...rest } = item;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  };

  const openView = (item: AEType) => {
    const { id, ...rest } = item;
    setForm(rest);
    setModal("view");
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "class", label: "Class" },
    { key: "source", label: "Source" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (i: AEType) => <StatusBadge status={i.status} />,
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
            Admission Enquiry
          </h2>
          <p className="text-muted-foreground">
            Manage admission enquiries
          </p>
        </div>

        <Button
          onClick={() => {
            setForm(emptyForm);
            setModal("add");
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Enquiry
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchKey="name"
      />

      {/* Modal */}
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
                ? "Add Enquiry"
                : modal === "edit"
                ? "Edit Enquiry"
                : "View Enquiry"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                disabled={isView}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                disabled={isView}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                disabled={isView}
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label>Class</Label>
              <Input
                value={form.class}
                onChange={(e) =>
                  setForm({ ...form, class: e.target.value })
                }
                disabled={isView}
              />
            </div>

            {/* Source */}
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
                    "Walk-in",
                    "Phone",
                    "Website",
                    "Referral",
                    "Advertisement",
                    "Other",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
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
                  {["Open", "Closed", "Won", "Lost"].map((s) => (
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
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                disabled={isView}
              />
            </div>

            {/* Follow-up */}
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    followUpDate: e.target.value,
                  })
                }
                disabled={isView}
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                disabled={isView}
              />
            </div>
          </div>

          {/* Actions */}
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