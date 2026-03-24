/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosInstance } from "@/apiHome/axiosInstanc";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "../ui/sonner";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
}

interface SectionData {
  id: string;
  name: string;
  classId: string;
  className: string;
  capacity: number;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
}

export function AddStudentModal({ open, onClose }: AddStudentModalProps) {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    classId: "",
    sectionId: "",
    rollNumber: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch sections
  const fetchSections = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/sections");
      setSections(res.data.data.sections);
      console.log(res.data.data.sections)
    } catch {
      toast.error("Failed to load sections");
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", { params: { perPage: 100 } });
      setClasses(res.data.data.classes.map((cls: any) => ({ id: cls.id, name: cls.name })));
    } catch {
      toast.error("Failed to load classes");
    }
  };

  useEffect(() => {
    if (open) {
      fetchClasses();
      fetchSections();
    }
  }, [open]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hello")
    console.log(formData)
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.classId ||
      !formData.sectionId ||
      !formData.rollNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId,
        sectionId: formData.sectionId,
        rollNumber: formData.rollNumber,
      };

      

      await axiosInstance.post("/api/v1/students", payload);

      toast.success("Student added successfully!");
      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        dateOfBirth: "",
        classId: "",
        sectionId: "",
        rollNumber: "",
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Add New Student</h2>
            <p className="text-sm text-muted-foreground">
              Enter student details to create a new student record.
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name *"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Email *"
            placeholder="student@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password *"
            placeholder=". . . . . . ."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Select
            label="Gender"
            options={["Male", "Female"]}
            value={formData.gender}
            onValueChange={(val) => setFormData({ ...formData, gender: val })}
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-black mb-2">Date of Birth</label>
            <input
              type="date"
              className="px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <Select
            label="Class *"
            options={classes.map((cls) => ({ value: cls.id, label: cls.name }))}
            value={formData.classId}
            onValueChange={(val) => setFormData({ ...formData, classId: val, sectionId: "" })}
          />

          <Select
            label="Section *"
            options={sections
              .filter((s) => s.classId === formData.classId)
              .map((s) => ({ value: s.id, label: s.name }))}
            value={formData.sectionId}
            onValueChange={(val) => setFormData({ ...formData, sectionId: val })}
          />

          <Input
            label="Roll Number *"
            placeholder="01"
            className="md:col-span-2"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
          />

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}

              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Small Helpers ---------------- */

function Input({
  label,
  placeholder,
  value,
  onChange,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

/* Radix/Shadcn-style Select */
function Select({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: { value: string; label: string }[] | string[];
  value: string;
  onValueChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2">{label}</label>
      <select
        className="px-3 py-2 rounded-lg border w-full bg-white"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {Array.isArray(options)
          ? options.map((o: any) =>
              typeof o === "string" ? (
                <option key={o} value={o}>
                  {o}
                </option>
              ) : (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              )
            )
          : null}
      </select>
    </div>
  );
}
