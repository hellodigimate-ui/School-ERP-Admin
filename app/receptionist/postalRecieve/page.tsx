/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/receptionist/DataTable";

import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from "@/lib/storage";

import type { PostalRecord } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

const KEY = "postal_records";

const empty: Omit<PostalRecord, "id"> = {
  type: "Receive",
  fromTitle: "",
  referenceNo: "",
  address: "",
  date: new Date().toISOString().split("T")[0],
  toTitle: "",
  note: "",
  confidential: false,
};

export default function PostalReceivePage() {
  const [data, setData] = useState<PostalRecord[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PostalRecord, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const reload = () =>
    setData(
      getItems<PostalRecord>(KEY).filter(
        (p) => p.type === "Receive"
      )
    );

  useEffect(() => {
    reload();
  }, []);

  const handleSave = () => {
    if (!form.fromTitle) {
      toast.error("From/Title is required");
      return;
    }

    if (modal === "add") {
      addItem(KEY, {
        ...form,
        type: "Receive",
        id: generateId(),
      });
      toast.success("Record added");
    } else if (modal === "edit" && editId) {
      updateItem(KEY, { ...form, id: editId });
      toast.success("Record updated");
    }

    setModal(null);
    setForm(empty);
    setEditId(null);
    reload();
  };

  const columns = [
    { key: "fromTitle", label: "From/Title" },
    { key: "referenceNo", label: "Ref No." },
    { key: "toTitle", label: "To" },
    { key: "date", label: "Date" },
    {
      key: "confidential",
      label: "Confidential",
      render: (i: PostalRecord) =>
        i.confidential ? "Yes" : "No",
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
            Postal Receive
          </h2>
          <p className="text-muted-foreground">
            Track received postal items
          </p>
        </div>

        <Button
          onClick={() => {
            setForm(empty);
            setModal("add");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        searchKey="fromTitle"
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
                ? "Add Postal Receive"
                : modal === "edit"
                ? "Edit Record"
                : "View Record"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label>From/Title *</Label>
              <Input
                value={form.fromTitle}
                onChange={(e) =>
                  setForm({ ...form, fromTitle: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Reference No.</Label>
              <Input
                value={form.referenceNo}
                onChange={(e) =>
                  setForm({ ...form, referenceNo: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Input
                value={form.toTitle}
                onChange={(e) =>
                  setForm({ ...form, toTitle: e.target.value })
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

            <div className="col-span-2 space-y-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
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

            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                checked={form.confidential}
                onCheckedChange={(c) =>
                  setForm({ ...form, confidential: !!c })
                }
                disabled={isView}
              />
              <Label>Confidential</Label>
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