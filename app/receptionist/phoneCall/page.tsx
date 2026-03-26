/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/set-state-in-effect */
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

import type { PhoneCall } from "@/components/receptionist/types/frontOffice";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { axiosInstance } from "@/apiHome/axiosInstanc";

const API_URL = "/api/v1/phone/logs";

const empty: Omit<PhoneCall, "id"> = {
  callerName: "",
  phoneNumber: "",
  callType: "Incoming",
  purpose: "",
  createdAt: new Date().toISOString().split("T")[0],
};

export default function PhoneCallLogPage() {
  const [data, setData] = useState<PhoneCall[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PhoneCall, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Data
  const reload = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL);

      console.log("FULL API RESPONSE:", res.data);

      // ✅ Handle both cases: {data: []} OR []
      const rawData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || [];

      console.log("RAW DATA:", rawData);

      const formatted = rawData.map((item: any) => ({
        id: item._id || item.id,

        callerName:
          item.callerName ||
          item.caller_name ||
          item.name ||
          "",

        phoneNumber:
          item.phoneNumber ||
          item.phone_number ||
          item.mobile ||
          "",

        callType:
          item.callType ||
          item.call_type ||
          "Incoming",

        purpose:
          item.purpose ||
          item.reason ||
          "",

        createdAt: item.createdAt
          ? item.createdAt.split("T")[0]
          : item.created_at
          ? item.created_at.split("T")[0]
          : "",
      }));

      console.log("FORMATTED DATA:", formatted);

      setData(formatted);

    } catch (error) {
      console.error("RELOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // Save
  const handleSave = async () => {
    if (!form.callerName || !form.phoneNumber) {
      toast.error("Name and phone required");
      return;
    }

    try {
      if (modal === "add") {
        await axiosInstance.post(API_URL, form);
        toast.success("Call log added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, form);
        toast.success("Call updated");
      }

      setModal(null);
      setForm(empty);
      setEditId(null);
      reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete
  const handleDelete = async (item: any) => {
    try {
      await axiosInstance.delete(`${API_URL}/${item.id}`);
      toast.success("Deleted");
      reload();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { key: "callerName", label: "Name" },
    { key: "phoneNumber", label: "Phone" },

    {
      key: "callType",
      label: "Type",
      render: (i: PhoneCall) => (
        <StatusBadge status={i.callType || "Incoming"} />
      ),
    },

    { key: "purpose", label: "Purpose" },
    { key: "createdAt", label: "Date" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-background to-pink-500/10 border shadow-lg">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Phone Call Log
            </h2>
            <p className="text-muted-foreground">
              Track incoming and outgoing calls
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 transition"
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
        <div className="rounded-2xl border shadow bg-background">
          <DataTable
            data={data}
            columns={columns}
            searchKey="callerName"
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
            onDelete={handleDelete}
          />
        </div>

        {/* Modal */}
        <Dialog
          open={modal !== null}
          onOpenChange={() => {
            setModal(null);
            setEditId(null);
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl">

            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                {modal === "add"
                  ? "Add Call Log"
                  : modal === "edit"
                  ? "Edit Call Log"
                  : "View Call Log"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 pt-4">

              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  className="rounded-xl"
                  value={form.callerName}
                  onChange={(e) =>
                    setForm({ ...form, callerName: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  className="rounded-xl"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
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
                  <SelectTrigger className="rounded-xl">
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                  value={form.createdAt}
                  onChange={(e) =>
                    setForm({ ...form, createdAt: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

            </div>

            {!isView && (
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white"
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