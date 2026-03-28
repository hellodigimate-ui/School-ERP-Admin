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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {  Plus, Trash2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function TournamentTab() {
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);

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
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/sports/tournaments", {
        params: {
          page,
          limit: 10,
          status:
            searchStatus === "ALL" ? undefined : searchStatus || undefined,
        },
      });

      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Fetch tournaments error", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch branches
  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);

      const res = await axiosInstance.get("/api/v1/branches", {
        params: {
          page: 1,
          perPage: 50,
        },
      });

      setBranches(res.data.data);
    } catch (err) {
      console.error("Branches error", err);
    } finally {
      setLoadingBranches(false);
    }
  };

  // 🔥 Fetch sports (based on branch)
  const fetchSports = async (branchId: string) => {
    try {
      setLoadingSports(true);

      const res = await axiosInstance.get("/api/v1/sports", {
        params: {
          page: 1,
          limit: 50,
          branchId,
        },
      });

      setSports(res.data.data);
    } catch (err) {
      console.error("Sports error", err);
    } finally {
      setLoadingSports(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [page, searchStatus]);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (form.branchId) {
      fetchSports(form.branchId);
    } else {
      setSports([]);
    }
  }, [form.branchId]);

  // 🔥 Create
  const handleCreate = async () => {
    if (!form.name || !form.branchId || !form.sportId) {
      alert("Fill required fields");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/sports/tournaments", {
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
      await axiosInstance.delete(`/api/v1/sports/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // 🔥 Status update
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axiosInstance.put(`/api/v1/sports/tournaments/${id}`, { status });
      fetchTournaments();
    } catch (err) {
      console.error("Status error", err);
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
        {/* Status Filter */}
        <Select
          value={searchStatus}
          onValueChange={(v) => {
            setSearchStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

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
            <Select
              value={form.branchId}
              onValueChange={(v) =>
                setForm({ ...form, branchId: v, sportId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loadingBranches ? "Loading..." : "Select Branch"}
                />
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
            <Select
              value={form.sportId}
              onValueChange={(v) => setForm({ ...form, sportId: v })}
              disabled={!form.branchId || loadingSports}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !form.branchId
                      ? "Select branch first"
                      : loadingSports
                        ? "Loading..."
                        : "Select Sport"
                  }
                />
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
              type="number"
              placeholder="Registration Fee"
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
      {loading ? (
        <p>Loading tournaments...</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">No tournaments found</p>
      ) : (
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
      )}

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