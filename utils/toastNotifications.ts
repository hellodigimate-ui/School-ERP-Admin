/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const toastNotifications = {
  // Success notifications
  success: {
    login: () =>
      toast.success("Login Successful", {
        description: "Welcome back! You are logged in successfully.",
      }),
    logout: () =>
      toast.success("Logout Successful", {
        description: "You have been logged out successfully.",
      }),
    created: (item: string = "Item") =>
      toast.success(`${item} Created`, {
        description: `${item} has been created successfully.`,
      }),
    updated: (item: string = "Item") =>
      toast.success(`${item} Updated`, {
        description: `${item} has been updated successfully.`,
      }),
    deleted: (item: string = "Item") =>
      toast.success(`${item} Deleted`, {
        description: `${item} has been deleted successfully.`,
      }),
    submitted: (form: string = "Form") =>
      toast.success(`${form} Submitted`, {
        description: `${form} has been submitted successfully.`,
      }),
    saved: (item: string = "Changes") =>
      toast.success(`${item} Saved`, {
        description: `${item} have been saved successfully.`,
      }),
    approved: (item: string = "Request") =>
      toast.success(`${item} Approved`, {
        description: `${item} has been approved successfully.`,
      }),
    marked: (status: string) =>
      toast.success(`Marked as ${status}`, {
        description: `Item has been marked as ${status} successfully.`,
      }),
  },

  // Error notifications
  error: {
    login: (message?: string) =>
      toast.error("Login Failed", {
        description: message || "Invalid credentials. Please check your email and password.",
      }),
    logout: (message?: string) =>
      toast.error("Logout Failed", {
        description: message || "Failed to logout. Please try again.",
      }),
    creation: (item: string = "Item", message?: string) =>
      toast.error(`Failed to Create ${item}`, {
        description: message || `Unable to create ${item}. Please try again.`,
      }),
    update: (item: string = "Item", message?: string) =>
      toast.error(`Failed to Update ${item}`, {
        description: message || `Unable to update ${item}. Please try again.`,
      }),
    deletion: (item: string = "Item", message?: string) =>
      toast.error(`Failed to Delete ${item}`, {
        description: message || `Unable to delete ${item}. Please try again.`,
      }),
    submission: (form: string = "Form", message?: string) =>
      toast.error(`Failed to Submit ${form}`, {
        description: message || `Unable to submit ${form}. Please try again.`,
      }),
    network: () =>
      toast.error("Network Error", {
        description: "Failed to connect to the server. Please check your internet connection.",
      }),
    required: () =>
      toast.error("Missing Required Fields", {
        description: "Please fill in all required fields before submitting.",
      }),
    unauthorized: () =>
      toast.error("Unauthorized", {
        description: "You don't have permission to perform this action.",
      }),
  },

  // Warning notifications
  warning: {
    noInternet: () =>
      toast.warning("No Internet Connection", {
        description: "Please check your internet connection.",
      }),
    unsavedChanges: () =>
      toast.warning("Unsaved Changes", {
        description: "You have unsaved changes. Please save before leaving.",
      }),
    confirmAction: (action: string) =>
      toast.warning("Confirm Action", {
        description: `Are you sure you want to ${action}? This action cannot be undone.`,
      }),
  },

  // Info notifications
  info: {
    processing: (item: string = "Request") =>
      toast.info(`${item} Processing`, {
        description: `Your ${item.toLowerCase()} is being processed. Please wait...`,
      }),
    loading: (message?: string) =>
      toast.info("Loading", {
        description: message || "Please wait while we load your data...",
      }),
  },
};

// Helper function for API errors
export const handleApiError = (error: any, defaultMessage: string = "Something went wrong") => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage;

  toast.error("Error", {
    description: message,
  });
};

// Helper function for API success
export const handleApiSuccess = (
  title: string,
  description?: string
) => {
  toast.success(title, {
    description: description || "Operation completed successfully.",
  });
};
