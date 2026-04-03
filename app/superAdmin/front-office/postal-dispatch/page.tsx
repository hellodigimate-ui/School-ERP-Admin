/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { useBranchContext } from "@/context/BranchContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

// const records = [
//   { id: 1, to: "CBSE Regional Office", refNo: "VBS/2026/001", date: "2026-02-12", from: "Principal", type: "Official", note: "Annual affiliation documents" },
//   { id: 2, to: "District Education Officer", refNo: "VBS/2026/002", date: "2026-02-11", from: "Admin", type: "Government", note: "Student enrollment data" },
//   { id: 3, to: "Parent - Mr. Verma", refNo: "VBS/2026/003", date: "2026-02-10", from: "Class Teacher", type: "Letter", note: "Student progress report" },
// ];

interface DispatchRecord {
  id: string;
  senderName: string;
  receiverName: string;
  receivedDate: string;
  refrenceNo: string;
  type: string;
  note: string;
  branchId?: string;
}

const API_BASE = "/api/v1/postal";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [formData, setFormData] = useState<Partial<DispatchRecord>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  const { selectedBranch, selectedBranchId } = useBranchContext();
  const isGlobalBranchSelected =
    selectedBranch !== null && selectedBranch !== "all";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /** Fetch all dispatch records */
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}`, {
        params: {
          type: "DISPATCH",
          page,
          perPage,
          name: search,
          branchId:
            isGlobalBranchSelected && selectedBranchId
              ? selectedBranchId
              : branchFilter === "all"
                ? undefined
                : branchFilter,
        },
      });

      if (res.data.success) {
        setRecords(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch dispatch records:", err);
    }
  };

  /** Handle input changes */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await axiosInstance.get("/api/v1/branches?perPage=100");
      setBranches(res.data.data || []);
    } catch (err) {
      console.error("Failed to load branches:", err);
    } finally {
      setLoadingBranches(false);
    }
  };

  /** Save or update dispatch record */
  const handleSave = async () => {
    const payload = {
      senderName: formData.senderName || "",
      receiverName: formData.receiverName || "",
      receivedDate: new Date(formData.receivedDate!).toISOString(),
      refrenceNo: formData.refrenceNo || "",
      note: formData.note || "",
      type: "DISPATCH",
      branchId: formData.branchId || undefined,
    };

    if (!payload.senderName || !payload.receiverName || !payload.receivedDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isEditing && formData.id) {
        await axiosInstance.put(`${API_BASE}/${formData.id}`, payload);
      } else {
        await axiosInstance.post(`${API_BASE}`, payload);
      }
      setOpen(false);
      setFormData({});
      setIsEditing(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to save dispatch record:", err);
    }
  };

  /** Edit record */
  const handleEdit = (record: DispatchRecord) => {
    setFormData({ ...record, branchId: record.branchId || "" });
    setIsEditing(true);
    setOpen(true);
  };

  /** Delete record */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dispatch record?"))
      return;
    try {
      await axiosInstance.delete(`${API_BASE}/${id}`);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete dispatch record:", err);
    }
  };

  /** Export records */
  const handleExport = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/report`, {
        params: { type: "DISPATCH" },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `postal_dispatch_report_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export dispatch report:", err);
      alert("Failed to export report. Please try again.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, search, branchFilter, selectedBranchId]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div
          className="relative flex flex-col md:flex-row md:items-center 
                        justify-between gap-6 mb-8 p-6 rounded-3xl 
                        bg-gradient-to-r from-primary/10 via-background to-purple-500/10 
                        border shadow-xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 blur-3xl rounded-full opacity-40"></div>

          {/* Header */}
          <div className="relative">
            <h1
              className="text-3xl font-bold font-display tracking-tight 
                        bg-gradient-to-r from-primary to-purple-500 
                        bg-clip-text text-transparent"
            >
              Postal Dispatch
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Track all outgoing postal mail and dispatches
            </p>
          </div>

          {/* Add Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 px-6 h-11 rounded-xl 
                                    bg-gradient-to-r from-primary to-purple-500
                                    hover:from-primary/90 hover:to-purple-500/90
                                    text-white shadow-lg hover:shadow-xl
                                    hover:scale-[1.04] transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                {isEditing ? "Edit Dispatch" : "Add Dispatch"}
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-2xl rounded-3xl p-8 
                                    bg-background/80 backdrop-blur-xl 
                                    border shadow-2xl"
            >
              <DialogHeader className="space-y-2">
                <DialogTitle
                  className="text-2xl font-semibold 
                                            bg-gradient-to-r from-primary to-purple-500 
                                            bg-clip-text text-transparent"
                >
                  {isEditing ? "Edit Postal Dispatch" : "Add Postal Dispatch"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in the details of the outgoing dispatch
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {/* To Title */}
                <div className="space-y-2">
                  <Label>To Title *</Label>
                  <Input
                    name="receiverName"
                    value={formData.receiverName || ""}
                    onChange={handleInputChange}
                    placeholder="Receiver name"
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                                focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* Reference No */}
                <div className="space-y-2">
                  <Label>Reference No</Label>
                  <Input
                    name="refrenceNo"
                    value={formData.refrenceNo || ""}
                    onChange={handleInputChange}
                    placeholder="Reference number"
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                                    focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* From */}
                <div className="space-y-2">
                  <Label>From (Person/Dept) *</Label>
                  <Input
                    name="senderName"
                    value={formData.senderName || ""}
                    onChange={handleInputChange}
                    placeholder="Sender"
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                                    focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    name="receivedDate"
                    type="date"
                    value={
                      formData.receivedDate
                        ? formData.receivedDate.slice(0, 11)
                        : ""
                    }
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-purple-500/5 border-purple-400/30
                                    focus-visible:ring-2 focus-visible:ring-purple-400/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select
                    value={formData.branchId || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, branchId: value }))
                    }
                  >
                    <SelectTrigger className="rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/40 border border-border">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingBranches ? (
                        <SelectItem value="loading" disabled>
                          Loading branches...
                        </SelectItem>
                      ) : branches.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No branches
                        </SelectItem>
                      ) : (
                        branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Note */}
                <div className="col-span-full space-y-2">
                  <Label>Note</Label>
                  <Textarea
                    name="note"
                    value={formData.note || ""}
                    onChange={handleInputChange}
                    placeholder="Add additional details..."
                    className="rounded-xl min-h-[110px] bg-muted/40 
                                    border-primary/20 focus-visible:ring-2 
                                    focus-visible:ring-primary/40"
                  />
                </div>

                {/* Actions */}
                <div className="col-span-full flex justify-end gap-3 pt-6 border-t mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="rounded-xl h-11 px-6"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSave}
                    className="rounded-xl h-11 px-6 text-white
                                    bg-gradient-to-r from-primary to-purple-500
                                    hover:from-primary/90 hover:to-purple-500/90
                                    shadow-md hover:shadow-lg hover:scale-[1.03]
                                    transition-all duration-200"
                  >
                    Save Dispatch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Export */}
        <Card
          className="relative overflow-hidden border-0 rounded-3xl 
                        bg-gradient-to-br from-background via-background to-purple-500/10
                        shadow-2xl"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/20 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>

          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 
                                        w-4 h-4 text-muted-foreground 
                                        group-focus-within:text-purple-500 
                                        transition-colors duration-200"
                />

                <Input
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search dispatches..."
                  className="pl-9 h-11 rounded-xl 
                                    bg-background/70 backdrop-blur 
                                    border-purple-400/20
                                    focus-visible:ring-2 
                                    focus-visible:ring-purple-400/40
                                    focus-visible:border-purple-400
                                    transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="min-w-[220px]">
                <Label className="text-xs text-muted-foreground">Branch</Label>
                <Select
                  value={
                    isGlobalBranchSelected
                      ? (selectedBranchId ?? "all")
                      : branchFilter
                  }
                  onValueChange={(value) => {
                    if (!isGlobalBranchSelected) {
                      setPage(1);
                      setBranchFilter(value);
                    }
                  }}
                  disabled={isGlobalBranchSelected}
                >
                  <SelectTrigger className="rounded-xl w-full bg-background/70 focus:ring-2 focus:ring-purple-400/40">
                    <SelectValue placeholder="All Branches" />
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
              </div>

              {/* Export Button */}
              <Button
                className="gap-2 h-11 px-6 rounded-xl text-white
                                bg-gradient-to-r from-primary to-purple-500
                                hover:from-primary/90 hover:to-purple-500/90
                                shadow-md hover:shadow-lg 
                                hover:scale-[1.03]
                                transition-all duration-200"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Table */}
        <Card
          className="border-0 rounded-3xl overflow-hidden
                        bg-gradient-to-br from-background via-background to-purple-500/5
                        shadow-2xl"
        >
          <CardContent className="p-0">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow
                  className="bg-gradient-to-r 
                                    from-primary/10 via-muted/40 to-purple-500/10 
                                    backdrop-blur"
                >
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">To</TableHead>
                  <TableHead className="font-semibold">Reference No</TableHead>
                  <TableHead className="font-semibold">From</TableHead>
                  <TableHead className="font-semibold">Branch</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Note</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {records.map((r, index) => (
                  <TableRow
                    key={r.id}
                    className="group transition-all duration-200
                            hover:bg-purple-500/5 hover:shadow-md
                            even:bg-muted/20"
                  >
                    {/* ID */}
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    {/* To */}
                    <TableCell className="font-semibold text-foreground">
                      {r.receiverName}
                    </TableCell>

                    {/* Reference */}
                    <TableCell>
                      <span
                        className="text-xs font-semibold
                                    bg-gradient-to-r from-primary/20 to-purple-400/20
                                    text-primary px-3 py-1 rounded-full"
                      >
                        {r.refrenceNo}
                      </span>
                    </TableCell>

                    {/* From */}
                    <TableCell className="text-muted-foreground">
                      {r.senderName}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {branches.find((branch) => branch.id === r.branchId)
                        ?.name ||
                        r.branchId ||
                        "-"}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-muted-foreground">
                      {new Date(r.receivedDate).toISOString().slice(0, 10)}
                    </TableCell>

                    {/* Type Badge */}
                    <TableCell>
                      <Badge
                        className="rounded-full px-3 py-1 text-xs font-semibold
                                bg-purple-500/10 text-purple-600
                                border border-purple-500/20"
                      >
                        {r.type}
                      </Badge>
                    </TableCell>

                    {/* Note */}
                    <TableCell
                      className="max-w-[220px] truncate 
                                        text-muted-foreground text-xs"
                    >
                      {r.note}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(r)}
                          className="h-9 w-9 rounded-xl
                                    hover:bg-primary/10 hover:text-primary
                                    transition-all duration-200
                                    hover:scale-110"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r.id)}
                          className="h-9 w-9 rounded-xl
                                    hover:bg-red-500/10 hover:text-red-500
                                    transition-all duration-200
                                    hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
