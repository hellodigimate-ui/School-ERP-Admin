"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
}

interface BranchContextValue {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  selectedBranch: Branch | "all" | null;
  selectedBranchId: string | null;
  setSelectedBranch: (branch: Branch | "all" | null) => void;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

export const useBranchContext = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranchContext must be used within a BranchProvider");
  }
  return context;
};

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | "all" | null>(
    "all",
  );

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance("/api/v1/branches");
        const data = response.data;
        if (data.success) {
          setBranches(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch branches");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Load saved branch from localStorage on mount
  useEffect(() => {
    const savedBranchId = localStorage.getItem("selectedBranchId");
    if (savedBranchId && branches.length > 0) {
      const savedBranch = branches.find(
        (branch) => branch.id === savedBranchId,
      );
      if (savedBranch) {
        setSelectedBranch(savedBranch);
      }
    }
  }, [branches]);

  const handleSetSelectedBranch = (branch: Branch | "all" | null) => {
    setSelectedBranch(branch);
    if (branch === "all" || !branch) {
      localStorage.removeItem("selectedBranchId");
    } else {
      localStorage.setItem("selectedBranchId", branch.id);
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        loading,
        error,
        selectedBranch,
        selectedBranchId:
          selectedBranch && selectedBranch !== "all" ? selectedBranch.id : null,
        setSelectedBranch: handleSetSelectedBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
