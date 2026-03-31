/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  Eye } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function EligibilityCriteria() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [classes, setClasses] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<any>(null);

  const [branches, setBranches] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");


  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/classes");

      if (res.data.success) {
        setClasses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");

      if (res.data.success) {
        setBranches(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch branches", err);
    }
  };

useEffect(() => {
  fetchBranches();
}, []);

useEffect(() => {
  if (branchFilter === "all") {
    setClassFilter("all");
  }
}, [branchFilter]);

  // ================= FETCH =================
const fetchCriteria = async () => {
  try {
    setLoading(true);

    const params: any = {
      page: page.toString(),
      perPage: "10",
    };

    if (search) params.name = search;
    if (category && category !== "all") params.category = category;
    if (branchFilter && branchFilter !== "all") params.branchId = branchFilter;
    if (classFilter && classFilter !== "all") params.class = classFilter;

    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString();

    const res = await axiosInstance.get(
      `/api/v1/scholarships/criteria?${queryString}`
    );

    const json = res.data;

    if (json.success) {
      setList(json.data);
      setTotalPages(json.pagination?.totalPages || 1);
    }
  } catch (err) {
    console.error("Fetch criteria failed", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCriteria();
    fetchClasses();
    fetchBranches();
  }, [page, search, category, classFilter]);



  return (
    <div className="space-y-5">
      {/* 🔥 Top Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />


          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>

              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={classFilter}
            onValueChange={setClassFilter}
            disabled={branchFilter === "all"} // ✅ disable here
          >
            <SelectTrigger className="w-40">
              <SelectValue
                placeholder={
                  branchFilter === "all"
                    ? "Select branch first"
                    : "Class"
                }
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>

              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category || "all"} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="OBC">OBC</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="ST">ST</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Min %</th>
              <th className="p-3">Category</th>
              <th className="p-3">Income</th>
              <th className="p-3">Class</th>
              <th className="p-3">Disability</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No data found
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="border-t text-center">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">
                    <Badge>{item.minPercentage || "-"}</Badge>
                  </td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">₹ {item.incomeLimit || "-"}</td>
                  <td className="p-3">{item.class}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        item.disability === "Required"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {item.disability}
                    </Badge>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-center gap-2">
                      <Eye
                        onClick={() => setSelected(item)}
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                      />
                      
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 👁️ VIEW MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-3xl max-w-lg p-0 overflow-hidden">

          {/* 🌈 HEADER */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5">
            <h2 className="text-xl font-bold">{selected?.name}</h2>
            <p className="text-sm opacity-80">
              Scholarship Eligibility Details
            </p>
          </div>

          {selected && (
            <div className="p-5 space-y-4 text-sm">

              {/* 💡 QUICK INFO CARDS */}
              <div className="grid grid-cols-2 gap-3">

                <div className="bg-muted rounded-xl p-3 text-center shadow-sm">
                  <p className="text-muted-foreground text-xs">Minimum %</p>
                  <p className="font-semibold text-lg">
                    {selected.minPercentage || "-"}%
                  </p>
                </div>

                <div className="bg-muted rounded-xl p-3 text-center shadow-sm">
                  <p className="text-muted-foreground text-xs">Income Limit</p>
                  <p className="font-semibold text-lg">
                    ₹ {selected.incomeLimit || "-"}
                  </p>
                </div>
              </div>

              {/* 📋 DETAILS */}
              <div className="space-y-3">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge className="bg-blue-100 text-blue-700">
                    {selected.category}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-medium">{selected.class}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disability</span>
                  <Badge
                    className={
                      selected.disability === "Required"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {selected.disability}
                  </Badge>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="text-xs">{selected.id}</span>
                </div> */}
              </div>

              {/* 🎯 ACTION BUTTON */}
              <Button
                onClick={() => setSelected(null)}
                className="w-full mt-4 rounded-xl"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>



      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>

        <span className="px-2">
          {page} / {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
