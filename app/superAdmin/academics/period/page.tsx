/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";


interface Period {
  id: string;
  periodName: string;
  branchId: string;
  start: string;
  end: string;
}

interface Branch {
  id: string;
  name: string;
}


const initialPeriods: Period[] = [
  { id: "1", periodName: "Period 1",branchId: "MBBS", start: "08:00", end: "08:45" },
  { id: "2", periodName: "Period 2",branchId: "MBBS", start: "08:45", end: "09:30" },
  { id: "3", periodName: "Lunch Break",branchId: "MBBS", start: "12:30", end: "13:00" },
  { id: "4", periodName: "Period 5",branchId: "MBBS", start: "13:00", end: "13:45" },
];

export default function PeriodsPage() {
  const { toast } = useToast();

  const [periods, setPeriods] = useState<Period[]>(initialPeriods);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
    const [form, setForm] = useState<Period>({
        id: "",
        periodName:"",
        branchId: "",
        start: "08:00",
        end: "08:45",
    });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

    const openCreate = () => {
    setEditingPeriod(null);
    setForm({
        id: crypto.randomUUID(),
        periodName: "",
        branchId:"",
        start: "08:00",
        end: "08:45",
    });
    setDialogOpen(true);
    };

    /** Fetch branches */
    const fetchBranches = async () => {
    try {
        const res = await axiosInstance.get("/api/v1/branches");
        setBranches(res.data.data);
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

  const openEdit = (period: Period) => {
    setEditingPeriod(period);
    // setForm({ ...period, schedule: { ...period.schedule } });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.periodName.trim()) {
      toast({
        title: "Error",
        description: "Period name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingPeriod) {
      setPeriods((prev) =>
        prev.map((p) => (p.id === editingPeriod.id ? form : p))
      );
      toast({
        title: "Updated",
        description: `${form.periodName} updated successfully`,
      });
    } else {
      setPeriods((prev) => [...prev, form]);
      toast({
        title: "Created",
        description: `${form.periodName} created successfully`,
      });
    }

    setDialogOpen(false);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      setPeriods((prev) => prev.filter((p) => p.id !== deletingId));
      toast({
        title: "Deleted",
        description: "Period deleted successfully",
      });
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };



  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">
              Periods Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Create and manage class periods with day-wise timing
            </p>
          </div>

          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Period
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" /> All Periods
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Period Name</TableHead>
                  <TableHead className="w-[140px]">Branch</TableHead>

                  <TableHead className="text-center">Time</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{period.periodName}</Badge>
                    </TableCell>

                    <TableCell className="font-medium">
                      <Badge variant="secondary">{period.branchId}</Badge>
                    </TableCell>

                    <TableCell className="text-center text-xs text-muted-foreground">
                    {period.start} - {period.end}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(period)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(period.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {periods.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No periods created yet. Click Add Period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPeriod ? "Edit Period" : "Create New Period"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">

            <div>
                <Label>Period Name</Label>
                <Input
                placeholder="Period Name"
                value={form.periodName}
                onChange={(e) =>
                    setForm((f) => ({ ...f, periodName: e.target.value }))
                }
                />
            </div>

            <div className="grid gap-2">
            <Label>Branch</Label>
            <Select
            >
                <SelectTrigger>
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

            <div>
                <Label>Start Time</Label>
                <Input
                type="time"
                value={form.start}
                onChange={(e) =>
                    setForm((f) => ({ ...f, start: e.target.value }))
                }
                />
            </div>

            <div>
                <Label>End Time</Label>
                <Input
                type="time"
                value={form.end}
                onChange={(e) =>
                    setForm((f) => ({ ...f, end: e.target.value }))
                }
                />
            </div>

            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button onClick={handleSave}>
                {editingPeriod ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Period</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this period?
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}