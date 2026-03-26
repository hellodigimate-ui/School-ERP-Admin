"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

export default function TournamentTab() {
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchStatus, setSearchStatus] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  const [form, setForm] = useState({
    branchId: "",
    sportId: "",
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    registrationFee: "",
  });

  // 🔥 Fetch tournaments
  const fetchTournaments = async () => {
    try {
      const res = await axios.get("/api/v1/tournaments", {
        params: {
          page,
          limit: 10,
          status: searchStatus || undefined,
        },
      });

      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Fetch tournaments error", err);
    }
  };

  // 🔥 Fetch dropdowns
  const fetchDropdowns = async () => {
    const [b, s] = await Promise.all([
      axios.get("/api/v1/branches"),
      axios.get("/api/v1/sports"),
    ]);

    setBranches(b.data.data);
    setSports(s.data.data);
  };

  useEffect(() => {
    fetchTournaments();
  }, [page, searchStatus]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // 🔥 Create
  const handleCreate = async () => {
    try {
      await axios.post("/api/v1/tournaments", {
        ...form,
        registrationFee: Number(form.registrationFee),
      });

      setShowDialog(false);
      fetchTournaments();

      setForm({
        branchId: "",
        sportId: "",
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        registrationFee: "",
      });
    } catch (err) {
      console.error("Create error", err);
    }
  };

  // 🔥 Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/v1/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // 🔥 Update Status
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(`/api/v1/tournaments/${id}`, { status });
      fetchTournaments();
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const statusColors: any = {
    UPCOMING: "bg-blue-100 text-blue-600",
    ONGOING: "bg-green-100 text-green-600",
    COMPLETED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-5">
      {/* 🔥 Top Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            placeholder="Filter by status..."
            className="pl-9 w-64"
            value={searchStatus}
            onChange={(e) => {
              setSearchStatus(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* CREATE */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={14} /> Add Tournament
            </Button>
          </DialogTrigger>

          <DialogContent className="space-y-4">
            <DialogTitle>Create Tournament</DialogTitle>

            <Input
              placeholder="Tournament Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

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

            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />

            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <Input
              placeholder="Registration Fee"
              type="number"
              value={form.registrationFee}
              onChange={(e) =>
                setForm({ ...form, registrationFee: e.target.value })
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button onClick={handleCreate}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-lg"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{t.name}</h3>
              <Badge className={statusColors[t.status]}>{t.status}</Badge>
            </div>

            <p className="text-sm mt-2 text-muted-foreground">{t.location}</p>

            <p className="text-xs mt-1">
              {new Date(t.startDate).toLocaleDateString()} →{" "}
              {new Date(t.endDate).toLocaleDateString()}
            </p>

            <p className="text-sm mt-2">₹ {t.registrationFee || 0}</p>

            <div className="flex justify-between mt-4">
              <Select onValueChange={(v) => handleStatusChange(t.id, v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => handleDelete(t.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm">
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
