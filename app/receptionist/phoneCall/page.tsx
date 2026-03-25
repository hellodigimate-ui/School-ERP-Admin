/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
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

import type { PhoneCall } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

const KEY = "phone_calls";

const empty: Omit<PhoneCall, "id"> = {
  name: "",
  phone: "",
  callType: "Incoming",
  purpose: "",
  date: new Date().toISOString().split("T")[0],
  startTime: "",
  endTime: "",
  followUpDate: "",
  note: "",
};

export default function PhoneCallLogPage() {
  const [data, setData] = useState<PhoneCall[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PhoneCall, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const reload = () => setData(getItems<PhoneCall>(KEY));

  useEffect(() => {
    reload();
  }, []);

  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }

    if (modal === "add") {
      addItem(KEY, { ...form, id: generateId() });
      toast.success("Call log added");
    } else if (modal === "edit" && editId) {
      updateItem(KEY, { ...form, id: editId });
      toast.success("Call log updated");
    }

    setModal(null);
    setForm(empty);
    setEditId(null);
    reload();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    {
      key: "callType",
      label: "Type",
      render: (i: PhoneCall) => (
        <StatusBadge status={i.callType} />
      ),
    },
    { key: "purpose", label: "Purpose" },
    { key: "date", label: "Date" },
    { key: "startTime", label: "Start" },
    { key: "endTime", label: "End" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Phone Call Log
          </h2>
          <p className="text-muted-foreground">
            Record incoming and outgoing calls
          </p>
        </div>

        <Button
          onClick={() => {
            setForm(empty);
            setModal("add");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Call Log
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
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
                ? "Add Call Log"
                : modal === "edit"
                ? "Edit Call Log"
                : "View Call Log"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            
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

            <div className="space-y-2">
              <Label>Call Type</Label>
              <Select
                value={form.callType}
                onValueChange={(v) =>
                  setForm({ ...form, callType: v as any })
                }
                disabled={isView}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incoming">Incoming</SelectItem>
                  <SelectItem value="Outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input
                value={form.purpose}
                onChange={(e) =>
                  setForm({ ...form, purpose: e.target.value })
                }
                disabled={isView}
              />
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

            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  setForm({ ...form, followUpDate: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
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