/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, BookOpen, Clock, Filter, GitBranch, Save } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  sectionId: string;
  type: "class" | "break" | "lunch" | "Free";
}

interface Section {
  id: string;
  name: string;
  grade: string;
}

interface Branch {
  id: string;
  name: string;
}



export default function PeriodManagement() {
  const { toast } = useToast();

  const [sections, setSections] = useState<Section[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    branchId:"",
  });

  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyTargetId, setCopyTargetId] = useState("");

    /** Fetch branches */
    const fetchBranches = async () => {
    try {
        const res = await axiosInstance.get("/api/v1/branches");
        const list = res.data?.data || [];
        setBranches(list);

         if (list.length > 0) {
          setSelectedBranchId(list[0].id);
        }
    } catch {
        toast({
            title: "Error",
            description: "Failed to load branches",
            variant: "destructive",
        });
    }
    };

    useEffect(() => {
        fetchBranches();
    }, []);


  /* FETCH SECTIONS */
  const fetchSections = async (branchId: string) => {
    try {
      const res = await axiosInstance.get("/api/v1/sections", {
        params: { branchId },
      });

      const list = res.data?.data || [];

      setSections(list);

      if (list.length > 0) {
        setSelectedSectionId(list[0].id);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
  if (selectedBranchId) {
    fetchSections(selectedBranchId);
  }
}, [selectedBranchId]);



  /* FETCH PERIODS BY SECTION */
const fetchPeriods = async (branchId?: string) => {
  try {
    setLoading(true);

    const params: any = {};

    if (branchId && branchId !== "all") {
      params.branchId = branchId;
    }

    const res = await axiosInstance.get("/api/v1/periods", { params });

    console.log("Periods API:", res.data);

    setPeriods(res.data?.data || []);

  } catch {
    toast({
      title: "Error",
      description: "Failed to load periods",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  
  fetchPeriods(selectedBranchId);

}, [selectedBranchId]);



  const currentSection = sections?.find((s) => s.id === selectedSectionId);



  /* OPEN DIALOGS */
  const openAddDialog = () => {
    setEditingPeriod(null);
    setFormData({ name: "", startTime: "", endTime: "", branchId: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (p: Period) => {
    setEditingPeriod(p);
    setFormData({ name: p.name, startTime: p.startTime, endTime: p.endTime, branchId: "" });
    setDialogOpen(true);
  };

  /* ADD/UPDATE PERIOD */
  const handleSave = async () => {
    if (!formData.name || !formData.startTime || !formData.endTime) {
      return toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
    }
    if (formData.startTime >= formData.endTime) {
      return toast({ title: "Validation Error", description: "End time must be after start", variant: "destructive" });
    }

    try {
      if (editingPeriod) {
        // UPDATE
        const res = await axiosInstance.put(`/api/v1/periods/${editingPeriod.id}`, {
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });

        toast({ title: "Updated", description: "Period updated successfully" });
      } else {
        // CREATE
        await axiosInstance.post("/api/v1/periods", {
          branchId: selectedBranchId,
          sectionId: selectedSectionId,
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });

        toast({ title: "Created", description: "Period added successfully" });
      }
      fetchPeriods(selectedSectionId);
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "API failure", variant: "destructive" });
    }
  };

  /* DELETE PERIOD */
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/periods/${id}`);
      toast({ title: "Deleted", description: "Period removed successfully" });
      fetchPeriods(selectedSectionId);
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  /* COPY SCHEDULE */
  const handleCopySchedule = async () => {
    if (!copyTargetId || !currentSection) return;

    try {
      // delete target existing
      const targetPeriodsRes = await axiosInstance.get("/api/v1/periods", { params: { sectionId: copyTargetId } });
      const targetPeriods = targetPeriodsRes.data.data;
      await Promise.all(targetPeriods.map((p: any) => axiosInstance.delete(`/api/v1/periods/${p.id}`)));

      // copy each
      await Promise.all(periods.map((p) => axiosInstance.post("/api/v1/periods", {
        sectionId: copyTargetId,
        name: p.name,
        startTime: p.startTime,
        endTime: p.endTime,
        type: p.type,
      })));

      toast({ title: "Copied", description: "Schedule copied successfully" });
      fetchPeriods(selectedSectionId);
      setCopyDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Schedule copy failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-6">

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Period Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure and manage schedule periods
              </p>
            </div>
          </div>

          {/* Add Button */}
          <Button
            onClick={openAddDialog}
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </Button>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5">

          <div className="relative w-full sm:w-[260px]">
            <Filter className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <Select
              value={selectedBranchId}
              onValueChange={(value) => {
                setSelectedBranchId(value);
              }}
            >
              <SelectTrigger className="pl-9">
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

        </div>

        {/* ================= TABLE ================= */}
        <Card className="rounded-2xl border border-border/40 shadow-lg overflow-hidden">

          <CardContent className="p-0">
            <Table>

              {/* Header */}
              <TableHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {periods.map((p, i) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-muted/50 transition-all duration-200"
                  >

                    {/* Index */}
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="flex items-center gap-2 font-medium">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                        <BookOpen size={14} />
                      </div>
                      {p.name}
                    </TableCell>

                    {/* Start Time */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-emerald-600" />
                        {p.startTime.slice(11, 16)}
                      </div>
                    </TableCell>

                    {/* End Time */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-rose-500" />
                        {p.endTime.slice(11, 16)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right flex gap-2 justify-end">

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(p)}
                        className="hover:bg-indigo-100 hover:text-indigo-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        className="hover:bg-red-100 hover:text-red-600"
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

        {/* ================= ADD / EDIT PERIOD DIALOG ================= */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[420px] rounded-2xl overflow-hidden border border-border/40 shadow-xl">

            {/* ===== Header ===== */}
            <DialogHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                {editingPeriod ? (
                  <>
                    <Pencil className="h-5 w-5" />
                    Edit Period
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Add Period
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {/* ===== Form ===== */}
            <div className="space-y-5 px-6 py-5">

              {/* Name */}
              <div>
                <Label>Name</Label>
                <div className="relative mt-1">
                  <BookOpen className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-9 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <Label>Branch</Label>
                <div className="relative mt-1">
                  <GitBranch className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Select
                    value={selectedBranchId}
                    onValueChange={(value) => {
                      setSelectedBranchId(value);
                      setSelectedSectionId("");
                    }}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4">

                {/* Start Time */}
                <div>
                  <Label>Start Time</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-3 text-emerald-600" size={16} />
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="pl-9 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <Label>End Time</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-3 text-rose-500" size={16} />
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="pl-9 focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ===== Footer ===== */}
            <DialogFooter className="px-6 pb-5 flex justify-end gap-2">

              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:opacity-90 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingPeriod ? "Update" : "Add"}
              </Button>

            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
