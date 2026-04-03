/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble,
  Users,
  Plus,
  AlertTriangle,
  DoorOpen,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { useBranchContext } from "@/context/BranchContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const rooms = [
  {
    id: "R101",
    block: "A",
    floor: 1,
    type: "Double",
    capacity: 2,
    occupied: 2,
    status: "Full",
  },
  {
    id: "R102",
    block: "A",
    floor: 1,
    type: "Triple",
    capacity: 3,
    occupied: 1,
    status: "Available",
  },
  {
    id: "R201",
    block: "B",
    floor: 2,
    type: "Single",
    capacity: 1,
    occupied: 0,
    status: "Available",
  },
  {
    id: "R202",
    block: "B",
    floor: 2,
    type: "Double",
    capacity: 2,
    occupied: 2,
    status: "Full",
  },
  {
    id: "R301",
    block: "C",
    floor: 3,
    type: "Dormitory",
    capacity: 6,
    occupied: 4,
    status: "Available",
  },
];

const residents = [
  {
    id: 1,
    name: "Arjun Mehta",
    class: "11-A",
    room: "R101",
    block: "A",
    checkIn: "2025-07-01",
    due: 0,
  },
  {
    id: 2,
    name: "Vikram Singh",
    class: "12-B",
    room: "R101",
    block: "A",
    checkIn: "2025-07-01",
    due: 2500,
  },
  {
    id: 3,
    name: "Rohan Das",
    class: "10-C",
    room: "R301",
    block: "C",
    checkIn: "2025-08-15",
    due: 0,
  },
  {
    id: 4,
    name: "Karan Joshi",
    class: "9-A",
    room: "R301",
    block: "C",
    checkIn: "2025-07-01",
    due: 1000,
  },
];

const Page = () => {
  const [hostelStats, setHostelStats] = useState({
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });
  const [hostelStatsLoading, setHostelStatsLoading] = useState(false);

  const stats = [
    {
      label: "Total Hostels",
      value: hostelStatsLoading ? "..." : String(hostelStats.totalHostels),
      icon: DoorOpen,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      label: "Total Rooms",
      value: hostelStatsLoading ? "..." : String(hostelStats.totalRooms),
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Occupied Rooms",
      value: hostelStatsLoading ? "..." : String(hostelStats.occupiedRooms),
      icon: BedDouble,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Available Rooms",
      value: hostelStatsLoading ? "..." : String(hostelStats.availableRooms),
      icon: AlertTriangle,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const { toast } = useToast();
  const [residentList, setResidentList] = useState<any[]>([]);
  const [residentLoading, setResidentLoading] = useState(false);
  const [residentPage, setResidentPage] = useState(1);
  const [residentTotalPages, setResidentTotalPages] = useState(1);
  const [residentSearch, setResidentSearch] = useState("");

  const [roomList, setRoomList] = useState<any[]>([]);
  const [roomLoading, setRoomLoading] = useState(false);

  const [roomPage, setRoomPage] = useState(1);
  const [roomTotalPages, setRoomTotalPages] = useState(1);

  const [roomFilter, setRoomFilter] = useState("all");
  const [hostelSearch, setHostelSearch] = useState("");

  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showHostelModal, setShowHostelModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState("");

  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);

  const {
    branches: globalBranches,
    selectedBranch,
    selectedBranchId,
  } = useBranchContext();
  const [localBranch, setLocalBranch] = useState("all");
  const isGlobalBranchSelected =
    selectedBranch !== null && selectedBranch !== "all";
  const branchFilter = isGlobalBranchSelected
    ? selectedBranchId
    : localBranch !== "all"
      ? localBranch
      : undefined;

  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    block: "",
    floor: "",
    type: "",
    capacity: "",
  });

  const [newHostel, setNewHostel] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    branchId: "",
  });

  const [editRoomMode, setEditRoomMode] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);

  // Separate form states
  const [assignData, setAssignData] = useState({
    studentId: "",
    roomId: "",
    hostelId: "",
    checkIn: "",
  });

  const handleAssignRoom = async () => {
    try {
      await axiosInstance.post("/api/v1/hostels/assignments", {
        studentId: assignData.studentId,
        roomId: assignData.roomId,
        hostelId: assignData.hostelId, // 🔥 IMPORTANT
      });

      toast({
        title: "Success",
        description: "Room assigned successfully",
      });

      setShowAssignModal(false);

      setAssignData({
        studentId: "",
        roomId: "",
        hostelId: "",
        checkIn: "",
      });

      fetchAssignments(); // 🔥 refresh
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Assignment failed",
        variant: "destructive",
      });
    }
  };

  const fetchAssignments = async () => {
    setResidentLoading(true);

    try {
      const res = await axiosInstance.get("/api/v1/hostels/assignments", {
        params: {
          page: residentPage,
          perPage: 10,
          ...(residentSearch ? { name: residentSearch } : {}),
        },
      });

      const data = res.data;

      setResidentList(data.data || []);
      setResidentTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setResidentLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [residentPage, residentSearch]);

  const fetchHostels = async () => {
    setLoading(true);

    try {
      const params: any = { page, perPage };
      if (branchFilter) params.branchId = branchFilter;

      const res = await axiosInstance.get("/api/v1/hostels", {
        params,
      });

      const data = res.data;

      setHostels(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hostels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHostelStats = async () => {
    setHostelStatsLoading(true);
    try {
      const params: any = {};
      if (branchFilter) params.branchId = branchFilter;

      const res = await axiosInstance.get("/api/v1/hostels/stats", {
        params,
      });
      const data = res.data?.data || {};

      setHostelStats({
        totalHostels: data.totalHostels ?? 0,
        totalRooms: data.totalRooms ?? 0,
        occupiedRooms: data.occupiedRooms ?? 0,
        availableRooms: data.availableRooms ?? 0,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load hostel statistics",
        variant: "destructive",
      });
    } finally {
      setHostelStatsLoading(false);
    }
  };

  const handleEditRoom = (room: any) => {
    setEditRoomMode(true);
    setSelectedRoomId(room.id);

    setSelectedHostelId(room.hostelId || "");

    setNewRoom({
      roomNumber: room.roomNumber || "",
      block: room.block || "",
      floor: String(room.floor || ""),
      type: room.type || "",
      capacity: String(room.capacity || ""),
    });

    setShowRoomModal(true);
  };

  const handleUpdateRoom = async () => {
    if (!selectedRoomId) return;

    try {
      await axiosInstance.put(`/api/v1/hostels/rooms/${selectedRoomId}`, {
        roomNumber: newRoom.roomNumber,
        floor: String(newRoom.floor),
        block: newRoom.block,
        hostelId: selectedHostelId,
        type: newRoom.type,
        capacity: Number(newRoom.capacity),
      });

      toast({
        title: "Success",
        description: "Room updated successfully",
      });

      setShowRoomModal(false);
      setEditRoomMode(false);
      setSelectedRoomId("");

      fetchRooms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update room",
        variant: "destructive",
      });
    }
  };

  const fetchBranches = async () => {
    setBranchLoading(true);

    try {
      const res = await axiosInstance.get("/api/v1/branches", {
        params: { page: 1, perPage: 100 },
      });

      const branches = res.data.data || [];
      setBranchList(branches);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    } finally {
      setBranchLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);

    try {
      const res = await axiosInstance.get("/api/v1/students", {
        params: { page: 1, perPage: 100 },
      });

      const data = res.data;
      setStudents(data.data?.students || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleCreateHostel = async () => {
    try {
      await axiosInstance.post("/api/v1/hostels", newHostel);

      toast({
        title: "Success",
        description: "Hostel created successfully",
      });

      setShowHostelModal(false);

      setNewHostel({
        name: "",
        phone: "",
        email: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        branchId: "",
      });

      fetchHostels();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create hostel",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/api/v1/hostels/${id}`);

      const data = res.data.data;

      setNewHostel({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        pincode: data.pincode || "",
        city: data.city || "",
        state: data.state || "",
        branchId: data.branchId ? String(data.branchId) : "", // 🔥 FIX
      });

      setSelectedHostelId(id);
      setEditMode(true);
      setShowHostelModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hostel",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hostel? This will remove all rooms.")) return;

    try {
      await axiosInstance.delete(`/api/v1/hostels/${id}`);

      toast({
        title: "Success",
        description: "Hostel deleted successfully",
      });

      fetchHostels();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hostel",
        variant: "destructive",
      });
    }
  };

  const handleUpdateHostel = async () => {
    try {
      await axiosInstance.put(`/api/v1/hostels/${selectedHostelId}`, newHostel);

      toast({
        title: "Success",
        description: "Hostel updated successfully",
      });

      setShowHostelModal(false);
      setEditMode(false);

      fetchHostels();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update hostel",
        variant: "destructive",
      });
    }
  };

  const fetchRooms = async () => {
    setRoomLoading(true);

    try {
      const params: any = {
        page: roomPage,
        perPage: 10,
      };
      if (branchFilter) params.branchId = branchFilter;

      const res = await axiosInstance.get("/api/v1/hostels/rooms", {
        params,
      });

      let rooms = res.data.data || [];

      // 🔥 FILTER LOGIC (frontend)
      if (roomFilter === "available") {
        rooms = rooms.filter((r: any) => r.status === "AVAILABLE");
      } else if (roomFilter === "occupied") {
        rooms = rooms.filter((r: any) => r.status === "OCCUPIED");
      }

      setRoomList(rooms);
      setRoomTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive",
      });
    } finally {
      setRoomLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      await axiosInstance.post("/api/v1/hostels/rooms", {
        roomNumber: newRoom.roomNumber,
        floor: String(newRoom.floor),
        block: newRoom.block,
        hostelId: selectedHostelId, // 🔥 REQUIRED
        type: newRoom.type,
        capacity: Number(newRoom.capacity),
      });

      toast({
        title: "Success",
        description: "Room created successfully",
      });

      setShowRoomModal(false);

      setNewRoom({
        roomNumber: "",
        block: "",
        floor: "",
        type: "",
        capacity: "",
      });

      fetchRooms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;

    try {
      await axiosInstance.delete(`/api/v1/hostels/rooms/${id}`);

      toast({
        title: "Success",
        description: "Room deleted successfully",
      });

      fetchRooms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [roomPage, roomFilter, branchFilter]);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (editMode && branchList.length > 0 && newHostel.branchId) {
      setNewHostel((prev) => ({
        ...prev,
        branchId: String(prev.branchId),
      }));
    }
  }, [branchList]);

  useEffect(() => {
    fetchHostels();
  }, [page, perPage, branchFilter]);

  useEffect(() => {
    fetchHostelStats();
  }, [branchFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Hostel Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage rooms, residents, fees & complaints
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-muted/30 bg-muted/10 p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {isGlobalBranchSelected
              ? `Global branch selected: ${selectedBranch?.name}`
              : "Use the branch filter to scope hostel data locally."}
          </p>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground">
              Branch
            </label>
            <Select
              value={
                isGlobalBranchSelected
                  ? (selectedBranchId ?? "all")
                  : localBranch
              }
              onValueChange={(value) => setLocalBranch(value)}
              disabled={isGlobalBranchSelected}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="All branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {globalBranches?.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-0 shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}
              />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="hostel" className="space-y-5">
          {/* Tabs */}
          <TabsList className="bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="hostel" className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4" />
              Hostel
            </TabsTrigger>

            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              Rooms
            </TabsTrigger>

            <TabsTrigger value="residents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Residents
            </TabsTrigger>
          </TabsList>

          {/* Hostel Tab */}
          <TabsContent value="hostel" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              {/* Search */}
              <div className="relative w-full sm:max-w-sm">
                <Input
                  placeholder="Search hostel..."
                  value={hostelSearch}
                  onChange={(e) => setHostelSearch(e.target.value)}
                  className="pl-10 bg-input dark:bg-input shadow-sm"
                />
                <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setShowHostelModal(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:scale-[1.02] transition"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hostel
              </Button>
            </div>

            {/* Table Card */}
            <Card className="border-0 shadow-xl bg-card dark:bg-card/80 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Hostel</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Location</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {hostels
                    .filter((hostel) => {
                      const query = hostelSearch.toLowerCase();
                      if (!query) return true;
                      return [
                        hostel.name,
                        hostel.city,
                        hostel.address,
                        hostel.phone,
                        branchList.find(
                          (branch) => branch.id === hostel.branchId,
                        )?.name,
                      ]
                        .filter(Boolean)
                        .some((field) =>
                          String(field).toLowerCase().includes(query),
                        );
                    })
                    .map((hostel) => (
                      <TableRow
                        key={hostel.id}
                        className="hover:bg-muted/30 transition"
                      >
                        {/* Hostel Name with Icon */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                              <DoorOpen className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{hostel.name}</span>
                          </div>
                        </TableCell>

                        {/* Branch */}
                        <TableCell>
                          <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-700 text-xs">
                            {branchList.find(
                              (branch) => branch.id === hostel.branchId,
                            )?.name || "Unknown"}
                          </span>
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="font-mono text-sm">
                          {hostel.phone}
                        </TableCell>

                        {/* City */}
                        <TableCell>
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs">
                            {hostel.city}
                          </span>
                        </TableCell>

                        {/* Address */}
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {hostel.address}
                        </TableCell>

                        {/* Status */}
                        {/* <TableCell>
                                <Badge
                                className={
                                    hostel.status === "Active"
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : "bg-gray-100 text-gray-700 border"
                                }
                                >
                                {hostel.status}
                                </Badge>
                            </TableCell> */}

                        <TableCell className="flex justify-center">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(hostel.id)}
                            >
                              <Edit className="h-4 w-4 " />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(hostel.id)}
                            >
                              <Trash2 className="h-4 w-4 " />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {showHostelModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card dark:bg-card rounded-2xl p-6 w-[480px] space-y-5 shadow-2xl border border-border dark:border-border">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Create Hostel</h2>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Hostel Name */}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Hostel Name
                    </label>
                    <div className="relative mt-1">
                      <Input
                        className="pl-10"
                        placeholder="Enter hostel name"
                        value={newHostel.name}
                        onChange={(e) =>
                          setNewHostel({ ...newHostel, name: e.target.value })
                        }
                      />
                      <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Phone
                      </label>
                      <Input
                        placeholder="9876543210"
                        value={newHostel.phone}
                        onChange={(e) =>
                          setNewHostel({ ...newHostel, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">
                        Email
                      </label>
                      <Input
                        placeholder="hostel@mail.com"
                        value={newHostel.email}
                        onChange={(e) =>
                          setNewHostel({ ...newHostel, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Address
                    </label>
                    <Input
                      placeholder="Full address"
                      value={newHostel.address}
                      onChange={(e) =>
                        setNewHostel({ ...newHostel, address: e.target.value })
                      }
                    />
                  </div>

                  {/* City + State */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        City
                      </label>
                      <Input
                        placeholder="City"
                        value={newHostel.city}
                        onChange={(e) =>
                          setNewHostel({ ...newHostel, city: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">
                        State
                      </label>
                      <Input
                        placeholder="State"
                        value={newHostel.state}
                        onChange={(e) =>
                          setNewHostel({ ...newHostel, state: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Pincode + Branch */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Pincode
                      </label>
                      <Input
                        placeholder="302001"
                        value={newHostel.pincode}
                        onChange={(e) =>
                          setNewHostel({
                            ...newHostel,
                            pincode: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">
                        Branch
                      </label>

                      <Select
                        value={newHostel.branchId || ""}
                        disabled={editMode}
                        onValueChange={(value) =>
                          setNewHostel({ ...newHostel, branchId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>

                        <SelectContent>
                          {branchLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : branchList.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              No branches found
                            </SelectItem>
                          ) : (
                            branchList.map((branch: any) => (
                              <SelectItem
                                key={branch.id}
                                value={String(branch.id)}
                              >
                                {branch.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowHostelModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => {
                      if (
                        !newHostel.name ||
                        !newHostel.phone ||
                        !newHostel.branchId
                      ) {
                        alert("Please fill required fields");
                        return;
                      }

                      if (editMode) {
                        handleUpdateHostel();
                      } else {
                        handleCreateHostel();
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editMode ? "Update Hostel" : "Create Hostel"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <TabsContent value="rooms" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              {/* Filters */}
              <div className="flex gap-2">
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger className="w-36 bg-input dark:bg-input shadow-sm">
                    <SelectValue placeholder="🏢 Rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="available">Available Room</SelectItem>
                    <SelectItem value="occupied">Occupied Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <Button
                onClick={() => setShowRoomModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md hover:scale-[1.03] transition"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </div>

            {/* Table */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Room</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {roomList.map((room) => (
                    <TableRow
                      key={room.id}
                      className="hover:bg-muted/30 transition"
                    >
                      {/* Room */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                            <BedDouble className="h-4 w-4" />
                          </div>
                          <span className="font-mono font-medium">
                            {room.roomNumber}
                          </span>
                        </div>
                      </TableCell>

                      {/* Block */}
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-600 text-xs">
                          Block {room.block}
                        </span>
                      </TableCell>

                      {/* Floor */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          Floor {room.floor}
                        </span>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                          {room.type}
                        </span>
                      </TableCell>

                      {/* Capacity */}
                      <TableCell className="font-semibold">
                        {room.capacity}
                      </TableCell>

                      {/* Occupied */}
                      <TableCell>
                        <div className="text-sm">
                          {room.students}/{room.capacity}
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-1.5 bg-indigo-500 rounded-full"
                              style={{
                                width: `${(room.students / room.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={
                            room.status === "OCCUPIED"
                              ? "bg-rose-100 text-rose-700 border"
                              : "bg-emerald-100 text-emerald-700 border"
                          }
                        >
                          {room.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {showRoomModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[480px] space-y-5 shadow-2xl border">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                    <BedDouble className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Add Room</h2>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Hostel
                    </label>

                    <Select
                      value={selectedHostelId}
                      onValueChange={(value) => setSelectedHostelId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Hostel" />
                      </SelectTrigger>

                      <SelectContent>
                        {hostels.map((h: any) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Number */}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Room Number
                    </label>
                    <Input
                      placeholder="R101"
                      value={newRoom.roomNumber}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomNumber: e.target.value })
                      }
                    />
                  </div>

                  {/* Block + Floor */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Block
                      </label>
                      <Input
                        placeholder="A"
                        value={newRoom.block}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, block: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">
                        Floor
                      </label>
                      <Input
                        placeholder="1st Flor"
                        value={newRoom.floor}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, floor: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Type + Capacity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Room Type
                      </label>
                      <Input
                        placeholder="AC"
                        value={newRoom.type}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, type: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">
                        Capacity
                      </label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={newRoom.capacity}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, capacity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRoomModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={editRoomMode ? handleUpdateRoom : handleCreateRoom}
                    className="bg-indigo-600 text-white"
                  >
                    {editRoomMode ? "Update Room" : "Create Room"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ================= RESIDENT TAB ================= */}
          <TabsContent value="residents" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
              <div className="relative w-full sm:max-w-sm">
                <Input
                  placeholder="Search residents..."
                  value={residentSearch}
                  onChange={(e) => {
                    setResidentPage(1);
                    setResidentSearch(e.target.value);
                  }}
                  className="pl-10 bg-white shadow-sm"
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <Button
                onClick={() => {
                  setShowAssignModal(true);
                  fetchStudents();
                  fetchHostels();
                  fetchRooms();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign Room
              </Button>
            </div>

            {/* Table */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {residentList.map((r) => (
                    <TableRow key={r.id}>
                      {/* Student */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                            {r.student?.name?.charAt(0) || "?"}
                          </div>
                          {r.student?.name || "N/A"}
                        </div>
                      </TableCell>

                      {/* Class */}
                      <TableCell>{r.student?.class?.name || "-"}</TableCell>

                      {/* Room */}
                      <TableCell>{r.room?.roomNumber || "-"}</TableCell>

                      {/* Block */}
                      <TableCell>
                        {r.room?.block ? `Block ${r.room.block}` : "-"}
                      </TableCell>

                      {/* Check-in */}
                      <TableCell>
                        {r.assignedAt
                          ? new Date(r.assignedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {r.status === "ACTIVE" ? "Active" : "Vacated"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="flex gap-2">
                        {/* VACATE → API */}
                        {r.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (!confirm("Vacate this room assignment?"))
                                return;

                              try {
                                await axiosInstance.put(
                                  `/api/v1/hostels/assignments/${r.id}/vacate`,
                                );

                                toast({
                                  title: "Success",
                                  description: "Room vacated successfully",
                                });

                                fetchAssignments(); // 🔥 IMPORTANT
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description:
                                    error?.response?.data?.message ||
                                    "Failed to vacate room",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Page {residentPage} of {residentTotalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setResidentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={residentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setResidentPage((prev) =>
                      Math.min(prev + 1, residentTotalPages),
                    )
                  }
                  disabled={residentPage >= residentTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ================= ASSIGN MODAL ================= */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
                <h2 className="text-lg font-semibold">Assign Room</h2>

                {/* Student */}
                <Select
                  value={assignData.studentId}
                  onValueChange={(value) =>
                    setAssignData({ ...assignData, studentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={String(student.id)}>
                        {student.name} - {student.section?.class?.name}{" "}
                        {student.section?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Hostel */}
                <Select
                  value={assignData.hostelId}
                  onValueChange={(value) =>
                    setAssignData({ ...assignData, hostelId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id}>
                        {hostel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Room */}
                <Select
                  value={assignData.roomId}
                  onValueChange={(value) =>
                    setAssignData({ ...assignData, roomId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomList.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date */}
                <Input
                  type="date"
                  value={assignData.checkIn}
                  onChange={(e) =>
                    setAssignData({ ...assignData, checkIn: e.target.value })
                  }
                />

                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowAssignModal(false)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={async () => {
                      if (
                        !assignData.studentId ||
                        !assignData.hostelId ||
                        !assignData.roomId ||
                        !assignData.checkIn
                      ) {
                        alert("Please fill all fields");
                        return;
                      }

                      try {
                        await axiosInstance.post(
                          "/api/v1/hostels/assignments",
                          {
                            studentId: assignData.studentId,
                            hostelId: assignData.hostelId,
                            roomId: assignData.roomId,
                            assignedAt: assignData.checkIn,
                          },
                        );

                        toast({
                          title: "Success",
                          description: "Room assigned",
                        });

                        setShowAssignModal(false);
                        fetchAssignments(); // 🔥 REFRESH

                        setAssignData({
                          studentId: "",
                          roomId: "",
                          hostelId: "",
                          checkIn: "",
                        });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description:
                            error?.response?.data?.message || "Failed",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Page;
