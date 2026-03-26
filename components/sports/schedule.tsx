"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2 } from "lucide-react";

export default function PracticeScheduleTab() {
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  const [form, setForm] = useState({
    branchId: "",
    sportId: "",
    coachId: "",
    day: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  // 🔥 Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get("/api/v1/practice-schedules", {
        params: {
          page,
          limit: 10,
          day: search || undefined,
        },
      });

      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching schedules", err);
    }
  };

  // 🔥 Fetch dropdown data
  const fetchDropdowns = async () => {
    const [b, s, c] = await Promise.all([
      axios.get("/api/v1/branches"),
      axios.get("/api/v1/sports"),
      axios.get("/api/v1/users?role=coach"), // 👈 adjust if needed
    ]);

    setBranches(b.data.data);
    setSports(s.data.data);
    setCoaches(c.data.data || []);
  };

  useEffect(() => {
    fetchSchedules();
  }, [page, search]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // 🔥 Create Schedule
  const handleCreate = async () => {
    try {
      await axios.post("/api/v1/practice-schedules", form);
      setShowDialog(false);
      setForm({
        branchId: "",
        sportId: "",
        coachId: "",
        day: "",
        startTime: "",
        endTime: "",
        location: "",
      });
      fetchSchedules();
    } catch (err) {
      console.error("Create schedule error", err);
    }
  };

  // 🔥 Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/v1/practice-schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔥 Top Bar */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={14}
          />
          <Input
            placeholder="Search by day..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* CREATE */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={14} /> Add Schedule
            </Button>
          </DialogTrigger>

          <DialogContent className="space-y-4">
            <DialogTitle>Add Practice Schedule</DialogTitle>

            {/* Branch */}
            <Select onValueChange={(v) => setForm({ ...form, branchId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sport */}
            <Select onValueChange={(v) => setForm({ ...form, sportId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Coach */}
            <Select onValueChange={(v) => setForm({ ...form, coachId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Coach" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Day (e.g. Monday)"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            />

            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />

            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <Button onClick={handleCreate}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔥 Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((d, i) => (
              <TableRow key={d.id}>
                <TableCell>{i + 1}</TableCell>

                <TableCell>
                  {sports.find((s) => s.id === d.sportId)?.name}
                </TableCell>

                <TableCell>
                  {coaches.find((c) => c.id === d.coachId)?.name}
                </TableCell>

                <TableCell>
                  {branches.find((b) => b.id === d.branchId)?.name}
                </TableCell>

                <TableCell>
                  <Badge>{d.day}</Badge>
                </TableCell>

                <TableCell>
                  {d.startTime} - {d.endTime}
                </TableCell>

                <TableCell>{d.location}</TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(d.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 🔥 Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
