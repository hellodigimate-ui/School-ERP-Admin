// /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react";
import { Plus, Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface ScheduleItem {
  id: string;
  name: string;
  code: string;
  class: string;
  branchId: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string;
}

interface Branch {
  id: string
  name: string
}

interface ClassItem {
  id: string
  name: string
}

const API_BASE = "/api/v1/exams";
const API_BRANCH = "/api/v1/branches"

const Page = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [stats, setStats] = useState({
        totalExams: 0,
        upcomingExams: 0,
        totalRooms: 0
    });
  const [filterClass, setFilterClass] = useState("all");
  const [filterBranch, setFilterBranch] = useState<string>("")
  const [branches, setBranches] = useState<Branch[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // For editing
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Add form state
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({});

  const filtered = schedule

const handleAdd = async () => {
  try {
    const res = await axiosInstance.post(API_BASE, {
      branchId: formData.branchId,
      classId: formData.class,
      name: formData.name,
      code: formData.code,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subject: formData.subject,
      room: formData.room
    })

    if (res.data.success) {
      fetchExams()
      fetchStats()
      setAddDialogOpen(false)
      setFormData({})
    }
  } catch (err) {
    console.error(err)
  }
}

const handleEdit = async () => {
  if (!editingItem) return

  try {
    const res = await axiosInstance.put(`${API_BASE}/${editingItem.id}`, {
      name: editingItem.name,
      code: editingItem.code,
      date: editingItem.date,
      startTime: editingItem.startTime,
      endTime: editingItem.endTime,
      subject: editingItem.subject,
      room: editingItem.room
    })

    if (res.data.success) {
      fetchExams()
      setEditDialogOpen(false)
      setEditingItem(null)
    }
  } catch (err) {
    console.error(err)
  }
}


const fetchExams = async () => {
  try {

    let url = `${API_BASE}?page=1&perPage=50`

    if (filterBranch) {
      url += `&branchId=${filterBranch}`
    }

    if (filterClass) {
      url += `&classId=${filterClass}`
    }

    const res = await axiosInstance.get(url)

    if (res.data.success) {
      setSchedule(res.data.data)
    }

  } catch (err) {
    console.error(err)
  }
}


const fetchStats = async () => {
  try {
    const res = await axiosInstance.get(`${API_BASE}/stats`);

    if (res.data.success) {
      setStats(res.data.data);
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get(API_BRANCH)
    if (res.data.success) {
      setBranches(res.data.data)
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchClasses = async (branchId: string) => {
  try {
    const res = await axiosInstance.get(`/api/v1/classes?branchId=${branchId}`)
    if (res.data.success) {
      setClasses(res.data.data)
    }
  } catch (err) {
    console.error(err)
  }
}

useEffect(() => {
  if (!filterBranch) return;

  fetchClasses(filterBranch);
}, [filterBranch]);


useEffect(() => {
  fetchStats()
  fetchBranches()
}, [])

useEffect(() => {
  fetchExams()
}, [filterBranch, filterClass])




  return (
    <AdminLayout>
      <div className="space-y-6 p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Exam Schedule</h1>
            <p className="text-sm text-slate-500">Plan and manage examination timetables</p>
          </div>

          {/* Add Schedule Button */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-500 hover:to-blue-500 shadow-md">
                <Plus className="h-4 w-4 mr-2" /> Add Schedule
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 w-full sm:w-96">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">Add Exam Schedule</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Exam</Label>
                  <Input value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Exam name" />
                </div>

                <div>
                  <Label>Branch</Label>
                    <Select
                        value={formData.branchId}
                        onValueChange={(val) => {
                        setFormData({
                            ...formData,
                            branchId: val,
                            class: ""   // reset class when branch changes
                        })

                        setClasses([])       // clear previous classes
                        fetchClasses(val)    // fetch classes for this branch
                        }}
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
                </div>

                <div>
                  <Label>Class</Label>
                    <Select
                    value={formData.class}
                    onValueChange={(val) =>
                        setFormData({ ...formData, class: val })
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                            {c.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                
                <div>
                  <Label>Subject</Label>
                  <Input value={formData.subject || ""} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Subject name" />
                </div>

                <div>
                  <Label>Subject Code</Label>
                  <Input value={formData.code || ""} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Subject name" />
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>

                  <div>
                    <Label>Room</Label>
                    <Input value={formData.room || ""} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="Hall A" />
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" value={formData.startTime || ""} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input type="time" value={formData.endTime || ""} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white" onClick={handleAdd}>Save Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
              <Calendar className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
                <p className="text-sm opacity-90">Total Schedules</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
              <Clock className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{stats.upcomingExams}</p>
                <p className="text-sm opacity-90">Upcoming Exams</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
              <MapPin className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{stats.totalRooms}</p>
                <p className="text-sm opacity-90">Exam Halls</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">


            {/* Branch Filter */}
            <Select
            value={filterBranch}
            onValueChange={(val) => {
                setFilterBranch(val)
                setFilterClass("")
                setClasses([])
                fetchClasses(val)   // 🔥 fetch classes of selected branch
            }}
            >
                <SelectTrigger className="w-48">
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


            {/* Class Filter */}
            <Select
                value={filterClass}
                onValueChange={(val) => setFilterClass(val)}
                disabled={!filterBranch}
            >
                <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Class" />
                </SelectTrigger>

                <SelectContent>
                {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-md mt-4">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-600">#</th>
                <th className="p-3 text-left font-semibold text-gray-600">Exam</th>
                <th className="p-3 text-left font-semibold text-gray-600">Class</th>
                <th className="p-3 text-left font-semibold text-gray-600">Subject</th>
                <th className="p-3 text-left font-semibold text-gray-600">Subject Code</th>
                <th className="p-3 text-left font-semibold text-gray-600">Date</th>
                <th className="p-3 text-left font-semibold text-gray-600">Time</th>
                <th className="p-3 text-left font-semibold text-gray-600">Room</th>
                <th className="p-3 text-center font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3"><Badge variant="outline">{s.class}</Badge></td>
                  <td className="p-3">{s.subject}</td>
                  <td className="p-3 text-center">{s.code}</td>
                  <td className="p-3">{new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="p-3 text-gray-500">{s.startTime} - {s.endTime}</td>
                  <td className="p-3"><Badge variant="secondary">{s.room}</Badge></td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingItem(s); setEditDialogOpen(true); }}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={async () => {
                        await axiosInstance.delete(`${API_BASE}/${s.id}`);
                        fetchStats()
                        fetchExams();
                    }}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 w-full sm:w-96">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">Edit Exam Schedule</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Exam</Label>
                  <Input value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                </div>
                
                <div>
                  <Label>Subject</Label>
                  <Input value={editingItem.subject} onChange={e => setEditingItem({...editingItem, subject: e.target.value})} />
                </div>
                <div>
                  <Label>Subject Code</Label>
                  <Input value={editingItem.code} onChange={e => setEditingItem({...editingItem, code: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" 
                        value={editingItem.date ? new Date(editingItem.date).toISOString().split("T")[0] : ""}
                        onChange={(e) => {
                        const isoDate = new Date(e.target.value).toISOString()

                        setEditingItem({
                            ...editingItem,
                            date: isoDate
                        })
                        }}
                    />
                  </div>
                  <div>
                    <Label>Room</Label>
                    <Input value={editingItem.room} onChange={e => setEditingItem({...editingItem, room: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" value={editingItem.startTime} onChange={e => setEditingItem({...editingItem, startTime: e.target.value})} />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input type="time" value={editingItem.endTime} onChange={e => setEditingItem({...editingItem, endTime: e.target.value})} />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white" onClick={handleEdit}>Update Schedule</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
};

export default Page;