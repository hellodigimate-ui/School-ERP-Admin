/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/set-state-in-effect */
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

import type { PostalRecord } from "@/components/receptionist/types/frontOffice";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const API = "/api/v1/postal";

const empty: Omit<PostalRecord, "id"> = {
  type: "Dispatch",
  fromTitle: "",
  referenceNo: "",
  address: "",
  date: new Date().toISOString().split("T")[0],
  toTitle: "",
  note: "",
  confidential: false,
};

export default function PostalDispatchPage() {
  const [data, setData] = useState<PostalRecord[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PostalRecord, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(API, {
        params: {
          type: "DISPATCH",
        },
      });

      console.log("API Response:", res.data);

      const formatted =
        res?.data?.data?.map((i: any) => ({
          id: i._id || i.id,

          toTitle:
            i.toTitle ||
            i.to ||
            i.receiverName ||
            "",

          referenceNo:
            i.referenceNo ||
            i.reference_no ||
            i.refrenceNo ||
            "",

          fromTitle:
            i.fromTitle ||
            i.from ||
            i.senderName ||
            "",

          date: i.date
            ? i.date.slice(0, 10)
            : i.receivedDate
            ? i.receivedDate.slice(0, 10)
            : new Date().toISOString().slice(0, 10),

          address: i.address || "",

          note:
            i.note ||
            i.description ||
            "",

          confidential:
            i.confidential ||
            i.isConfidential ||
            false,

          type: "Dispatch",
        })) || [];

      setData(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form.toTitle) {
      toast.error("To / Title required");
      return;
    }

    try {
      const payload = {
        ...form,
        type: "DISPATCH",
      };

      if (modal === "add") {
        await axiosInstance.post(API, payload);
        toast.success("Record added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API}/${editId}`, payload);
        toast.success("Record updated");
      }

      setModal(null);
      setForm(empty);
      setEditId(null);

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`${API}/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= COLUMNS ================= */

  const columns = [
    { key: "toTitle", label: "To / Title" },
    { key: "referenceNo", label: "Reference No" },
    { key: "fromTitle", label: "From" },
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
        <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Postal Dispatch
            </h2>
            <p className="text-muted-foreground">
              Track dispatched postal items
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            onClick={() => {
              setForm(empty);
              setModal("add");
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dispatch
          </Button>
        </div>

        {/* Table */}

        <DataTable
          data={data}
          columns={columns}
          searchKey="toTitle"
          loading={loading}
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
          onDelete={(i) => handleDelete(i.id)}
        />

        {/* Dialog */}

        <Dialog
          open={modal !== null}
          onOpenChange={() => {
            setModal(null);
            setEditId(null);
          }}
        >
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl">

            <DialogHeader>
              <DialogTitle>
                {modal === "add"
                  ? "Add Postal Dispatch"
                  : modal === "edit"
                  ? "Edit Postal Dispatch"
                  : "View Dispatch"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>To / Title *</Label>
                <Input
                  value={form.toTitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      toTitle: e.target.value,
                    })
                  }
                  disabled={isView}
                />
              </div>

              <div className="space-y-2">
                <Label>Reference No</Label>
                <Input
                  value={form.referenceNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      referenceNo: e.target.value,
                    })
                  }
                  disabled={isView}
                />
              </div>

              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  value={form.fromTitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fromTitle: e.target.value,
                    })
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
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  disabled={isView}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  disabled={isView}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Note</Label>
                <Textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note: e.target.value,
                    })
                  }
                  disabled={isView}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Checkbox
                  checked={form.confidential}
                  onCheckedChange={(c) =>
                    setForm({
                      ...form,
                      confidential: !!c,
                    })
                  }
                  disabled={isView}
                />
                <Label>Confidential</Label>
              </div>

            </div>

            {!isView && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleSave}
                >
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