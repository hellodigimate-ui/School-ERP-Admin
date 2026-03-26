/* eslint-disable react-hooks/exhaustive-deps */
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
import type { VisitorEntry } from "@/components/receptionist/types/frontOffice";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { axiosInstance } from "@/apiHome/axiosInstanc";

const API_URL = "/api/v1/visitor-book";

const empty: Omit<VisitorEntry, "id"> = {
  name: "",
  phone: "",
  purpose: "",
  visitingTo: "",
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
  const [loading, setLoading] = useState(false);


  const formatTime = (val: any) => {
    if (!val) return "-";

    // If ISO datetime → extract time
    if (typeof val === "string" && val.includes("T")) {
      return val.split("T")[1]?.slice(0, 5);
    }

    // If already time (HH:mm)
    if (typeof val === "string" && val.length <= 5) {
      return val;
    }

    return "-";
  };

  // Fetch Visitors
const reload = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(API_URL);

    console.log("API RESPONSE", res.data.data); // IMPORTANT DEBUG

    const formattedData = (res.data.data || []).map((item: any) => ({
      id: item._id || item.id,

      name:
        item.name ||
        item.visitorName ||
        item.visitor_name ||
        "",

      phone: item.phone || "",

      purpose: item.purpose || "",

      visitingTo:
        item.visitingTo ??
        "-",

      idProof: item.idProof || "-",

      noOfPersons:
        item.noOfPersons ||
        item.no_of_persons ||
        1,

        inTime: formatTime(
          item.inTime ||
          item.in_time ||
          item.checkInTime ||
          item.entryTime
        ),

        outTime: formatTime(
          item.outTime ||
          item.out_time ||
          item.checkOutTime ||
          item.exitTime
        ),

      date:
        item.date ||
        item.visit_date ||
        item.createdAt?.split("T")[0] ||
        "-",

      note: item.note || "",
    }));

    setData(formattedData);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    reload();
  }, []);

  // Save
  const handleSave = async () => {
    if (!form.name || !form.purpose) {
      toast.error("Name and purpose required");
      return;
    }

    try {
      if (modal === "add") {
        await axiosInstance.post(API_URL, form);
        toast.success("Visitor added");
      }

      if (modal === "edit" && editId) {
        await axiosInstance.put(`${API_URL}/${editId}`, form);
        toast.success("Visitor updated");
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
    { key: "name", label: "Visitor Name" },
    { key: "phone", label: "Phone" },
    { key: "purpose", label: "Purpose" },
    { key: "visitingTo", label: "Person to Meet" },
    { key: "inTime", label: "In Time" },
    { key: "outTime", label: "Out Time" },
    { key: "date", label: "Date" },
  ];

  const isView = modal === "view";

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-background to-pink-500/10 border shadow-lg">
          
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Visitor Book
            </h2>

            <p className="text-muted-foreground">
              Track visitors to the school
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
            Add Visitor
          </Button>

        </div>

        {/* Table */}
        <div className="rounded-2xl border shadow bg-background">
          <DataTable
            data={data}
            columns={columns}
            searchKey="name"
            loading={loading}

            onView={(i) => {
              setForm(i);
              setModal("view");
            }}

            onEdit={(i) => {
              setForm(i);
              setEditId(i.id);
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
          <DialogContent className="max-w-2xl rounded-3xl bg-background/95 backdrop-blur-xl shadow-2xl max-h-[85vh] overflow-y-auto">
            
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                {modal === "add"
                  ? "Add Visitor"
                  : modal === "edit"
                  ? "Edit Visitor"
                  : "View Visitor"}
              </DialogTitle>
            </DialogHeader>


            <div className="grid grid-cols-2 gap-6 pt-4">

              <Field label="Name *">
                <Input
                  value={form.name}
                  onChange={(e)=>setForm({...form,name:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(e)=>setForm({...form,phone:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="Purpose *">
                <Input
                  value={form.purpose}
                  onChange={(e)=>setForm({...form,purpose:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="Person to Meet">
                <Input
                  value={form.visitingTo}
                  onChange={(e)=>setForm({...form,visitingTo:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="ID Proof">
                <Input
                  value={form.idProof}
                  onChange={(e)=>setForm({...form,idProof:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="No of Persons">
                <Input
                  type="number"
                  value={form.noOfPersons}
                  onChange={(e)=>setForm({...form,noOfPersons:Number(e.target.value)})}
                  disabled={isView}
                />
              </Field>

              <Field label="In Time">
                <Input
                  type="time"
                  value={form.inTime}
                  onChange={(e)=>setForm({...form,inTime:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="Out Time">
                <Input
                  type="time"
                  value={form.outTime}
                  onChange={(e)=>setForm({...form,outTime:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <Field label="Date">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e)=>setForm({...form,date:e.target.value})}
                  disabled={isView}
                />
              </Field>

              <div className="col-span-2">
                <Label>Note</Label>
                <Textarea
                  value={form.note}
                  onChange={(e)=>setForm({...form,note:e.target.value})}
                  disabled={isView}
                />
              </div>

            </div>


            {!isView && (
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <Button
                  variant="outline"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-gradient-to-r from-primary to-pink-500 text-white"
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



function Field({ label, children }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}