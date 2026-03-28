/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ProfileSettings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ─── Fetch Profile ─────────────────────────────
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/users/me", {
        withCredentials: true,
      });

      setProfile(res.data.data);
      setPreview(res.data.data.avatar);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Handle Image ─────────────────────────────
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ─── Save Profile ─────────────────────────────
  const handleSave = async () => {
    try {
      if (!profile?.name) {
        return toast.error("Name is required");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", profile.name);

      if (image) {
        formData.append("file", image);
      }

      await axiosInstance.put("/api/v1/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ───────────────────────────────────────
  return (
    <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="text-sm opacity-90">
          Update your personal information and profile picture
        </p>
      </div>

      <CardContent className="space-y-8 p-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-indigo-100 shadow-md">
              <AvatarImage src={preview || ""} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <div className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 rounded-full shadow">
              <Upload className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              className="hidden"
              onChange={handleImageChange}
            />

            <label htmlFor="avatarUpload">
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-indigo-200 hover:bg-indigo-50"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4" />
                  Change Photo
                </span>
              </Button>
            </label>

            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <Separator />

        {/* Name */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={profile?.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="rounded-xl bg-gray-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {loading ? "Updating..." : "Ready"}
          </p>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 shadow-md"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}