/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import { Search, Plus, Trash2, Pencil, Eye, MapPin, Clock, Calendar, User, Activity } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface SportsTabProps {
  branchId?: string;
}

export default function PracticeScheduleTab({ branchId }: SportsTabProps) {
  const [data, setData] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const [sportFilter, setSportFilter] = useState("");
  const [coachFilter, setCoachFilter] = useState("");

  const [form, setForm] = useState({
    sportId: "",
    coachId: "",
    day: "",
    startTime: "",
    endTime: "",
    location: "",
  });


useEffect(() => {
  const fetchCoaches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/staff", {
        params: { role: "COACH" },
      });
      if (res.data.success) {
        setCoaches(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch coaches", error);
    }
  };

  fetchCoaches();
}, []);

  // 🔹 Fetch schedules
const fetchSchedules = async () => {
  try {
    const branchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : undefined;

    const res = await axiosInstance.get("/api/v1/sports/practice/schedules", {
      params: {
        page,
        limit: 10,
        day: search || undefined,
        ...(branchId ? { branchId } : {}),
        sportId: sportFilter === "all" ? undefined : sportFilter,
        coachId: coachFilter === "all" ? undefined : coachFilter,
      },
    });

    setData(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  } catch (err) {
    console.error("Error fetching schedules", err);
  }
};

useEffect(() => {
  fetchSchedules();
}, [page, search, sportFilter, coachFilter]);


  // 🔹 Fetch dropdowns for Add/Edit modal
const fetchDropdowns = async () => {
  try {
    const [s, c] = await Promise.all([
      axiosInstance.get("/api/v1/sports"),
      axiosInstance.get("/api/v1/staff?role=COACH"),
    ]);

    setSports(s.data.data);
    setCoaches(c.data.data);

  } catch (err) {
    console.error("Error fetching dropdowns", err);
  }
};

  useEffect(() => {
    fetchSchedules();
  }, [page, search]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // 🔹 Create schedule
const handleCreate = async () => {
  if (!form.sportId || !form.coachId || !form.day || !form.startTime || !form.endTime || !form.location) {
    console.warn("Please fill all required fields before creating schedule.");
    return;
  }

  const branchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
  if (!branchId) {
    console.warn("branchId not found in localStorage");
    return;
  }

  try {
    const payload = {
      ...form,
      branchId,
    };

    console.log("Sending form to backend:", payload); // debug
    await axiosInstance.post("/api/v1/sports/practice/schedules", payload);
    setShowAddDialog(false);
    setForm({ sportId: "", coachId: "", day: "", startTime: "", endTime: "", location: "" });
    fetchSchedules();
  } catch (err) {
    console.error("Create schedule error", err);
  }
};

  // 🔹 Update schedule
  const handleUpdate = async () => {
    if (!selectedSchedule) return;

    const branchId = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
    if (!branchId) {
      console.warn("branchId not found in localStorage");
      return;
    }

    try {
      await axiosInstance.put(`/api/v1/sports/practice/schedules/${selectedSchedule.id}`, {
        ...form,
        branchId,
      });
      setShowEditDialog(false);
      setSelectedSchedule(null);
      setForm({ sportId: "", coachId: "", day: "", startTime: "", endTime: "", location: "" });
      fetchSchedules();
    } catch (err) {
      console.error("Update schedule error", err);
    }
  };

  // 🔹 Delete schedule
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/sports/practice/schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Delete schedule error", err);
    }
  };

  // 🔹 Open Edit modal
  const openEditModal = (schedule: any) => {
    setSelectedSchedule(schedule);
    setForm({
      sportId: schedule.sportId,
      coachId: schedule.coachId,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location,
    });
    setShowEditDialog(true);
  };

  // 🔹 Open View modal
  const openViewModal = (schedule: any) => {
    setSelectedSchedule(schedule);
    setShowViewDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <Input
            placeholder="Search by day..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Add Schedule */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg transform hover:scale-105 transition-transform">
              <Plus size={16} /> Add Schedule
            </Button>
          </DialogTrigger>

          <DialogContent className="space-y-6 w-full max-w-md max-h-[80vh] overflow-y-auto p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl">
            <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-green-700 border-b pb-2">
              <Activity size={28} /> Add Practice Schedule
            </DialogTitle>

            {/* Branch is set automatically from profile branchId in localStorage */}

            <div className="space-y-1 bg-orange-50 p-3 rounded-xl shadow-inner border border-orange-100">
              <label className="flex items-center gap-2 font-semibold text-orange-600">
                <Activity size={18} /> Sport
              </label>
              <Select
                value={form.sportId}
                onValueChange={(v) => setForm({ ...form, sportId: v })}
              >
                <SelectTrigger className="w-full border-orange-300 focus:ring-1 focus:ring-orange-400">
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
            </div>

            {/* Coach */}
            <div className="space-y-1 bg-blue-50 p-3 rounded-xl shadow-inner border border-blue-100">
              <label className="flex items-center gap-2 font-semibold text-blue-600">
                <User size={18} /> Coach
              </label>
              <Select
                value={form.coachId}
                onValueChange={(v) => setForm({ ...form, coachId: v })}
              >
                <SelectTrigger className="w-full border-blue-300 focus:ring-1 focus:ring-blue-400">
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
            </div>

            {/* Day */}
            <div className="space-y-1 bg-purple-50 p-3 rounded-xl shadow-inner border border-purple-100">
              <label className="flex items-center gap-2 font-semibold text-purple-600">
                <Calendar size={18} /> Day
              </label>
              <Select
                value={form.day}
                onValueChange={(v) => setForm({ ...form, day: v })}
              >
                <SelectTrigger className="w-full border-purple-300 focus:ring-1 focus:ring-purple-400">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Time & End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-teal-50 p-3 rounded-xl shadow-inner border border-teal-100">
                <label className="flex items-center gap-2 font-semibold text-teal-600">
                  <Clock size={18} /> Start Time
                </label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="border-teal-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-400"
                />
              </div>
              <div className="space-y-1 bg-red-50 p-3 rounded-xl shadow-inner border border-red-100">
                <label className="flex items-center gap-2 font-semibold text-red-600">
                  <Clock size={18} /> End Time
                </label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1 bg-indigo-50 p-3 rounded-xl shadow-inner border border-indigo-100">
              <label className="flex items-center gap-2 font-semibold text-indigo-600">
                <MapPin size={18} /> Location
              </label>
              <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Create Button */}
            <Button
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold shadow-lg transform hover:scale-105 transition-transform"
              onClick={handleCreate}
            >
              <Plus size={18} /> Create Schedule
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
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
              <TableRow key={d.id} className="hover:bg-blue-50 transition">
                <TableCell>{i + 1}</TableCell>
                <TableCell>{sports.find((s) => s.id === d.sportId)?.name}</TableCell>
                <TableCell>{coaches.find((c) => c.id === d.coachId)?.name}</TableCell>
                {/* <TableCell>{branches.find((b) => b.id === d.branchId)?.name}</TableCell> */}
                <TableCell><Badge className="bg-purple-100 text-purple-700">{d.day}</Badge></TableCell>
                <TableCell>{d.startTime.slice(11,16)} - {d.endTime.slice(11,16)}</TableCell>
                <TableCell>{d.location}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button size="icon" variant="ghost" className="text-blue-600" onClick={() => openViewModal(d)}>
                    <Eye size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-yellow-500" onClick={() => openEditModal(d)}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(d.id)}>
                    <Trash2 size={16} />
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
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="space-y-4">
          <DialogTitle className="text-xl font-bold text-yellow-600">Edit Schedule</DialogTitle>

          {/* Branch is set automatically from profile branchId in localStorage */}
          <p className="text-sm text-gray-600">Branch is auto-selected</p>

          {/* Sport */}
          <label className="font-medium text-gray-700">Sport</label>
<Select
  value={form.sportId}  // use form state
  onValueChange={(v) => setForm({ ...form, sportId: v })}
>
  <SelectTrigger className="w-full border-orange-300 focus:ring-1 focus:ring-orange-400">
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
          <label className="font-medium text-gray-700">Coach</label>
<Select
  value={form.coachId}  // use form state
  onValueChange={(v) => setForm({ ...form, coachId: v })}
>
  <SelectTrigger className="w-full border-blue-300 focus:ring-1 focus:ring-blue-400">
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

          <label className="font-medium text-gray-700">Day</label>
          <Input placeholder="Day (e.g. Monday)" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />

          <label className="font-medium text-gray-700">Start Time</label>
          <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />

          <label className="font-medium text-gray-700">End Time</label>
          <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />

          <label className="font-medium text-gray-700">Location</label>
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" onClick={handleUpdate}>Update</Button>
        </DialogContent>
      </Dialog>

      {/* 🔹 View Modal */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="space-y-4">
          <DialogTitle className="text-xl font-bold text-blue-600">View Schedule</DialogTitle>
          {selectedSchedule && (
            <div className="space-y-2">
              <p><strong>Branch:</strong> {typeof window !== "undefined" ? localStorage.getItem("branchId") || "-" : "-"}</p>
              <p><strong>Sport:</strong> {sports.find((s) => s.id === selectedSchedule.sportId)?.name}</p>
              <p><strong>Coach:</strong> {coaches.find((c) => c.id === selectedSchedule.coachId)?.name}</p>
              <p><strong>Day:</strong> <Badge className="bg-purple-100 text-purple-700">{selectedSchedule.day}</Badge></p>
              <p><strong>Time:</strong> {selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
              <p><strong>Location:</strong> {selectedSchedule.location}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}