/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  callTime: "",
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

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch Data
  const reload = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL, {
        params: {
          page,
          limit,
        },
      });

      const responseData = res?.data?.data || res?.data || [];

      const formatted = responseData.map((item: any) => ({
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

        callTime: item.callTime
          ? new Date(item.callTime).toTimeString().slice(0, 5)
          : "",

        purpose:
          item.purpose ||
          item.reason ||
          "",

        createdAt: item.callTime
          ? new Date(item.callTime).toISOString().split("T")[0]
          : item.createdAt
          ? item.createdAt.split("T")[0]
          : "",
      }));

      setData(formatted);

      setTotalPages(
        res?.data?.totalPages ||
          res?.data?.pagination?.totalPages ||
          1
      );

      setTotal(
        res?.data?.total ||
          res?.data?.pagination?.total ||
          0
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Save
  const handleSave = async () => {
    if (!form.callerName || !form.phoneNumber) {
      toast.error("Name and phone required");
      return;
    }

    try {
      const callTimeISO = form.callTime
        ? new Date(`${form.createdAt}T${form.callTime}`).toISOString()
        : null;

      const payload = {
        ...form,
        callTime: callTimeISO,
      };

      if (modal === "add") {
        await axiosInstance.post(API_URL, payload);
        toast.success("Call log added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, payload);
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
        <StatusBadge status={i.callType || "INCOMING"} />
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
            className="bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl shadow-lg"
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Total : {total}
            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <div className="px-4 py-2 border rounded-lg">
                {page} / {totalPages}
              </div>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>

            </div>
          </div>

        </div>

        {/* Modal */}
        <Dialog
          open={modal !== null}
          onOpenChange={() => {
            setModal(null);
            setEditId(null);
          }}
        >
          <DialogContent className="max-w-2xl rounded-3xl">

            <DialogHeader>
              <DialogTitle>
                {modal === "add"
                  ? "Add Call Log"
                  : modal === "edit"
                  ? "Edit Call Log"
                  : "View Call Log"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 pt-4">

              <div>
                <Label>Name</Label>
                <Input
                  value={form.callerName}
                  onChange={(e) =>
                    setForm({ ...form, callerName: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

              <div>
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
                    <SelectItem value="INCOMING">
                      Incoming
                    </SelectItem>

                    <SelectItem value="OUTGOING">
                      Outgoing
                    </SelectItem>

                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Purpose</Label>
                <Input
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.createdAt}
                  onChange={(e) =>
                    setForm({ ...form, createdAt: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

              <div>
                <Label>Call Time</Label>
                <Input
                  type="time"
                  value={form.callTime}
                  onChange={(e) =>
                    setForm({ ...form, callTime: e.target.value })
                  }
                  disabled={isView}
                />
              </div>

            </div>

            {!isView && (
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setModal(null)}
                >
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