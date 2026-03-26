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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus,  Pencil, Trash2 } from "lucide-react";
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

  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [branches, setBranches] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    minPercentage: "",
    category: "",
    incomeLimit: "",
    branchId: "",
    class: "",
    disability: "N/A",
  });

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

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await axiosInstance.post("/api/v1/scholarships/criteria", form);

      setShowDialog(false);
      setForm({
        name: "",
        minPercentage: "",
        category: "",
        incomeLimit: "",
        class: "",
        branchId: "",
        disability: "N/A",
      });

      fetchCriteria();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!selected) return;

    try {
      await axiosInstance.put(
        `/api/v1/scholarships/criteria/${selected.id}`,
        selected,
      );

      setSelected(null);
      fetchCriteria();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this criteria?")) return;

    try {
      await axiosInstance.delete(`/api/v1/scholarships/criteria/${id}`);

      fetchCriteria();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

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

<Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogTrigger asChild>
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add Criteria
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-lg">
    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
      <Plus className="h-5 w-5 text-primary" />
      Add Eligibility
    </DialogTitle>

    <div className="grid grid-cols-2 gap-4 mt-4">

      {/* Name */}
      <div className="col-span-2 space-y-1">
        <label className="text-sm font-medium">Scholarship Name</label>
        <Input
          placeholder="Enter name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Min % */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Minimum Percentage</label>
        <Input
          placeholder="e.g. 75"
          value={form.minPercentage}
          onChange={(e) =>
            setForm({ ...form, minPercentage: e.target.value })
          }
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={form.category}
          onValueChange={(val) => setForm({ ...form, category: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="OBC">OBC</SelectItem>
            <SelectItem value="SC">SC</SelectItem>
            <SelectItem value="ST">ST</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Income */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Income Limit</label>
        <Input
          placeholder="₹ e.g. 200000"
          value={form.incomeLimit}
          onChange={(e) =>
            setForm({ ...form, incomeLimit: e.target.value })
          }
        />
      </div>

      {/* Branch */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Branch</label>
        <Select
          value={form.branchId || "all"}
          onValueChange={(val) =>
            setForm({ ...form, branchId: val, class: "" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Select Branch</SelectItem>

            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Class</label>
        <Select
          value={form.class || "all"}
          onValueChange={(val) =>
            setForm({ ...form, class: val })
          }
          disabled={!form.branchId || form.branchId === "all"}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !form.branchId || form.branchId === "all"
                  ? "Select branch first"
                  : "Select class"
              }
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Select Class</SelectItem>

            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.name}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Disability */}
      <div className="col-span-2 space-y-1">
        <label className="text-sm font-medium">Disability</label>
        <Select
          value={form.disability}
          onValueChange={(val) =>
            setForm({ ...form, disability: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select disability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Required">Required</SelectItem>
            <SelectItem value="N/A">Not Required</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <Button onClick={handleCreate} className="w-full mt-5">
      Create Criteria
    </Button>
  </DialogContent>
</Dialog>
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
              <th className="p-3 text-right">Actions</th>
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
                    <div className="flex justify-end gap-2">
                      <Pencil
                        onClick={() => setSelected(item)}
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => handleDelete(item.id)}
                        className="w-4 h-4 text-red-500 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✏️ EDIT */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Pencil className="h-5 w-5 text-blue-500" />
            Edit Criteria
          </DialogTitle>

          {selected && (
            <div className="grid grid-cols-2 gap-4 mt-4">

              {/* Scholarship Name */}
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Scholarship Name</label>
                <Input
                  placeholder="Enter name"
                  value={selected.name || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, name: e.target.value })
                  }
                />
              </div>

              {/* Min % */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Minimum Percentage</label>
                <Input
                  placeholder="e.g. 75"
                  value={selected.minPercentage || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, minPercentage: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selected.category || ""}
                  onValueChange={(val) =>
                    setSelected({ ...selected, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Income Limit */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Income Limit</label>
                <Input
                  placeholder="₹ e.g. 200000"
                  value={selected.incomeLimit || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, incomeLimit: e.target.value })
                  }
                />
              </div>

              {/* Branch */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Branch</label>
                <Select
                  value={selected.branchId || "all"}
                  onValueChange={(val) =>
                    setSelected({ ...selected, branchId: val, class: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Select Branch</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Class */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Class</label>
                <Select
                  value={selected.class || "all"}
                  onValueChange={(val) =>
                    setSelected({ ...selected, class: val })
                  }
                  disabled={!selected.branchId || selected.branchId === "all"}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selected.branchId || selected.branchId === "all"
                          ? "Select branch first"
                          : "Select class"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Select Class</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Disability */}
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Disability</label>
                <Select
                  value={selected.disability || "N/A"}
                  onValueChange={(val) =>
                    setSelected({ ...selected, disability: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select disability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Required">Required</SelectItem>
                    <SelectItem value="N/A">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Update Button */}
              <Button onClick={handleUpdate} className="col-span-2 mt-5">
                Update Criteria
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
