/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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

import { DataTable } from "@/components/receptionist/DataTable";

import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from "@/lib/storage";

import type { VisitorEntry } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

const KEY = "visitor_book";

const empty: Omit<VisitorEntry, "id"> = {
  name: "",
  phone: "",
  purpose: "",
  personToMeet: "",
  idProof: "",
  noOfPersons: 1,
  inTime: "",
  outTime: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

export default function VisitorBookPage() {
  const [data, setData] = useState<VisitorEntry[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<VisitorEntry, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const reload = () => setData(getItems<VisitorEntry>(KEY));

  useEffect(() => {
    reload();
  }, []);

  const handleSave = () => {
    if (!form.name || !form.purpose) {
      toast.error("Name and purpose are required");
      return;
    }

    if (modal === "add") {
      addItem(KEY, { ...form, id: generateId() });
      toast.success("Visitor added");
    } else if (modal === "edit" && editId) {
      updateItem(KEY, { ...form, id: editId });
      toast.success("Visitor updated");
    }

    setModal(null);
    setForm(empty);
    setEditId(null);
    reload();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "purpose", label: "Purpose" },
    { key: "personToMeet", label: "Person to Meet" },
    { key: "inTime", label: "In Time" },
    { key: "outTime", label: "Out Time" },
    { key: "date", label: "Date" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Visitor Book
          </h2>
          <p className="text-muted-foreground">
            Track visitors to the school
          </p>
        </div>

        <Button
          onClick={() => {
            setForm(empty);
            setModal("add");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Visitor
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
                ? "Add Visitor"
                : modal === "edit"
                ? "Edit Visitor"
                : "View Visitor"}
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
              <Label>Purpose *</Label>
              <Input
                value={form.purpose}
                onChange={(e) =>
                  setForm({ ...form, purpose: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Person to Meet</Label>
              <Input
                value={form.personToMeet}
                onChange={(e) =>
                  setForm({ ...form, personToMeet: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>ID Proof</Label>
              <Input
                value={form.idProof}
                onChange={(e) =>
                  setForm({ ...form, idProof: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>No. of Persons</Label>
              <Input
                type="number"
                min={1}
                value={form.noOfPersons}
                onChange={(e) =>
                  setForm({
                    ...form,
                    noOfPersons: Number(e.target.value),
                  })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>In Time</Label>
              <Input
                type="time"
                value={form.inTime}
                onChange={(e) =>
                  setForm({ ...form, inTime: e.target.value })
                }
                disabled={isView}
              />
            </div>

            <div className="space-y-2">
              <Label>Out Time</Label>
              <Input
                type="time"
                value={form.outTime}
                onChange={(e) =>
                  setForm({ ...form, outTime: e.target.value })
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