"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;

  type: string;
  principalName: string;
  studentCount: number;
  teacherCount: number;
  status: "active" | "inactive" | "pending";
  logo: string;
}

interface UpdateModalProps {
  editSchool: any;
  setEditSchool: any;
  isEditOpen: boolean;
  setIsEditOpen: any;
  setSchools: any;
  editingSchoolId: any;
}

export const UpdateModal = ({
  editSchool,
  setEditSchool,
  isEditOpen,
  setIsEditOpen,
  setSchools,
  editingSchoolId,
}: UpdateModalProps) => {
  const updateSchool = async (id: number, data: Partial<School>) => {
    const res = await axiosInstance.put(`/api/v1/schools/${id}`, data);
    const updated = res.data.data;

    setSchools((prev: any[]) =>
      prev.map((s: any) => (s.id === id ? updated : s)),
    );

    toast.success("School updated successfully");
  };

  return null;
};
