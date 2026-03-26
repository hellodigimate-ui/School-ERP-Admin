/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Search, Plus, Trash2, Medal } from "lucide-react";

const API = "/api/v1";

export default function AchievementsTab() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    sportId: "",
    tournamentId: "",
    title: "",
    description: "",
    level: "",
    award: "",
    date: "",
  });

  // 🔥 FETCH ACHIEVEMENTS
  const fetchAchievements = async () => {
    try {
      const res = await axios.get(`${API}/achievements`, {
        params: {
          page,
          limit: 10,
        },
      });

      setAchievements(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH SPORTS + TOURNAMENTS
  const fetchMeta = async () => {
    try {
      const [sportsRes, tournamentRes] = await Promise.all([
        axios.get(`${API}/sports`),
        axios.get(`${API}/tournaments`),
      ]);

      setSports(sportsRes.data.data);
      setTournaments(tournamentRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [page]);

  useEffect(() => {
    fetchMeta();
  }, []);

  // 🔥 CREATE
  const handleCreate = async () => {
    try {
      await axios.post(`${API}/achievements`, form);
      setOpen(false);
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/achievements/${id}`);
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            placeholder="Search achievements..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={14} /> Add Achievement
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Add Achievement</DialogTitle>

            <div className="space-y-3 mt-4">
              <Input
                placeholder="Student ID"
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
              />

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

              <Select
                onValueChange={(v) => setForm({ ...form, tournamentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <Input
                placeholder="Level (School/District/State)"
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />

              <Input
                type="date"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <Button className="w-full" onClick={handleCreate}>
                Save Achievement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔥 TABLE */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Achievement</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {achievements.map((a, i) => (
              <TableRow key={a.id}>
                <TableCell>{i + 1}</TableCell>

                <TableCell>{a.Student?.name || a.studentId}</TableCell>

                <TableCell>
                  <Badge>{a.Sport?.name || "-"}</Badge>
                </TableCell>

                <TableCell>{a.Tournament?.name || "-"}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <Medal size={14} />
                    {a.title}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge>{a.level}</Badge>
                </TableCell>

                <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => handleDelete(a.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 🔥 PAGINATION */}
      <div className="flex justify-between">
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
            Prev
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
