/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";

import { DataTable } from "@/components/receptionist/DataTable";
import type { PostalRecord } from "@/components/receptionist/types/frontOffice";

import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const API = "/api/v1/postal";

const empty: Omit<PostalRecord, "id"> = {
  type: "Dispatch",
  fromTitle: "",
  referenceNo: "",
  date: new Date().toISOString().split("T")[0],
  toTitle: "",
  note: "",
};

export default function PostalDispatchPage() {
  const [data, setData] = useState<PostalRecord[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<Omit<PostalRecord, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const perPage = 10;

  /* ================= FETCH ================= */

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(API, {
        params: {
          type: "DISPATCH",
          page,
          perPage,
          name: search,
        },
      });

      const formatted =
        res?.data?.data?.map((i: any) => ({
          id: i._id || i.id,
          toTitle: i.receiverName || i.toTitle || "",
          referenceNo: i.refrenceNo || i.referenceNo || "",
          fromTitle: i.senderName || i.fromTitle || "",
          date: i.receivedDate
            ? new Date(i.receivedDate).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          note: i.note || "",
          type: "Dispatch",
        })) || [];

      setData(formatted);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form.toTitle) {
      toast.error("To Title Required");
      return;
    }

    try {
      const payload = {
        senderName: form.fromTitle,
        receiverName: form.toTitle,
        refrenceNo: form.referenceNo,
        receivedDate: new Date(form.date).toISOString(), // ✅ ISO STRING
        note: form.note,
        type: "DISPATCH",
      };

      if (modal === "add") {
        await axiosInstance.post(API, payload);
        toast.success("Added Successfully");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API}/${editId}`, payload);
        toast.success("Updated Successfully");
      }

      setModal(null);
      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`${API}/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= EXPORT ================= */

  const handleExport = async () => {
    try {
      const res = await axiosInstance.get(`${API}/report`, {
        params: { type: "DISPATCH" },
        responseType: "blob",
      });

      const blob = new Blob([res.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "dispatch.xlsx";
      link.click();
    } catch (err) {
      toast.error("Export failed");
    }
  };

  /* ================= COLUMNS ================= */

  const columns = [
    { key: "toTitle", label: "To" },
    { key: "referenceNo", label: "Reference" },
    { key: "fromTitle", label: "From" },
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "note", label: "Note" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center p-6 rounded-3xl shadow-xl 
        bg-gradient-to-r from-blue-500/10 to-purple-500/10">

          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r 
            from-blue-600 to-purple-600 
            bg-clip-text text-transparent">
              Postal Dispatch
            </h2>

            <p className="text-muted-foreground">
              Manage postal dispatch records
            </p>
          </div>

          <div className="flex gap-3">

            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

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
        </div>

        {/* Search */}

        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search dispatch..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </CardContent>
        </Card>

        {/* Table */}

        <DataTable
          data={data}
          columns={columns}
          searchKey="toTitle"
          loading={loading}
          onEdit={(i) => {
            const { id, ...rest } = i;
            setForm(rest);
            setEditId(id);
            setModal("edit");
          }}
          onDelete={(i) => handleDelete(i.id)}
        />

        {/* Pagination */}

        <div className="flex justify-between items-center">

          <Button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>

          <div className="flex gap-2">

            {[...Array(totalPages)].map((_, i) => (

              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>

            ))}

          </div>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>

        </div>

        {/* Dialog */}

        <Dialog open={modal !== null} onOpenChange={() => setModal(null)}>

          <DialogContent className="max-w-xl rounded-2xl">

            <DialogHeader>

              <DialogTitle>

                {modal === "add"
                  ? "Add Dispatch"
                  : modal === "edit"
                  ? "Edit Dispatch"
                  : "View Dispatch"}

              </DialogTitle>

            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">

              <Input
                placeholder="To"
                value={form.toTitle}
                disabled={isView}
                onChange={(e) =>
                  setForm({
                    ...form,
                    toTitle: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Reference"
                value={form.referenceNo}
                disabled={isView}
                onChange={(e) =>
                  setForm({
                    ...form,
                    referenceNo: e.target.value,
                  })
                }
              />

              <Input
                placeholder="From"
                value={form.fromTitle}
                disabled={isView}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fromTitle: e.target.value,
                  })
                }
              />

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
              />

              <Textarea
                className="col-span-2"
                placeholder="Note"
                value={form.note}
                disabled={isView}
                onChange={(e) =>
                  setForm({
                    ...form,
                    note: e.target.value,
                  })
                }
              />

            </div>

            {!isView && (

              <div className="flex justify-end gap-2 pt-4">

                <Button variant="outline" onClick={() => setModal(null)}>
                  Cancel
                </Button>

                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleSave}
                >
                  Save
                </Button>

              </div>

            )}

          </DialogContent>

        </Dialog>

      </div>
    </ReceptionistLayout>
  );
}