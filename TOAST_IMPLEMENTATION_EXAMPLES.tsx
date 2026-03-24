// ============================================================================
// TOAST NOTIFICATIONS - IMPLEMENTATION EXAMPLES
// This file demonstrates how to use toast notifications in various scenarios
// ============================================================================

// ✓ ALREADY ADDED:
// - Layout: app/layout.tsx (Toaster component)
// - Utility: utils/toastNotifications.ts (Pre-built notifications)
// - Login Page: app/login/page.tsx (Using toastNotifications)

// ============================================================================
// EXAMPLE 1: Form Submission with Validation
// ============================================================================

/*
"use client";

import { useState } from "react";
import { toastNotifications } from "@/utils/toastNotifications";

export default function StudentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toastNotifications.error.required();
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toastNotifications.error.creation("Student", error.message);
        return;
      }

      toastNotifications.success.created("Student");
      setFormData({ name: "", email: "", phone: "" });
      // Redirect or refresh data
    } catch (error: any) {
      toastNotifications.handleApiError(error, "Failed to add student");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields *
    //   <button type="submit">Add Student</button>
    // </form>
  );
}
*/

// ============================================================================
// EXAMPLE 2: Update Operation
// ============================================================================

/*
const handleUpdateStudent = async (studentId: string, updatedData: any) => {
  try {
    const response = await axiosInstance.put(
      `/api/students/${studentId}`,
      updatedData
    );

    if (response.data.success) {
      toastNotifications.success.updated("Student Information");
      // Refresh the student list or redirect
      await refreshStudents();
    } else {
      toastNotifications.error.update(
        "Student Information",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to update student");
  }
};
*/

// ============================================================================
// EXAMPLE 3: Delete Operation with Confirmation
// ============================================================================

/*
const handleDeleteStudent = async (studentId: string, studentName: string) => {
  // Show confirmation toast
  toastNotifications.warning.confirmAction(`delete ${studentName}`);

  // After user confirms, proceed with deletion
  try {
    const response = await axiosInstance.delete(`/api/students/${studentId}`);

    if (response.data.success) {
      toastNotifications.success.deleted("Student Record");
      // Refresh the list
      await refreshStudents();
    } else {
      toastNotifications.error.deletion(
        "Student Record",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(
      error,
      "Failed to delete student record"
    );
  }
};
*/

// ============================================================================
// EXAMPLE 4: Attendance Submission
// ============================================================================

/*
const handleSubmitAttendance = async (classId: string, attendanceData: any) => {
  toastNotifications.info.processing("Attendance");

  try {
    const response = await axiosInstance.post(
      `/api/attendance`,
      {
        classId,
        ...attendanceData,
      }
    );

    if (response.data.success) {
      toastNotifications.success.submitted("Attendance");
      // Refresh or navigate
    } else {
      toastNotifications.error.submission(
        "Attendance",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to submit attendance");
  }
};
*/

// ============================================================================
// EXAMPLE 5: Fee Collection
// ============================================================================

/*
const handleCollectFee = async (studentId: string, amount: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/fees/collect`,
      { studentId, amount }
    );

    if (response.data.success) {
      toastNotifications.success.submitted("Fee Collection");
      toastNotifications.handleApiSuccess(
        "Payment Received",
        `Rs. ${amount} has been collected successfully`
      );
      // Refresh fees list
    } else {
      toastNotifications.error.submission(
        "Fee Collection",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to collect fee");
  }
};
*/

// ============================================================================
// EXAMPLE 6: Leave Approval
// ============================================================================

/*
const handleApproveLeavRequest = async (leaveId: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/leave/${leaveId}`,
      { status: "approved" }
    );

    if (response.data.success) {
      toastNotifications.success.approved("Leave Request");
      // Refresh leave requests
    } else {
      toastNotifications.error.update(
        "Leave Request",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to approve leave");
  }
};
*/

// ============================================================================
// EXAMPLE 7: File Upload (Assignment, Certificate, etc.)
// ============================================================================

/*
const handleFileUpload = async (file: File, assignmentId: string) => {
  const formData = new FormData();
  formData.append("file", file);

  toastNotifications.info.processing("File Upload");

  try {
    const response = await axiosInstance.post(
      `/api/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.data.success) {
      toastNotifications.success.submitted("Assignment");
      toastNotifications.handleApiSuccess(
        "Upload Complete",
        "Your assignment has been submitted successfully"
      );
    } else {
      toastNotifications.error.submission(
        "Assignment",
        response.data.message
      );
    }
  } catch (error: any) {
    if (error.response?.status === 413) {
      toastNotifications.error.submission(
        "Assignment",
        "File size is too large. Maximum 10MB allowed."
      );
    } else {
      toastNotifications.handleApiError(error, "Failed to upload file");
    }
  }
};
*/

// ============================================================================
// EXAMPLE 8: Bulk Operations
// ============================================================================

/*
const handleBulkApprove = async (selectedIds: string[]) => {
  if (!selectedIds.length) {
    toastNotifications.error.required();
    return;
  }

  toastNotifications.info.processing("Approvals");

  try {
    const response = await axiosInstance.post(
      `/api/bulk/approve`,
      { ids: selectedIds }
    );

    if (response.data.success) {
      toastNotifications.success.marked("Approved");
      toastNotifications.handleApiSuccess(
        "Bulk Operation Complete",
        `${selectedIds.length} items have been approved`
      );
      // Refresh list
    } else {
      toastNotifications.error.submission(
        "Bulk Operation",
        response.data.message
      );
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to process bulk operation");
  }
};
*/

// ============================================================================
// EXAMPLE 9: Settings/Preferences Save
// ============================================================================

/*
const handleSaveSettings = async (settings: any) => {
  try {
    const response = await axiosInstance.put(
      `/api/settings`,
      settings
    );

    if (response.data.success) {
      toastNotifications.success.saved("Settings");
      // Update local settings
    } else {
      toastNotifications.error.update("Settings", response.data.message);
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to save settings");
  }
};
*/

// ============================================================================
// EXAMPLE 10: Network Error Handling
// ============================================================================

/*
const handleApiCall = async () => {
  try {
    const response = await axiosInstance.get("/api/data");
    // Process response
  } catch (error: any) {
    if (!navigator.onLine) {
      toastNotifications.error.network();
    } else if (error.response?.status === 401) {
      toastNotifications.error.unauthorized();
      // Redirect to login
    } else if (error.response?.status === 403) {
      toastNotifications.error.unauthorized();
    } else {
      toastNotifications.handleApiError(error);
    }
  }
};
*/

// ============================================================================
// EXAMPLE 11: Success with Custom Message
// ============================================================================

/*
const handlePaymentGateway = async (paymentData: any) => {
  try {
    const response = await axiosInstance.post(
      `/api/payment/process`,
      paymentData
    );

    if (response.data.success) {
      toastNotifications.handleApiSuccess(
        "Payment Successful",
        `Payment of Rs. ${paymentData.amount} has been processed. Transaction ID: ${response.data.transactionId}`
      );
      // Redirect to success page
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Payment processing failed");
  }
};
*/

// ============================================================================
// EXAMPLE 12: Modal/Dialog Operations
// ============================================================================

/*
const handleDialog = () => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/action`,
        // { /* data */
    //   );

//       if (response.data.success) {
//         toastNotifications.success.updated("Action Completed");
//         // Close dialog
//         setOpen(false);
//       } else {
//         toastNotifications.error.update("Action", response.data.message);
//       }
//     } catch (error: any) {
//       toastNotifications.handleApiError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Dialog JSX with handleConfirm callback
//   );
// };


// ============================================================================
// QUICK REFERENCE - Copy & Paste Ready
// ============================================================================

/*
SUCCESS NOTIFICATIONS (Copy & Use):
- toastNotifications.success.login()
- toastNotifications.success.logout()
- toastNotifications.success.created("Item Naam")
- toastNotifications.success.updated("Item Naam")
- toastNotifications.success.deleted("Item Naam")
- toastNotifications.success.submitted("Form Naam")
- toastNotifications.success.saved("Item Naam")
- toastNotifications.success.approved("Request Naam")
- toastNotifications.success.marked("Status")

ERROR NOTIFICATIONS (Copy & Use):
- toastNotifications.error.login("message")
- toastNotifications.error.logout("message")
- toastNotifications.error.creation("Item Naam", "message")
- toastNotifications.error.update("Item Naam", "message")
- toastNotifications.error.deletion("Item Naam", "message")
- toastNotifications.error.submission("Form Naam", "message")
- toastNotifications.error.network()
- toastNotifications.error.required()
- toastNotifications.error.unauthorized()

HELPER FUNCTIONS:
- toastNotifications.handleApiSuccess("Title", "Description")
- toastNotifications.handleApiError(error, "Custom message")

CUSTOM TOAST (if needed):
import { toast } from "sonner";
- toast.success("Title", { description: "Message" })
- toast.error("Title", { description: "Message" })
- toast.warning("Title", { description: "Message" })
- toast.info("Title", { description: "Message" })
*/

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

/*
Use this checklist when implementing toast notifications in each module:

ADMIN MODULE:
- [ ] Student Management (Create, Update, Delete)
- [ ] Attendance (Submit, Approve)
- [ ] Fees (Collect, Discount, Refund)
- [ ] Examination (Create, Publish, Upload Results)
- [ ] Teacher Management (Add, Update, Delete)
- [ ] Settings (Save Changes)

TEACHER MODULE:
- [ ] Create Assignment
- [ ] Submit Attendance
- [ ] Update Grades
- [ ] Create Lesson Plan
- [ ] Send Messages

STUDENT MODULE:
- [ ] Submit Assignment
- [ ] View Attendance
- [ ] Check Grades
- [ ] Enroll Courses
- [ ] Request Certificate

PARENT MODULE:
- [ ] View Fees
- [ ] Make Payment
- [ ] Check Attendance
- [ ] View Results
- [ ] Send Messages

LIBRARIAN MODULE:
- [ ] Add/Update Books
- [ ] Issue Books
- [ ] Accept Returns
- [ ] Manage Fines

HR MODULE:
- [ ] Manage Staff
- [ ] Process Payroll
- [ ] Approve Leave
- [ ] Manage Attendance

ACCOUNTANT MODULE:
- [ ] Record Income
- [ ] Record Expenses
- [ ] Generate Reports
*/

export {}; // This is a reference file, not executable code
