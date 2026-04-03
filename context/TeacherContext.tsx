/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

type Teacher = {
  name: string;
  avatar: string;
  email?: string;
};

type ContextType = {
  teacher: Teacher;
  loading: boolean;
  fetchTeacher: () => Promise<void>;
};

const TeacherContext = createContext<ContextType | null>(null);

export const TeacherProvider = ({ children }: any) => {
  const [teacher, setTeacher] = useState<Teacher>({
    name: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/teacher/profile");
      const profile = res?.data?.data ?? {};

      setTeacher({
        name: profile?.name ?? "Teacher",
        avatar: profile?.avatar ?? "",
        email: profile?.email ?? "",
      });
    } catch (err) {
      console.log("Fallback teacher profile");
      setTeacher({
        name: "Teacher",
        avatar: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <TeacherContext.Provider value={{ teacher, loading, fetchTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used inside TeacherProvider");
  }
  return context;
};