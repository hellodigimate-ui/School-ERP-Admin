/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface EditStudentModalProps {
  open: boolean;
  student: any;
  onClose: () => void;
  onSave: (updatedStudent: any) => void;
}

interface ClassData {
  id: string;
  name: string;
}

interface SectionData {
  id: string;
  name: string;
  classId: string;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  open,
  student,
  onClose,
  onSave,
}) => {
  const [classes, setClasses] = React.useState<ClassData[]>([]);
  const [sections, setSections] = React.useState<SectionData[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    classId: "",
    sectionId: "",
    rollNumber: "",
    status: "Active",
  });

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", { params: { perPage: 100 } });
      setClasses(res.data.data.classes.map((cls: any) => ({ id: cls.id, name: cls.name })));
    } catch {
      toast.error("Failed to load classes");
    }
  };

  // Fetch sections from API
  const fetchSections = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/sections");
      setSections(res.data.data.sections);
    } catch {
      toast.error("Failed to load sections");
    }
  };

  // Initialize form when modal opens or student changes
  React.useEffect(() => {
    if (open) {
      fetchClasses();
      fetchSections();

      if (student) {
        setFormData({
          name: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          classId: student.classId || "",
          sectionId: student.sectionId || "",
          rollNumber: student.rollNumber || "",
          status: student.status || "Active",
        });
      }
    }
  }, [open, student]);

  // Filter sections for selected class
  const filteredSections = sections.filter((s) => s.classId === formData.classId);

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.classId ||
      !formData.sectionId ||
      !formData.rollNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // PUT API call to update student
      const res = await axiosInstance.put(`/api/v1/students/${student.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        classId: formData.classId,
        sectionId: formData.sectionId,
        rollNumber: formData.rollNumber,
        status: formData.status,
      });

      console.log(res.data.data)

      const selectedClass = classes.find((c) => c.id === formData.classId);
      const selectedSection = sections.find((s) => s.id === formData.sectionId);

      // Call parent callback with updated data
      onSave({
        ...student,
        ...res.data.data, // updated data from API
        className: selectedClass?.name,
        section: selectedSection?.name,
      });

      toast.success("Student updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Student Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone"
            />
          </div>

          {/* Class Select */}
          <div className="grid gap-2">
            <Label>Class</Label>
            <Select
              value={formData.classId}
              onValueChange={(value) =>
                setFormData({ ...formData, classId: value, sectionId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Select */}
          <div className="grid gap-2">
            <Label>Section</Label>
            <Select
              value={formData.sectionId}
              onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
              disabled={!formData.classId || filteredSections.length === 0 || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="Roll Number"
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
