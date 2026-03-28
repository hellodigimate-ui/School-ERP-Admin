/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/receptionist/DataTable";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { axiosInstance } from "@/apiHome/axiosInstanc";

const API_URL = "/api/v1/visitor-book";

const empty = {
  visitorName: "",
  phone: "",
  purpose: "",
  visitingTo: "",
  visitDate: "",
  idNumber: "",
  idProof: "",
  noOfPersons: 1,
  entryTime: "",
  exitTime: "",
  status: "In Campus",
};

export default function VisitorBookPage() {
  const [data, setData] = useState<any[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Format Time
  const formatTime = (val: any) => {
    if (!val) return "-";
    return new Date(val).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Fetch Visitors (API Pagination)
  const reload = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_URL, {
        params: {
          page: currentPage,
          perPage: rowsPerPage,
        },
      });

      const formatted = (res.data.data || []).map((item: any) => ({
        id: item._id || item.id,
        visitorName: item.visitorName,
        phone: item.phone,
        purpose: item.purpose,
        visitingTo: item.visitingTo || "-",
        idProof: item.idProof || "-",
        idNumber: item.idNumber || "",
        noOfPersons: item.noOfPersons || 1,
        entryTime: item.entryTime,
        exitTime: item.exitTime,
        visitDate: item.visitDate,
        status: item.exitTime ? "Checked Out" : "In Campus",
      }));

      setData(formatted);
      setTotalPages(res.data.pagination?.totalPages || 1);

    } catch (err) {
      console.error(err);
      toast.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [currentPage, rowsPerPage]);

  // ✅ SAVE
  const handleSave = async () => {
    if (!form.visitorName || !form.purpose) {
      toast.error("Required fields missing");
      return;
    }

    try {
      const date = form.visitDate || new Date().toISOString().split("T")[0];

      const entryISO = form.entryTime
        ? new Date(`${date}T${form.entryTime}`).toISOString()
        : null;

      const exitISO = form.exitTime
        ? new Date(`${date}T${form.exitTime}`).toISOString()
        : null;

      const payload = {
        ...form,
        visitDate: new Date(date).toISOString(),
        entryTime: entryISO,
        exitTime: exitISO,
        status: exitISO ? "Checked Out" : "In Campus",
      };

      if (modal === "add") {
        await axiosInstance.post(API_URL, payload);
        toast.success("Added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, payload);
        toast.success("Updated");
      }

      setModal(null);
      setForm(empty);
      setEditId(null);
      reload();
    } catch (err) {
      console.error(err);
      toast.error("Error saving");
    }
  };

  // ✅ DELETE
  const handleDelete = async (item: any) => {
    if (!confirm("Delete?")) return;

    await axiosInstance.delete(`${API_URL}/${item.id}`);
    toast.success("Deleted");
    reload();
  };

  const columns = [
    { key: "visitorName", label: "Visitor Name" },
    { key: "phone", label: "Phone" },
    { key: "purpose", label: "Purpose" },
    { key: "visitingTo", label: "To Meet" },
    {
      key: "entryTime",
      label: "In Time",
      render: (row: any) => formatTime(row.entryTime),
    },
    {
      key: "exitTime",
      label: "Out Time",
      render: (row: any) => formatTime(row.exitTime),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "In Campus"
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between p-6 rounded-3xl shadow">
          <h2 className="text-2xl font-bold">Visitor Book</h2>

          <Button
            onClick={() => {
              setForm(empty);
              setModal("add");
            }}
          >
            <Plus className="mr-2" /> Add
          </Button>
        </div>

        {/* Table */}
        <DataTable
          data={data}
          columns={columns}
          searchKey="visitorName"
          loading={loading}
          onView={(i) => {
            setForm(i);
            setModal("view");
          }}
          onEdit={(i) => {
            setForm({
              ...i,
              entryTime: i.entryTime?.slice(11, 16) || "",
              exitTime: i.exitTime?.slice(11, 16) || "",
              visitDate: i.visitDate?.split("T")[0] || "",
            });
            setEditId(i.id);
            setModal("edit");
          }}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-2">

          <div className="flex items-center gap-2">
            <span className="text-sm">Rows:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>

          </div>
        </div>

        {/* Modal */}
        <Dialog open={modal !== null} onOpenChange={() => setModal(null)}>
          <DialogContent className="max-w-2xl rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            
            <DialogHeader className="mb-4 border-b border-indigo-200 pb-3 sticky top-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 z-10">
              <DialogTitle className="text-2xl font-bold text-indigo-800">
                {modal === "add"
                  ? "Add Visitor"
                  : modal === "edit"
                  ? "Edit Visitor"
                  : "View Visitor"}
              </DialogTitle>
            </DialogHeader>

            {/* ================= FORM ================= */}

            {isView ? (

              /* ================= VIEW MODE ================= */

              <div className="grid grid-cols-1 gap-4">

                {[
                  { label: "Visitor Name", value: form.visitorName, color: "bg-indigo-100" },
                  { label: "Phone", value: form.phone, color: "bg-purple-100" },
                  { label: "Purpose", value: form.purpose, color: "bg-pink-100" },
                  { label: "Id Proof", value: form.idProof, color: "bg-gray-100" },
                  { label: "Id Number", value: form.idNumber, color: "bg-emrald-100" },
                  { label: "To Meet", value: form.visitingTo, color: "bg-green-100" },
                  { label: "Date", value: form.visitDate, color: "bg-yellow-100" },
                  { label: "In Time", value: form.entryTime || "-", color: "bg-indigo-50" },
                  { label: "Out Time", value: form.exitTime || "-", color: "bg-pink-50" },
                  { label: "Status", value: form.status, color: "bg-green-50" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.color} rounded-2xl p-4 shadow-md flex justify-between items-center`}
                  >
                    <span className="font-semibold text-gray-700">
                      {item.label}
                    </span>

                    <span className="text-gray-800 font-medium">
                      {item.value || "-"}
                    </span>

                  </div>
                ))}

              </div>

            ) : (

              /* ================= EDIT / ADD ================= */

              <div className="grid grid-cols-2 gap-6 pt-4">

                <InputField label="Visitor Name">
                  <Input
                    value={form.visitorName}
                    onChange={(e) =>
                      setForm({ ...form, visitorName: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="Purpose">
                  <Input
                    value={form.purpose}
                    onChange={(e) =>
                      setForm({ ...form, purpose: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="To Meet">
                  <Input
                    value={form.visitingTo}
                    onChange={(e) =>
                      setForm({ ...form, visitingTo: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="ID Proof">
                  <select
                    value={form.idProof}
                    onChange={(e) =>
                      setForm({ ...form, idProof: e.target.value })
                    }
                    className="w-full border rounded-xl p-2 bg-white"
                  >
                    <option value="">Select ID Proof</option>
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </InputField>

                <InputField label="ID Number">
                  <Input
                    value={form.idNumber}
                    onChange={(e) =>
                      setForm({ ...form, idNumber: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="Visit Date">
                  <Input
                    type="date"
                    value={form.visitDate}
                    onChange={(e) =>
                      setForm({ ...form, visitDate: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="In Time">
                  <Input
                    type="time"
                    value={form.entryTime}
                    onChange={(e) =>
                      setForm({ ...form, entryTime: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

                <InputField label="Out Time">
                  <Input
                    type="time"
                    value={form.exitTime}
                    onChange={(e) =>
                      setForm({ ...form, exitTime: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </InputField>

              </div>

            )}

            {/* ================= BUTTONS ================= */}

            <div className="flex justify-end gap-3 mt-6">

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setModal(null)}
              >
                Close
              </Button>

              {!isView && (
                <Button
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl"
                  onClick={handleSave}
                >
                  {modal === "add" ? "Add Visitor" : "Update Visitor"}
                </Button>
              )}

            </div>

          </DialogContent>
        </Dialog>

      </div>
    </ReceptionistLayout>
  );
}

// Field Component
function InputField({ label, children }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
