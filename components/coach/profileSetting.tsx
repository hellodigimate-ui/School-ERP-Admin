/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Profile {
  name: string;
  avatar: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // ─── Get Initials ─────────────────
  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  // ─── Fetch Profile ─────────────────
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/users/me", {
        withCredentials: true,
      });

      const data = res?.data?.data || res?.data;

      setProfile({
        name: data?.name || "",
        avatar: data?.avatar || "",
      });

      setPreview(data?.avatar || "");
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Image Change ─────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ─── Save Profile ─────────────────
  const handleSave = async () => {
    try {
      if (!profile.name) {
        return toast.error("Name is required");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", profile.name);

      if (image) {
        formData.append("file", image);
      }

      await axiosInstance.put("/api/v1/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully");

      // 🔥 notify sidebar instantly
      window.dispatchEvent(new Event("profileUpdated"));

      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ─────────────────
  return (
    <Card className="border-0 rounded-3xl shadow-xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        <p className="text-sm opacity-90">
          Manage your account information
        </p>
      </div>

      <CardContent className="space-y-10 p-6">

        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          
          <div className="relative group">
            <Avatar className="w-28 h-28 ring-4 ring-indigo-100 dark:ring-gray-700 shadow-lg">
              
              {preview ? (
                <AvatarImage
                  src={preview}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}

              <AvatarFallback className="bg-indigo-500 text-white text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            {/* Hover Upload */}
            <label
              htmlFor="avatarUpload"
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              <Upload className="text-white w-5 h-5" />
            </label>

            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <p className="text-lg font-semibold">
              {profile.name || "Your Name"}
            </p>

            <label htmlFor="avatarUpload">
              <Button
                variant="outline"
                className="rounded-xl border-indigo-200 hover:bg-indigo-50 dark:hover:bg-gray-800"
                asChild
              >
                <span className="cursor-pointer flex gap-2 items-center">
                  <Upload className="w-4 h-4" />
                  Change Photo
                </span>
              </Button>
            </label>

            <p className="text-xs text-muted-foreground">
              JPG, PNG (Max 2MB)
            </p>
          </div>
        </div>

        <Separator />

        {/* Name */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Enter your name"
            className="rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {loading ? "Updating..." : "All changes saved"}
          </p>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 shadow-lg hover:scale-105 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}