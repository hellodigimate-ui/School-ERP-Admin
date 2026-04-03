/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ─── Handle Change ─────────────────────────────
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Submit ───────────────────────────────────
  const handleSubmit = async () => {
    try {
      // 🔥 Validation
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        return toast.error("All fields are required");
      }

      if (form.newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }

      if (form.newPassword !== form.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      setLoading(true);

      await axiosInstance.put(
        "/api/v1/admin/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { withCredentials: true },
      );

      toast.success("Password updated successfully");

      // Reset form
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ───────────────────────────────────────
  return (
    <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
        <h2 className="text-xl font-semibold">Password & Authentication</h2>
        <p className="text-sm opacity-90">Update your password securely</p>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label>Current Password</Label>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            placeholder="Enter current password"
            className="rounded-xl bg-gray-50"
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            placeholder="Enter new password"
            className="rounded-xl bg-gray-50"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirm new password"
            className="rounded-xl bg-gray-50"
          />
        </div>

        <Separator />

        {/* Action */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 shadow-md"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}