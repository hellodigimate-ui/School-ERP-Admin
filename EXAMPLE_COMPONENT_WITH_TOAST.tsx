/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// REAL WORKING EXAMPLE - Copy & Adapt This
// ============================================================================
// This is a complete, working example component that demonstrates
// how to use toast notifications in a realistic scenario

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toastNotifications } from "@/utils/toastNotifications";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rollNumber: "",
  });

  // ─────────────────────────────────────────────────────────────
  // ADD STUDENT
  // ─────────────────────────────────────────────────────────────
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toastNotifications.error.required();
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/students", formData);

      if (response.data.success) {
        // Add to list
        setStudents([...students, response.data.data]);

        // Show success notification
        toastNotifications.success.created("Student");

        // Reset form
        setFormData({ name: "", email: "", phone: "", rollNumber: "" });
        setDialogOpen(false);
      } else {
        toastNotifications.error.creation("Student", response.data.message);
      }
    } catch (error: any) {
      toastNotifications.error.creation(
        "Student",
        error?.response?.data?.message || "Network error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // UPDATE STUDENT
  // ─────────────────────────────────────────────────────────────
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStudent) return;

    if (!formData.name || !formData.email || !formData.phone) {
      toastNotifications.error.required();
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/api/v1/students/${editingStudent.id}`,
        formData
      );

      if (response.data.success) {
        // Update in list
        setStudents(
          students.map((s) =>
            s.id === editingStudent.id ? response.data.data : s
          )
        );

        // Show success notification
        toastNotifications.success.updated("Student Information");

        // Reset and close
        setFormData({ name: "", email: "", phone: "", rollNumber: "" });
        setEditingStudent(null);
        setDialogOpen(false);
      } else {
        toastNotifications.error.update(
          "Student Information",
          response.data.message
        );
      }
    } catch (error: any) {
      toastNotifications.error.update(
        "Student Information",
        error?.response?.data?.message || "Network error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // DELETE STUDENT
  // ─────────────────────────────────────────────────────────────
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    // Optional: Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete ${studentName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/api/v1/students/${studentId}`
      );

      if (response.data.success) {
        // Remove from list
        setStudents(students.filter((s) => s.id !== studentId));

        // Show success notification
        toastNotifications.success.deleted("Student Record");
      } else {
        toastNotifications.error.deletion(
          "Student Record",
          response.data.message
        );
      }
    } catch (error: any) {
      toastNotifications.error.deletion(
        "Student Record",
        error?.response?.data?.message || "Network error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // OPEN DIALOG FOR ADD OR EDIT
  // ─────────────────────────────────────────────────────────────
  const openAddDialog = () => {
    setEditingStudent(null);
    setFormData({ name: "", email: "", phone: "", rollNumber: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
    });
    setDialogOpen(true);
  };

  // ─────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Manage students in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={openAddDialog} className="mb-6">
            Add Student
          </Button>

          {students.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No students found. Click Add Student to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <Card key={student.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Roll: {student.rollNumber} | {student.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(student)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDeleteStudent(student.id, student.name)
                        }
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Edit Student" : "Add Student"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent
                ? "Update student information"
                : "Add a new student to the system"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              editingStudent ? handleUpdateStudent : handleAddStudent
            }
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 9876543210"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
                placeholder="2024001"
                disabled={loading}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingStudent ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// ============================================================================
// KEY POINTS FROM THIS EXAMPLE:
// ============================================================================

/*
1. IMPORT:
   - import { toastNotifications } from "@/utils/toastNotifications";

2. SUCCESS NOTIFICATIONS:
   - toastNotifications.success.created("Student")
   - toastNotifications.success.updated("Student Information")
   - toastNotifications.success.deleted("Student Record")

3. ERROR NOTIFICATIONS:
   - toastNotifications.error.creation("Student", response.data.message)
   - toastNotifications.error.update("Student Information", message)
   - toastNotifications.error.deletion("Student Record", message)

4. VALIDATION:
   - toastNotifications.error.required()

5. THEY SUPPORT:
   - Custom messages from API
   - Default fallback messages
   - Proper error handling with try-catch
   - Loading states during async operations

6. USER EXPERIENCE:
   - Toast appears at top-right
   - Auto-dismisses after a few seconds
   - Can be dismissed manually
   - Color-coded by type (green=success, red=error)
   - Professional appearance with proper styling
*/

export {}; // This is a reference file
