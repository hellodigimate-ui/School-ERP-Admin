/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { axiosInstance } from "@/apiHome/axiosInstanc";

const BASE_URL = "/api/v1/admission-enquiries";

const emptyForm: any = {
  name: "",
  parentName: "",
  phone: "",
  email: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export default function AdmissionEnquiryPage() {
  const [data, setData] = useState<any[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch API
  const reload = async () => {
    try {
      const res = await axiosInstance.get(BASE_URL);
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // Save
  const handleSave = async () => {
    try {
      if (!form.name || !form.phone) {
        toast.error("Name and phone are required");
        return;
      }

      if (modal === "add") {
        await axiosInstance.post(BASE_URL, {
          studentName: form.name,
          parentName: form.parentName,
          phone: form.phone,
          email: form.email,
          enquiryDate: form.date,
          description: form.description,
        });

        toast.success("Enquiry added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${BASE_URL}/${editId}`, {
          studentName: form.name,
          parentName: form.parentName,
          phone: form.phone,
          email: form.email,
          enquiryDate: form.date,
          description: form.description,
        });

        toast.success("Enquiry updated");
      }

      setModal(null);
      setForm(emptyForm);
      reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${item.id}`);
      toast.success("Enquiry deleted");
      reload();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (item: any) => {
    setForm({
      name: item.studentName,
      parentName: item.parentName,
      phone: item.phone,
      email: item.email,
      description: item.description,
      date: item.enquiryDate?.split("T")[0],
    });

    setEditId(item.id);
    setModal("edit");
  };

  const openView = (item: any) => {
    setForm({
      name: item.studentName,
      parentName: item.parentName,
      phone: item.phone,
      email: item.email,
      description: item.description,
      date: item.enquiryDate?.split("T")[0],
    });

    setModal("view");
  };

  const columns = [
    { key: "studentName", label: "Name" },
    { key: "parentName", label: "Parent Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    {
      key: "enquiryDate",
      label: "Date",
      render: (i: any) =>
        i.enquiryDate
          ? new Date(i.enquiryDate).toLocaleDateString()
          : "-",
    },
    { key: "description", label: "Description" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 rounded-3xl 
        bg-gradient-to-r from-primary/10 via-background to-pink-500/10 
        border shadow-lg overflow-hidden">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full"></div>

          <div>
            <h2 className="text-3xl font-bold 
            bg-gradient-to-r from-primary to-pink-500 
            bg-clip-text text-transparent">
              Admission Enquiry
            </h2>
            <p className="text-muted-foreground">
              Manage admission enquiries
            </p>
          </div>

          <Button
            className="gap-2 rounded-xl 
            bg-gradient-to-r from-primary to-pink-500 
            hover:opacity-90 text-white shadow-lg"
            onClick={() => {
              setForm(emptyForm);
              setModal("add");
            }}
          >
            <Plus className="h-4 w-4" />
            Add Enquiry
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border shadow-sm bg-card">
          <DataTable
            data={data}
            columns={columns}
            onView={openView}
            onEdit={openEdit}
            onDelete={handleDelete}
            searchKey="studentName"
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
          <DialogContent className="max-w-2xl rounded-3xl 
          bg-background/90 backdrop-blur-xl shadow-2xl">

            <DialogHeader>
              <DialogTitle className="text-2xl 
              bg-gradient-to-r from-primary to-pink-500 
              bg-clip-text text-transparent">
                {modal === "add"
                  ? "Add Enquiry"
                  : modal === "edit"
                  ? "Edit Enquiry"
                  : "View Enquiry"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 pt-4">

              <div className="space-y-2">
                <Label>Student Name *</Label>
                <Input
                  className="rounded-xl"
                  value={form.name}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Parent Name</Label>
                <Input
                  className="rounded-xl"
                  value={form.parentName}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, parentName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  className="rounded-xl"
                  value={form.phone}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  className="rounded-xl"
                  value={form.email}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  className="rounded-xl"
                  value={form.date}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="rounded-xl min-h-[100px]"
                  value={form.description}
                  disabled={isView}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            {!isView && (
              <div className="flex justify-end gap-3 pt-6 border-t mt-4">

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="rounded-xl bg-gradient-to-r 
                  from-primary to-pink-500 text-white"
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