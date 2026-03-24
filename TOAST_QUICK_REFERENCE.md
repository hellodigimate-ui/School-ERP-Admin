# 🎉 Toast Notifications - Quick Reference Card

## Setup Status: ✅ COMPLETE

### ✓ Already Done
- Toaster component added to `app/layout.tsx`
- Toast utility file created at `utils/toastNotifications.ts`  
- Login page updated with toast notifications
- Position: Top-right | Rich colors: Enabled

---

## 🚀 Quick Start - Copy & Paste

### Import
```typescript
import { toastNotifications } from "@/utils/toastNotifications";
```

### Success Notifications
```typescript
// Login/Logout
toastNotifications.success.login();
toastNotifications.success.logout();

// CRUD Operations
toastNotifications.success.created("Student");
toastNotifications.success.updated("Student Name");
toastNotifications.success.deleted("Record");

// Forms & Data
toastNotifications.success.submitted("Form Name");
toastNotifications.success.saved("Changes");

// Approval
toastNotifications.success.approved("Request");
toastNotifications.success.marked("Status");
```

### Error Notifications
```typescript
// Login/Logout Errors
toastNotifications.error.login("Invalid credentials");
toastNotifications.error.logout("Failed to logout");

// CRUD Errors
toastNotifications.error.creation("Student", "Email already exists");
toastNotifications.error.update("Record", "Unable to update");
toastNotifications.error.deletion("Record", "Cannot delete active item");

// Form Errors
toastNotifications.error.submission("Form", "Required fields missing");

// General Errors
toastNotifications.error.network();
toastNotifications.error.required();
toastNotifications.error.unauthorized();
```

### Helper Functions
```typescript
// For API success
toastNotifications.handleApiSuccess("Title", "Description");

// For API errors
toastNotifications.handleApiError(error, "Fallback message");
```

---

## 💡 Common Patterns

### Pattern 1: Form Submission
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name) {
    toastNotifications.error.required();
    return;
  }
  
  try {
    const res = await api.post("/endpoint", formData);
    if (res.data.success) {
      toastNotifications.success.created("Item");
    } else {
      toastNotifications.error.creation("Item", res.data.message);
    }
  } catch (error) {
    toastNotifications.handleApiError(error);
  }
};
```

### Pattern 2: Delete with Confirmation
```typescript
const handleDelete = async (id) => {
  if (!confirm("Are you sure?")) return;
  
  try {
    const res = await api.delete(`/items/${id}`);
    if (res.data.success) {
      toastNotifications.success.deleted("Item");
    } else {
      toastNotifications.error.deletion("Item", res.data.message);
    }
  } catch (error) {
    toastNotifications.handleApiError(error);
  }
};
```

### Pattern 3: File Upload
```typescript
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const res = await api.post("/upload", formData);
    if (res.data.success) {
      toastNotifications.success.submitted("Assignment");
    }
  } catch (error) {
    toastNotifications.handleApiError(error);
  }
};
```

---

## 📋 Module Implementation Checklist

### Admin
- [ ] Student Management (Add/Edit/Delete)
- [ ] Attendance Submit
- [ ] Fee Collection
- [ ] Settings Save
- [ ] Bulk Operations

### Teacher
- [ ] Assignment Creation
- [ ] Attendance Submit
- [ ] Grade Upload
- [ ] Lesson Plan Save
- [ ] Message Send

### Student
- [ ] Assignment Submit
- [ ] Course Enrollment
- [ ] Profile Update
- [ ] Document Upload
- [ ] Message Send

### Parent
- [ ] Fee Payment
- [ ] Complaint Submit
- [ ] Request Send
- [ ] Profile Update
- [ ] Message Send

### Librarian
- [ ] Book Add/Edit/Delete
- [ ] Book Issue
- [ ] Book Return
- [ ] Fine Collection
- [ ] Report Generate

### HR
- [ ] Staff Add/Edit/Delete
- [ ] Leave Approve/Reject
- [ ] Payroll Process
- [ ] Attendance Mark
- [ ] Report Generate

---

## 🎨 Toast Types

| Type | Color | Use Case |
|------|-------|----------|
| ✅ Success | Green | Successful operations |
| ❌ Error | Red | Failed operations |
| ⚠️ Warning | Yellow | Confirmations |
| ℹ️ Info | Blue | Processing/Loading |

---

## 📁 Files to Reference

1. **Utility File**: [utils/toastNotifications.ts](utils/toastNotifications.ts)
   - Pre-built notification functions
   - Helper methods for API errors/success

2. **Documentation**: [TOAST_NOTIFICATIONS_GUIDE.md](TOAST_NOTIFICATIONS_GUIDE.md)
   - Detailed explanation of each function
   - Module-specific use cases

3. **Implementation Examples**: [TOAST_IMPLEMENTATION_EXAMPLES.tsx](TOAST_IMPLEMENTATION_EXAMPLES.tsx)
   - 12 different use case examples
   - Copy-paste ready code

4. **Working Example**: [EXAMPLE_COMPONENT_WITH_TOAST.tsx](EXAMPLE_COMPONENT_WITH_TOAST.tsx)
   - Complete component example
   - Student management CRUD with toast

5. **Login Page**: [app/login/page.tsx](app/login/page.tsx)
   - Real implementation reference
   - Success & error handling

6. **Main Layout**: [app/layout.tsx](app/layout.tsx)
   - Toaster component setup

---

## ⚡ Using with Sonner Directly (Advanced)

If you need custom toasts beyond the utility:

```typescript
import { toast } from "sonner";

// Success
toast.success("Title", {
  description: "Your message here",
});

// Error
toast.error("Title", {
  description: "Error message here",
});

// Warning
toast.warning("Title", {
  description: "Warning message here",
});

// Info
toast.info("Title", {
  description: "Info message here",
});
```

---

## 🐛 Troubleshooting

**Toast not showing?**
- ✓ Check Toaster is in layout.tsx
- ✓ Check component has "use client"
- ✓ Check import path

**Wrong import?**
- ❌ `import { toast } from "@/hooks/use-toast";` (Old hook)
- ✅ `import { toastNotifications } from "@/utils/toastNotifications";`

**Want to customize?**
- Edit `utils/toastNotifications.ts`
- Add new functions following the same pattern
- Update this guide with your changes

---

## 🎯 Key Takeaways

1. **Import once**: `import { toastNotifications } from "@/utils/toastNotifications";`
2. **Use pre-built functions**: They handle titles, descriptions, and formatting
3. **Support API messages**: Pass error messages from API to toast functions
4. **Handle errors properly**: Always use try-catch with fallback messages
5. **Validate first**: Check required fields before API calls

---

## 📞 Need More Info?

- Detailed Guide: [TOAST_NOTIFICATIONS_GUIDE.md](TOAST_NOTIFICATIONS_GUIDE.md)
- Code Examples: [TOAST_IMPLEMENTATION_EXAMPLES.tsx](TOAST_IMPLEMENTATION_EXAMPLES.tsx)
- Working Component: [EXAMPLE_COMPONENT_WITH_TOAST.tsx](EXAMPLE_COMPONENT_WITH_TOAST.tsx)

---

**Last Updated**: March 3, 2026 | Version 1.0 ✨
