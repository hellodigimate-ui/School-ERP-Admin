# Toast Notifications Guide

## Overview
This guide explains how to use toast notifications throughout the School Management System. Toast notifications provide feedback to users for actions like form submissions, successful uploads, errors, and more.

## Setup (Already Done ✓)
- ✓ Toaster component added to `app/layout.tsx`
- ✓ Toast notifications utility created at `utils/toastNotifications.ts`
- ✓ Position: Top-right corner
- ✓ Rich colors enabled for different notification types

## Import Statement
```typescript
// For using pre-built notifications
import { toastNotifications } from "@/utils/toastNotifications";

// For custom notifications (if needed)
import { toast } from "sonner";
```

## Usage Examples

### 1. Login/Authentication

#### Success
```typescript
toastNotifications.success.login();
// Shows: "Login Successful - Welcome back! You are logged in successfully."
```

#### Error
```typescript
toastNotifications.error.login("Invalid credentials");
// Shows: "Login Failed - Invalid credentials"
```

#### Logout
```typescript
toastNotifications.success.logout();
// Shows: "Logout Successful - You have been logged out successfully."
```

### 2. Create Operations

#### Success
```typescript
toastNotifications.success.created("Student");
// Shows: "Student Created - Student has been created successfully."
```

#### Error
```typescript
toastNotifications.error.creation("Student", "Email already exists");
// Shows: "Failed to Create Student - Email already exists"
```

### 3. Update Operations

#### Success
```typescript
toastNotifications.success.updated("Student Profile");
// Shows: "Student Profile Updated - Student Profile has been updated successfully."
```

#### Error
```typescript
toastNotifications.error.update("Student Profile", "Failed to save changes");
// Shows: "Failed to Update Student Profile - Failed to save changes"
```

### 4. Delete Operations

#### Success
```typescript
toastNotifications.success.deleted("Student Record");
// Shows: "Student Record Deleted - Student Record has been deleted successfully."
```

#### Error
```typescript
toastNotifications.error.deletion("Student Record", "Cannot delete active student");
// Shows: "Failed to Delete Student Record - Cannot delete active student"
```

### 5. Form Submissions

#### Success
```typescript
toastNotifications.success.submitted("Attendance Form");
// Shows: "Attendance Form Submitted - Attendance Form has been submitted successfully."
```

#### Error
```typescript
toastNotifications.error.submission("Attendance Form", "Please fill all required fields");
// Shows: "Failed to Submit Attendance Form - Please fill all required fields"
```

### 6. Save Operations (Auto-save, Drafts, etc.)

#### Success
```typescript
toastNotifications.success.saved("Changes");
// Shows: "Changes Saved - Changes have been saved successfully."
```

### 7. Approval Operations

#### Success
```typescript
toastNotifications.success.approved("Leave Request");
// Shows: "Leave Request Approved - Leave Request has been approved successfully."
```

### 8. Status Marking

#### Success (Mark as Approved/Rejected/Pending)
```typescript
toastNotifications.success.marked("Approved");
// Shows: "Marked as Approved - Item has been marked as Approved successfully."
```

### 9. Network Errors

```typescript
toastNotifications.error.network();
// Shows: "Network Error - Failed to connect to the server..."
```

### 10. Validation Errors

```typescript
toastNotifications.error.required();
// Shows: "Missing Required Fields - Please fill in all required fields before submitting."
```

### 11. Authorization Errors

```typescript
toastNotifications.error.unauthorized();
// Shows: "Unauthorized - You don't have permission to perform this action."
```

## Custom Notifications

For situations not covered by pre-built options, use the custom helper functions:

```typescript
// Custom success
toastNotifications.handleApiSuccess("Fees Collected", "Rs. 5000 collected successfully");

// Custom error
toastNotifications.handleApiError(error, "Failed to collect fees");
```

Or use Sonner directly:

```typescript
import { toast } from "sonner";

// Success
toast.success("Title", {
  description: "Your custom message here",
});

// Error
toast.error("Title", {
  description: "Your error message here",
});

// Warning
toast.warning("Title", {
  description: "Your warning message here",
});

// Info
toast.info("Title", {
  description: "Your info message here",
});
```

## Common Use Cases by Module

### Admin Module
- [x] Login: `toastNotifications.success.login()` / `toastNotifications.error.login(message)`
- Student Management: 
  - Create: `toastNotifications.success.created("Student")`
  - Update: `toastNotifications.success.updated("Student Records")`
  - Delete: `toastNotifications.success.deleted("Student Record")`
- Attendance:
  - Submit: `toastNotifications.success.submitted("Attendance")`
- Fees:
  - Collect: `toastNotifications.success.submitted("Fee Collection")`
  - Discount: `toastNotifications.success.updated("Discount")`

### Teacher Module
- Assignments:
  - Create: `toastNotifications.success.created("Assignment")`
  - Submit: `toastNotifications.success.submitted("Assignment")`
- Attendance:
  - Submit: `toastNotifications.success.submitted("Attendance")`
- Lesson Plans:
  - Save: `toastNotifications.success.saved("Lesson Plan")`

### Student Module
- Assignments:
  - Submit: `toastNotifications.success.submitted("Assignment")`
- Results:
  - View: Success notification optional
- Courses:
  - Enroll: `toastNotifications.success.updated("Course Enrollment")`

### Librarian Module
- Book Management:
  - Add: `toastNotifications.success.created("Book")`
  - Update: `toastNotifications.success.updated("Book")`
  - Delete: `toastNotifications.success.deleted("Book")`
- Issue/Return:
  - Issue: `toastNotifications.success.submitted("Book Issue")`
  - Return: `toastNotifications.success.updated("Book Return")`

### HR Module
- Staff:
  - Add: `toastNotifications.success.created("Staff Member")`
  - Update: `toastNotifications.success.updated("Staff Details")`
- Leave Approval:
  - Approve: `toastNotifications.success.approved("Leave Request")`
  - Reject: `toastNotifications.success.marked("Rejected")`
- Payroll:
  - Process: `toastNotifications.success.submitted("Payroll")`

## Implementation Pattern

Here's a typical pattern for handling form submissions:

```typescript
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Validate
    if (!email || !password) {
      toastNotifications.error.required();
      return;
    }

    // API call
    const response = await axiosInstance.post("/api/endpoint", data);

    // Handle response
    if (response.data.success) {
      toastNotifications.success.created("Item");
      // Redirect or refresh data
      router.push("/next-page");
    } else {
      toastNotifications.error.creation("Item", response.data.message);
    }
  } catch (error: any) {
    toastNotifications.handleApiError(error, "Failed to perform action");
  }
};
```

## Notification Types & Colors

| Type | Color | Use Cases |
|------|-------|-----------|
| Success | Green | ✓ Successful operations |
| Error | Red | ✗ Failed operations, errors |
| Warning | Yellow | ⚠ Confirmations, unsaved changes |
| Info | Blue | ℹ Processing, loading states |

## Best Practices

1. **Be Specific**: Use descriptive messages that explain what happened
   ```typescript
   // Good
   toastNotifications.error.login("Email not found");
   
   // Bad
   toast.error("Error");
   ```

2. **Keep Messages Short**: Users should understand quickly
   ```typescript
   // Good
   toastNotifications.success.created("Student");
   
   // Bad
   toast.success("Student Creation Successful", {
     description: "The new student record has been created in the database system and is now available for all operations.",
   });
   ```

3. **Use Consistent Terminology**: Align with your app's language
   - "Submitted" for forms
   - "Saved" for auto-save or draft saves
   - "Created" for new records
   - "Updated" for edits
   - "Deleted" for removals

4. **Show Errors from API**: When API returns error messages
   ```typescript
   toastNotifications.error.login(response.data.message);
   ```

5. **Handle Loading States**: Use info notifications for long operations
   ```typescript
   toastNotifications.info.processing("Attendance Report");
   ```

## File Organization

- **Toast Configuration**: `app/layout.tsx` (Toaster component)
- **Toast Utilities**: `utils/toastNotifications.ts`
- **Usage Examples**: All pages/components that handle user actions

## Troubleshooting

**Toast not showing:**
- Ensure `<Toaster position="top-right" richColors />` is in layout.tsx
- Check that Sonner is installed: `npm list sonner`

**Wrong position:**
- Modify `position` prop in `app/layout.tsx`
- Options: `top-right`, `top-center`, `top-left`, `bottom-right`, `bottom-center`, `bottom-left`

**Colors not showing:**
- Ensure `richColors` prop is present in Toaster component
- Check Tailwind CSS is properly configured

## Next Steps

Apply these toast notifications to:
1. ✓ Login page
2. Admin dashboard - CRUD operations
3. Student management
4. Fees collection
5. Attendance marking
6. Results upload
7. Assignment submission
8. All forms with user interactions

Happy notifications! 🎉
