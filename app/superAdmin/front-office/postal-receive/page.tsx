/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Search, Edit, Trash2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useBranchContext } from "@/context/BranchContext";

interface PostalRecord {
  id: string;
  senderName: string;
  receiverName: string;
  receivedDate: string;
  refrenceNo: string;
  note: string;
  branchId?: string;
}

const API_BASE = "/api/v1/postal";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<PostalRecord[]>([]);
  const [formData, setFormData] = useState<Partial<PostalRecord>>({});
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

  /** Fetch all postal records with pagination and search */
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get(API_BASE, {
        params: {
          page,
          perPage,
          name: search,
          type: "RECEIVE",
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
      console.error("Failed to fetch postal records:", err);
    }
  };

  /** Handle input changes */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Save or update postal record */
  const handleSave = async () => {
    const payload = {
      senderName: formData.senderName || "",
      receiverName: formData.receiverName || "",
      receivedDate: new Date(formData.receivedDate!).toISOString(), // ensure full ISO
      refrenceNo: formData.refrenceNo || "",
      note: formData.note || "",
      type: "RECEIVE",
    };

    if (!payload.senderName || !payload.receiverName || !payload.receivedDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isEditing && formData.id) {
        await axiosInstance.put(`${API_BASE}/${formData.id}`, payload);
      } else {
        await axiosInstance.post(API_BASE, payload);
      }
      setOpen(false);
      setFormData({});
      setIsEditing(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to save postal record:", err);
    }
  };

  /** Edit record */
  const handleEdit = (record: PostalRecord) => {
    setFormData({ ...record, branchId: record.branchId || "" });
    setIsEditing(true);
    setOpen(true);
  };

  /** Delete record */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this postal record?")) return;
    try {
      await axiosInstance.delete(`${API_BASE}/${id}`);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete postal record:", err);
    }
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
                        bg-gradient-to-r from-primary/10 via-background to-pink-500/10 
                        border shadow-xl overflow-hidden"
        >
          {/* Decorative Glow Effects */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full opacity-40"></div>

          {/* Header Section */}
          <div className="relative">
            <h1
              className="text-3xl font-bold font-display tracking-tight 
                        bg-gradient-to-r from-primary to-pink-500 
                        bg-clip-text text-transparent"
            >
              Postal Receive
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Manage all received postal mail and documents
            </p>
          </div>

          {/* Add Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="relative gap-2 px-6 h-11 rounded-xl 
                                bg-gradient-to-r from-primary to-pink-500 
                                hover:from-primary/90 hover:to-pink-500/90
                                text-white shadow-lg hover:shadow-xl 
                                hover:scale-[1.04] transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                {isEditing ? "Edit Postal" : "Add Postal"}
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
                                        bg-gradient-to-r from-primary to-pink-500 
                                        bg-clip-text text-transparent"
                >
                  {isEditing ? "Edit Postal Receive" : "Add Postal Receive"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in the details of the received postal mail
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {/* From Title */}
                <div className="space-y-2">
                  <Label>From Title *</Label>
                  <Input
                    placeholder="Sender name"
                    name="senderName"
                    value={formData.senderName || ""}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            transition-all"
                  />
                </div>

                {/* Reference No */}
                <div className="space-y-2">
                  <Label>Reference No</Label>
                  <Input
                    placeholder="Reference number"
                    name="refrenceNo"
                    value={formData.refrenceNo || ""}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* To */}
                <div className="space-y-2">
                  <Label>To (Person/Dept) *</Label>
                  <Input
                    placeholder="Receiver"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-muted/40 border-primary/20
                            focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    name="receivedDate"
                    value={
                      formData.receivedDate
                        ? formData.receivedDate.slice(0, 11)
                        : ""
                    }
                    onChange={handleInputChange}
                    className="h-11 rounded-xl bg-blue-500/5 border-blue-400/30
                            focus-visible:ring-2 focus-visible:ring-blue-400/40"
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
                    placeholder="Add additional details..."
                    name="note"
                    value={formData.note || ""}
                    onChange={handleInputChange}
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
                    className="rounded-xl h-11 px-6 text-white
                            bg-gradient-to-r from-primary to-pink-500
                            hover:from-primary/90 hover:to-pink-500/90
                            shadow-md hover:shadow-lg hover:scale-[1.03]
                            transition-all duration-200"
                    onClick={handleSave}
                  >
                    Save Postal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card
          className="relative overflow-hidden border-0 rounded-3xl shadow-xl 
                        bg-gradient-to-br from-primary/10 via-background to-pink-500/10"
        >
          {/* Decorative Gradient Blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full opacity-40"></div>

          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 
                                w-4 h-4 text-muted-foreground 
                                group-focus-within:text-primary transition-colors duration-200"
                />

                <Input
                  placeholder="Search postal records..."
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  className="pl-9 h-11 rounded-xl border-primary/20 
                            bg-background/70 backdrop-blur
                            focus-visible:ring-2 focus-visible:ring-primary/40
                            focus-visible:border-primary
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
                  <SelectTrigger className="rounded-xl w-full bg-background/70 focus:ring-2 focus:ring-primary/40">
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
                className="gap-2 h-11 px-6 rounded-xl 
                        bg-gradient-to-r from-primary to-pink-500 
                        hover:from-primary/90 hover:to-pink-500/90
                        text-white shadow-md 
                        hover:shadow-lg hover:scale-[1.03]
                        transition-all duration-200"
                onClick={async () => {
                  try {
                    // Fetch the report from backend
                    const res = await axiosInstance.get(
                      "/api/v1/postal/report?type=RECEIVE",
                      {
                        responseType: "blob",
                      },
                    );

                    // Convert to blob for download
                    const blob = new Blob([res.data], {
                      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;

                    // Set a filename (adjust as needed)
                    link.download = `postal_receive_report_${new Date().toISOString().split("T")[0]}.xlsx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Failed to export report:", err);
                    alert("Failed to export report. Please try again.");
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0 rounded-3xl overflow-hidden 
                        bg-gradient-to-br from-background via-background to-primary/5
                        shadow-2xl"
        >
          <CardContent className="p-0">
            <Table>
              {/* Table Header */}
              <TableHeader>
                <TableRow
                  className="bg-gradient-to-r 
                                    from-primary/10 via-muted/40 to-pink-500/10 
                                    backdrop-blur"
                >
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">From</TableHead>
                  <TableHead className="font-semibold">Branch</TableHead>
                  <TableHead className="font-semibold">Reference No</TableHead>
                  <TableHead className="font-semibold">To</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  {/* <TableHead className="font-semibold">Type</TableHead> */}
                  <TableHead className="font-semibold">Note</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>
                {records.map((r, index) => (
                  <TableRow
                    key={r.id}
                    className="group transition-all duration-200 hover:bg-primary/5 hover:shadow-md even:bg-muted/20"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {r.senderName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {branches.find((branch) => branch.id === r.branchId)
                        ?.name ||
                        r.branchId ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold bg-gradient-to-r from-primary/20 to-pink-400/20 text-primary px-3 py-1 rounded-full">
                        {r.refrenceNo}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.receiverName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.receivedDate).toISOString().slice(0, 10)}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-muted-foreground text-xs">
                      {r.note}
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(r)}
                        className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                        className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
