import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useState, useEffect } from "react";

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

interface UseBranchesReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  selectedBranch: Branch | "all" | null;
  setSelectedBranch: (branch: Branch | "all" | null) => void;
}

export const useBranches = (): UseBranchesReturn => {
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

        // if (!response.success) {
        //   throw new Error("Failed to fetch branches");
        // }

        const data = response.data;

        if (data.success) {
          setBranches(data.data);
          // Don't auto-select first branch - let user choose
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

  return {
    branches,
    loading,
    error,
    selectedBranch,
    setSelectedBranch,
  };
};
