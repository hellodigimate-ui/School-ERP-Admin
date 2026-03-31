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
} from "@/components/ui/dialog";

import { GraduationCap,  Search,  Eye } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ScholarshipTypes() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const handleView = (item: any) => {
    setViewData(item);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setTimeout(() => setViewData(null), 200); // smooth reset
  };



  // ================= FETCH =================
  const fetchScholarships = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await axiosInstance.get(`/api/v1/scholarships?${params}`);

      const json = res.data;

      if (json.success) {
        setList(json.data);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [page, search]);


  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="text-primary" />
        <h2 className="text-xl font-semibold">Scholarship Types</h2>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Add Scholarship</DialogTitle>

            <div className="space-y-3 mt-3">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <Button onClick={handleCreate} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No data found
                </td>
              </tr>
            ) : (
              list.map((item, i) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">
                    {item.type === "PERCENTAGE"
                      ? `${item.value}%`
                     : `₹ ${item.value}`}
                  </td>

                  <td className="p-3">
                    <Badge
                      className={
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-center gap-2">
                      <Eye
                        onClick={() => handleView(item)}
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                      />
                      {/* <Pencil
                        onClick={() => openEdit(item)}
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => handleDelete(item.id)}
                        className="w-4 h-4 text-red-500 cursor-pointer"
                      /> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 👁 VIEW MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="rounded-2xl max-w-md">

          <DialogTitle className="text-lg font-semibold">
            Scholarship Details
          </DialogTitle>

          {viewData && (
            <div className="space-y-4 mt-3 text-sm">

              {/* TOP CARD */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-bold">{viewData.name}</h2>
                <p className="opacity-80">
                  {viewData.type === "PERCENTAGE"
                    ? `${viewData.value}% Scholarship`
                    : `₹ ${viewData.value} Scholarship`}
                </p>
              </div>

              {/* DETAILS */}
              <div className="space-y-2">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{viewData.type}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>
                    {viewData.type === "PERCENTAGE"
                      ? `${viewData.value}%`
                      : `₹ ${viewData.value}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={
                      viewData.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {viewData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span>{viewData.id}</span>
                </div> */}
              </div>

              {/* ACTION */}
              <Button onClick={closeView} className="w-full mt-3">
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

        <span className="px-2 py-1 text-sm">
          Page {page} / {totalPages}
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
