/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
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
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Plus, Trash2, Pencil } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const API = "/api/v1";

export default function AchievementsTab() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);

  const [filteredSports, setFilteredSports] = useState<any[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);

  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 0);

    return () => clearTimeout(delay);
  }, [search]);

  const [form, setForm] = useState({
    studentId: "",
    branchId: "",
    sportId: "",
    tournamentId: "",
    title: "",
    description: "",
    level: "",
    award: "",
    date: "",
  });

  const resetForm = () => {
    setForm({
      studentId: "",
      branchId: "",
      sportId: "",
      tournamentId: "",
      title: "",
      description: "",
      level: "",
      award: "",
      date: "",
    });
    setSelectedStudent(null);
    setStudentSearch("");
    setStudents([]);
  };

  const fetchAchievements = async () => {
    try {
      const res = await axiosInstance.get(`${API}/sports/achievements`, {
        params: {
          page,
          limit: 10,
          search: debouncedSearch || undefined, // ✅ key change
        },
      });

      setAchievements(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeta = async () => {
    const [b, s, t] = await Promise.all([
      axiosInstance.get(`${API}/branches`),
      axiosInstance.get(`${API}/sports`, { params: { page: 1, limit: 500 } }),
      axiosInstance.get(`${API}/sports/tournaments`, {
        params: { page: 1, limit: 50 },
      }),
    ]);

    setBranches(b.data.data);
    setSports(s.data.data);
    setTournaments(t.data.data);
  };

  const fetchStudents = async (search: string) => {
    if (!form.branchId) return;

    setLoadingStudents(true);
    const res = await axiosInstance.get(`${API}/students`, {
      params: {
        name: search || undefined,
        page: 1,
        perPage: 10,
        branch: form.branchId,
      },
    });

    setStudents(res.data.data.students);
    setLoadingStudents(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (!form.branchId) return;

    const delay = setTimeout(() => {
      fetchStudents(studentSearch);
    }, 400);

    return () => clearTimeout(delay);
  }, [studentSearch, form.branchId]);

  useEffect(() => {
    if (form.branchId) {
      setFilteredSports(sports.filter((s) => s.branchId === form.branchId));
    } else setFilteredSports([]);

    setForm((f) => ({ ...f, sportId: "", tournamentId: "" }));
  }, [form.branchId]);

  useEffect(() => {
    if (form.sportId) {
      setFilteredTournaments(
        tournaments.filter((t) => t.sportId === form.sportId),
      );
    } else setFilteredTournaments([]);

    setForm((f) => ({ ...f, tournamentId: "" }));
  }, [form.sportId]);

  useEffect(() => {
    setSelectedStudent(null);
    setStudents([]);
    setStudentSearch("");
    setForm((f) => ({ ...f, studentId: "" }));
  }, [form.branchId]);

  const handleCreate = async () => {
    await axiosInstance.post(`${API}/sports/achievements`, form);
    resetForm();
    setOpen(false);
    fetchAchievements();
  };

  const handleUpdate = async () => {
    await axiosInstance.put(`${API}/sports/achievements/${editingId}`, form);
    setEditOpen(false);
    resetForm();
    fetchAchievements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    await axiosInstance.delete(`${API}/sports/achievements/${id}`);
    fetchAchievements();
  };

  const openEdit = (a: any) => {
    setEditingId(a.id);
    setEditOpen(true);

    setForm({
      studentId: a.studentId,
      branchId: a.Sport?.branchId || "",
      sportId: a.sportId,
      tournamentId: a.tournamentId,
      title: a.title,
      description: a.description || "",
      level: a.level,
      award: a.award || "",
      date: a.date?.split("T")[0],
    });

    setSelectedStudent(a.Student);
    setStudentSearch(a.Student?.name);
  };

  const renderForm = (isEdit = false) => (
    <div className="space-y-3 mt-4">
      {/* Branch */}
      <Select
        value={form.branchId}
        onValueChange={(v) => setForm({ ...form, branchId: v })}
      >
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

      {/* Student Selection */}
      <div className="space-y-2">
        <Input
          placeholder="Search student..."
          value={studentSearch}
          disabled={!form.branchId || !!selectedStudent}
          onChange={(e) => setStudentSearch(e.target.value)}
        />

        <div className="border rounded-md max-h-40 overflow-y-auto">
          {!form.branchId ? (
            <p className="p-2 text-sm text-muted-foreground">
              Select branch first
            </p>
          ) : selectedStudent ? (
            <div className="flex items-center justify-between p-2 bg-green-50">
              <span className="text-sm">✅ {selectedStudent.name}</span>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedStudent(null);
                  setStudentSearch("");
                  setForm({ ...form, studentId: "" });
                }}
              >
                Change
              </Button>
            </div>
          ) : loadingStudents ? (
            <p className="p-2 text-sm">Searching...</p>
          ) : students.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">
              No students found
            </p>
          ) : (
            students.map((s) => (
              <div
                key={s.id}
                className="p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedStudent(s);
                  setForm({ ...form, studentId: s.id });
                  setStudentSearch(s.name);
                  setStudents([]);
                }}
              >
                {s.name}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sport */}
      <Select
        value={form.sportId}
        onValueChange={(v) => setForm({ ...form, sportId: v })}
        disabled={!form.branchId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Sport" />
        </SelectTrigger>
        <SelectContent>
          {filteredSports.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tournament */}
      <Select
        value={form.tournamentId}
        onValueChange={(v) => setForm({ ...form, tournamentId: v })}
        disabled={!form.sportId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Tournament" />
        </SelectTrigger>
        <SelectContent>
          {filteredTournaments.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Title */}
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Level */}
      <Select
        value={form.level}
        onValueChange={(v) => setForm({ ...form, level: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SCHOOL">School</SelectItem>
          <SelectItem value="DISTRICT">District</SelectItem>
          <SelectItem value="STATE">State</SelectItem>
          <SelectItem value="NATIONAL">National</SelectItem>
          <SelectItem value="INTERNATIONAL">International</SelectItem>
        </SelectContent>
      </Select>

      {/* Date */}
      <Input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      {/* Submit */}
      <Button
        onClick={isEdit ? handleUpdate : handleCreate}
        disabled={
          !form.studentId ||
          !form.branchId ||
          !form.sportId ||
          !form.tournamentId ||
          !form.title ||
          !form.level ||
          !form.date
        }
        className="w-full"
      >
        {isEdit ? "Update" : "Save"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-72"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={14} /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Achievement</DialogTitle>
            {renderForm(false)}
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogTitle>Edit Achievement</DialogTitle>
            {renderForm(true)}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((a, i) => (
            <TableRow key={a.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{a.Student?.name}</TableCell>
              <TableCell>
                <Badge>{a.Sport?.name}</Badge>
              </TableCell>
              <TableCell>{a.Tournament?.name}</TableCell>
              <TableCell>{a.title}</TableCell>
              <TableCell>
                <Badge>{a.level}</Badge>
              </TableCell>
              <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button
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