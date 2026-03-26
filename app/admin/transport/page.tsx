/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Bus,
  MapPin,
  Users,
  Plus,
  Route,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/apiHome/axiosInstanc";
// import { time } from "console";

const API_URL = "/api/v1/transport";
const DEFAULT_BRANCH_ID = "demo-branch-id"; // adjust to your branch id or set in localStorage

const getBranchId = () => {
  if (typeof window === "undefined") return DEFAULT_BRANCH_ID;
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("branchId") || DEFAULT_BRANCH_ID
    : DEFAULT_BRANCH_ID;
};

const Page: React.FC = () => {
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    totalPickupPoints: 0,
  });

  const [routes, setRoutes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    students: "",
    driver: "", // will store driverId
    bus: "", // will store vehicleId
    distance: "",
    branchId: getBranchId(),
  });

  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState("");

  const [drivers, setDrivers] = useState<any[]>([]);

  const [isVehicleAddOpen, setIsVehicleAddOpen] = useState(false);
  const [isVehicleEditOpen, setIsVehicleEditOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const [vehicleForm, setVehicleForm] = useState({
    id: "",
    type: "",
    capacity: "",
    year: "",
    insurance: "",
    fitness: "",
    status: "Active",
    driverId: "",
    branchId: getBranchId(),
  });

  const [pickupList, setPickupList] = useState<any[]>([]);
  const [pickupSearch, setPickupSearch] = useState("");

  const [branches, setBranches] = useState<any[]>([]);

  const [isPickupAddOpen, setIsPickupAddOpen] = useState(false);
  const [isPickupEditOpen, setIsPickupEditOpen] = useState(false);

  const [selectedPickup, setSelectedPickup] = useState<any>(null);

  const [pickupForm, setPickupForm] = useState({
    id: "",
    name: "",
    route: "",
    time: "",
    students: "",
    address: "",
    vehicleId: "",
    branchId: getBranchId(),
  });

  const statsCards = [
    {
      label: "Total Routes",
      value: stats.totalRoutes,
      icon: Route,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Bus,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Active Vehicles",
      value: stats.activeVehicles,
      icon: Users,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Pickup Points",
      value: stats.totalPickupPoints,
      icon: MapPin,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get(`${API_URL}/stats`);
      if (data?.data) setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch transport stats", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data } = await axiosInstance.get(`${API_URL}/routes`, {
        params: {
          page: 1,
          limit: 100,
          search,
        },
      });
      setRoutes(data.data || []);
    } catch (error) {
      console.error("Failed to fetch routes", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data } = await axiosInstance.get(`${API_URL}/vehicles`, {
        params: {
          page: 1,
          limit: 200,
        },
      });
      setVehicleList(data.data || []);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    }
  };

  const fetchPickupPoints = async () => {
    try {
      const { data } = await axiosInstance.get(`${API_URL}/pickup-points`, {
        params: {
          page: 1,
          limit: 200,
        },
      });
      setPickupList(data.data || []);
    } catch (error) {
      console.error("Failed to fetch pickup points", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const branchId = getBranchId();
      const { data } = await axiosInstance.get(`/api/v1/staff?role=DRIVER`, {
        params: {
          page: 1,
          perPage: 200,
          branch: branchId,
        },
      });
      console.log("Fetched drivers:", data);
      setDrivers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/v1/branches`, {
        params: {
          page: 1,
          perPage: 200,
        },
      });
      setBranches(data.data || []);
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRoutes();
    fetchVehicles();
    fetchPickupPoints();
    fetchDrivers();
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [search]);

  const resetForm = () => {
    setForm({
      name: "",
      students: "",
      driver: "",
      bus: "",
      distance: "",
      branchId: getBranchId(),
    });
  };

  const resetVehicleForm = () => {
    setVehicleForm({
      id: "",
      type: "",
      capacity: "",
      year: "",
      insurance: "",
      fitness: "",
      status: "Active",
      driverId: "",
      branchId: getBranchId(),
    });
  };

  const resetPickupForm = () => {
    setPickupForm({
      id: "",
      name: "",
      route: "",
      time: "",
      students: "",
      address: "",
      vehicleId: "",
      branchId: getBranchId(),
    });
  };

  const handleAdd = async () => {
    try {
      // const branchId = getBranchId();

      await axiosInstance.post(`${API_URL}/routes`, {
        name: form.name,
        students: String(form.students),
        driverId: form.driver, // 🔥 FIX
        vehicleId: form.bus,
        distance: Number(form.distance),
        branchId: form.branchId, // 🔥 use selected branch
      });

      setIsAddOpen(false);
      resetForm();
      fetchRoutes();
      fetchStats();
    } catch (error) {
      console.error("Failed to add route", error);
    }
  };

  const handleEditClick = (route: any) => {
    setSelectedRoute(route);

    setForm({
      name: route?.name || "",
      students: String(route?.students || ""),
      driver: route?.driver?.id || route?.driver || "",
      bus: route?.vehicleId || route?.vehicle?.id || "",
      distance: String(route?.distance || ""),
      branchId: getBranchId(),
    });

    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!selectedRoute?.id) return;

      await axiosInstance.put(`${API_URL}/routes/${selectedRoute.id}`, {
        name: form.name,
        students: String(form.students),
        driver: form.driver,
        vehicleId: form.bus,
        distance: Number(form.distance),
        branchId: getBranchId(), // 🔥 IMPORTANT
      });

      setIsEditOpen(false);
      resetForm();
      fetchRoutes();
      fetchStats();
    } catch (error) {
      console.error("Failed to update route", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this route?")) return;
    try {
      await axiosInstance.delete(`${API_URL}/routes/${id}`);
      fetchRoutes();
      fetchStats();
    } catch (error) {
      console.error("Failed to delete route", error);
    }
  };

  const handleVehicleAdd = async () => {
    try {
      const branchId = vehicleForm.branchId || getBranchId();

      await axiosInstance.post(`${API_URL}/vehicles`, {
        vehicle_no: vehicleForm.id,
        type: vehicleForm.type,
        year: String(vehicleForm.year || 0),
        insurance: vehicleForm.insurance || null,
        service: vehicleForm.fitness || null,
        capacity: Number(vehicleForm.capacity || 0),
        status: vehicleForm.status,
        branchId,
        driverId: vehicleForm.driverId || null,
      });

      setIsVehicleAddOpen(false);
      resetVehicleForm();
      fetchVehicles();
      fetchStats();
    } catch (error) {
      console.error("Failed to add vehicle", error);
    }
  };

  const handleVehicleEditClick = (v: any) => {
    setSelectedVehicle(v);

    setVehicleForm({
      id: v?.vehicle_no || "",
      type: v?.type || "",
      capacity: String(v?.capacity || ""),
      year: String(v?.year || ""),
      insurance: v?.insurance
        ? new Date(v.insurance).toISOString().split("T")[0]
        : "",
      fitness: v?.service
        ? new Date(v.service).toISOString().split("T")[0]
        : "",
      status: v?.status || "Active",
      driverId: v?.driverId || "",
      branchId: v?.branchId || getBranchId(),
    });

    setIsVehicleEditOpen(true);
  };

  const handleVehicleUpdate = async () => {
    try {
      if (!selectedVehicle?.id) return;

      await axiosInstance.put(`${API_URL}/vehicles/${selectedVehicle.id}`, {
        vehicle_no: vehicleForm.id,
        type: vehicleForm.type,
        year: String(vehicleForm.year || 0),
        insurance: vehicleForm.insurance || null,
        service: vehicleForm.fitness || null,
        capacity: Number(vehicleForm.capacity || 0),
        status: vehicleForm.status,
        driverId: vehicleForm.driverId || null,
        branchId: vehicleForm.branchId || getBranchId(),
      });

      setIsVehicleEditOpen(false);
      resetVehicleForm();
      fetchVehicles();
      fetchStats();
    } catch (error) {
      console.error("Failed to update vehicle", error);
    }
  };

  const handleVehicleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await axiosInstance.delete(`${API_URL}/vehicles/${id}`);
      fetchVehicles();
      fetchStats();
    } catch (error) {
      console.error("Failed to delete vehicle", error);
    }
  };

  const handlePickupAdd = async () => {
    try {
      const branchId = pickupForm.branchId || getBranchId();

      await axiosInstance.post(`${API_URL}/pickup-points`, {
        name: pickupForm.name,
        address: pickupForm.address || `${pickupForm.name} address`,
        routeId: pickupForm.route,
        vehicleId: pickupForm.vehicleId || null,
        branchId,
        time: pickupForm.time || "08:00", // default time if not provided
        students: String(pickupForm.students || 0),
        sequence: 0,
      });

      setIsPickupAddOpen(false);
      resetPickupForm();
      fetchPickupPoints();
      fetchStats();
    } catch (error) {
      console.error("Failed to add pickup point", error);
    }
  };

  const handlePickupEditClick = (p: any) => {
    setSelectedPickup(p);

    setPickupForm({
      id: p?.id || "",
      name: p?.name || "",
      route: p?.route?.id || p?.routeId || "",
      time: p?.time || "",
      students: String(p?.capacity || p?.students || ""),
      address: p?.address || "",
      vehicleId: p?.vehicleId || "",
      branchId: p?.branchId || getBranchId(),
    });

    setIsPickupEditOpen(true);
  };

  const handlePickupUpdate = async () => {
    try {
      if (!selectedPickup?.id) return;

      await axiosInstance.put(`${API_URL}/pickup-points/${selectedPickup.id}`, {
        name: pickupForm.name,
        address: pickupForm.address,
        routeId: pickupForm.route,
        vehicleId: pickupForm.vehicleId || null,
        branchId: pickupForm.branchId || getBranchId(),
        capacity: Number(pickupForm.students || 0),
        sequence: 0,
      });

      setIsPickupEditOpen(false);
      resetPickupForm();
      fetchPickupPoints();
      fetchStats();
    } catch (error) {
      console.error("Failed to update pickup point", error);
    }
  };

  const handlePickupDelete = async (id: string) => {
    if (!confirm("Delete this pickup point?")) return;
    try {
      await axiosInstance.delete(`${API_URL}/pickup-points/${id}`);
      fetchPickupPoints();
      fetchStats();
    } catch (error) {
      console.error("Failed to delete pickup point", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transport Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage routes, vehicles, pickup points & tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
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

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="pickup">Pickup Points</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Input
                placeholder="🔍 Search vehicles..."
                className="max-w-sm bg-input dark:bg-input shadow-sm"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
              />

              <Button
                onClick={() => setIsVehicleAddOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </div>

            {/* Table */}
            <Card className="shadow-lg border-0 ">
              <Table>
                <TableHeader>
                  <TableRow className="  dark:bg-gray-700">
                    <TableHead>Vehicle No</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Fitness</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {vehicleList
                    .filter((v) =>
                      (v.vehicle_no || "")
                        .toLowerCase()
                        .includes(vehicleSearch.toLowerCase()),
                    )
                    .map((v) => (
                      <TableRow
                        key={v.id}
                        className="hover:bg-secondary/50 dark:hover:bg-secondary/50 transition"
                      >
                        <TableCell className="font-mono font-semibold text-emerald-600">
                          {v.vehicle_no || v.id}
                        </TableCell>

                        <TableCell>{v.type}</TableCell>

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {v.capacity}
                          </Badge>
                        </TableCell>

                        <TableCell>{v.year}</TableCell>

                        <TableCell>
                          {v.insurance
                            ? new Date(v.insurance).toLocaleDateString()
                            : "-"}
                        </TableCell>

                        <TableCell>
                          {v.service
                            ? new Date(v.service).toLocaleDateString()
                            : "-"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              v.status === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }
                          >
                            {v.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-3">
                            <Edit
                              onClick={() => handleVehicleEditClick(v)}
                              className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110"
                            />

                            <Trash2
                              onClick={() => handleVehicleDelete(v.id)}
                              className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Dialog open={isVehicleAddOpen} onOpenChange={setIsVehicleAddOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-card dark:bg-card shadow-xl">
                  
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-foreground dark:text-foreground text-center">
                      🚗 Add Vehicle
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Vehicle Number */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Vehicle Number</label>
                      <Input
                        placeholder="Enter vehicle number"
                        value={vehicleForm.id}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, id: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Vehicle Type */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Vehicle Type</label>
                      <Input
                        placeholder="e.g. Bus, Van"
                        value={vehicleForm.type}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, type: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Capacity */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Student Capacity</label>
                      <Input
                        type="number"
                        placeholder="Capacity"
                        value={vehicleForm.capacity}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, capacity: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Assign Year</label>
                      <Input
                        type="number"
                        placeholder="Year"
                        value={vehicleForm.year}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, year: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Insurance */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Insurance Date</label>
                      <Input
                        type="date"
                        value={vehicleForm.insurance}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            insurance: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Fitness */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Last Checked</label>
                      <Input
                        type="date"
                        value={vehicleForm.fitness}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            fitness: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-400 border-border dark:border-border"
                      />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Status</label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            status: e.target.value,
                          })
                        }
                        className="border border-border dark:border-border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 bg-input dark:bg-input text-foreground dark:text-foreground"
                      >
                        <option value="Active">🟢 Active</option>
                        <option value="Maintenance">🟡 Maintenance</option>
                      </select>
                    </div>

                    {/* Driver */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Vehicle Driver</label>
                      <select
                        value={vehicleForm.driverId}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            driverId: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name || d.fullName || d.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">
                        Select Branch
                      </label>

                      <div className="relative group">
                        <select
                          value={vehicleForm.branchId}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              branchId: e.target.value,
                            })
                          }
                          className="
                            w-full appearance-none
                            bg-gradient-to-br from-white to-gray-50
                            border border-gray-300
                            px-4 py-2.5 pr-12
                            rounded-xl
                            text-gray-700
                            shadow-sm

                            transition-all duration-200 ease-in-out

                            hover:border-gray-400 hover:shadow-md
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md
                          "
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        {/* Premium Arrow */}
                        <div className="
                          pointer-events-none 
                          absolute inset-y-0 right-3 
                          flex items-center 
                          text-gray-400 
                          group-hover:text-gray-600 
                          transition
                        ">
                          <svg
                            className="w-5 h-5 transform transition-transform duration-200 group-focus-within:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleVehicleAdd}
                      className="w-full py-2 text-lg bg-blue-600 hover:bg-blue-700 transition-all rounded-xl shadow-md"
                    >
                      ➕ Add Vehicle
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>

              <Dialog open={isVehicleEditOpen} onOpenChange={setIsVehicleEditOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-white shadow-xl">

                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-800 text-center">
                      ✏️ Edit Vehicle
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Vehicle Number */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Vehicle Number</label>
                      <Input
                        value={vehicleForm.id}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, id: e.target.value })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Vehicle Type</label>
                      <Input
                        value={vehicleForm.type}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, type: e.target.value })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Capacity */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Student Capacity</label>
                      <Input
                        type="number"
                        value={vehicleForm.capacity}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            capacity: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Assign Year</label>
                      <Input
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) =>
                          setVehicleForm({ ...vehicleForm, year: e.target.value })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Insurance */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Insurance Date</label>
                      <Input
                        type="date"
                        value={vehicleForm.insurance}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            insurance: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Fitness */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Last Checked</label>
                      <Input
                        type="date"
                        value={vehicleForm.fitness}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            fitness: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="relative">
                        <select
                          value={vehicleForm.status}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              status: e.target.value,
                            })
                          }
                          className="w-full appearance-none border border-gray-300 bg-white px-4 py-2.5 pr-10 rounded-xl shadow-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Active">🟢 Active</option>
                          <option value="Maintenance">🟡 Maintenance</option>
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Driver */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Vehicle Driver</label>
                      <div className="relative">
                        <select
                          value={vehicleForm.driverId}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              driverId: e.target.value,
                            })
                          }
                          className="w-full appearance-none border border-gray-300 bg-white px-4 py-2.5 pr-10 rounded-xl shadow-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name || d.fullName || d.email}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Select Branch</label>
                      <div className="relative">
                        <select
                          value={vehicleForm.branchId}
                          onChange={(e) =>
                            setVehicleForm({
                              ...vehicleForm,
                              branchId: e.target.value,
                            })
                          }
                          className="w-full appearance-none border border-gray-300 bg-white px-4 py-2.5 pr-10 rounded-xl shadow-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Update Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleVehicleUpdate}
                      className="w-full py-2 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
                    >
                      💾 Update Vehicle
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Input
                  placeholder="🔍 Search routes..."
                  className="pl-4 bg-white shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setIsAddOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Route
              </Button>
            </div>

            {/* Table */}
            <Card className="shadow-lg border-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableHead>Route</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {routes
                    .filter((r) =>
                      r.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((route) => (
                      <TableRow
                        key={route.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <TableCell className="font-semibold text-blue-600">
                          {route.name}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {route.PickupPoint?.length || 0} Stops
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            {route.students}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {typeof route.driver === "string"
                            ? route.driver
                            : route.driver?.name || route.drivers?.name || "-"}
                        </TableCell>

                        <TableCell className="font-mono text-sm">
                          {route.vehicle?.vehicle_no || route.vehicleId}
                        </TableCell>

                        <TableCell>
                          {route.distance ? `${route.distance} km` : "-"}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{route.time || "-"}</Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-3">
                            <Edit
                              onClick={() => handleEditClick(route)}
                              className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110"
                            />

                            <Trash2
                              onClick={() => handleDelete(route.id)}
                              className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-xl">

                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                      🛣️ Add Route
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Route Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Route Name</label>
                      <Input
                        placeholder="Enter route name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Students */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Number of Students</label>
                      <Input
                        placeholder="Enter student count"
                        value={form.students}
                        onChange={(e) =>
                          setForm({ ...form, students: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Driver */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Driver</label>
                      <div className="relative">
                        <select
                          value={form.driver}
                          onChange={(e) =>
                            setForm({ ...form, driver: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Vehicle</label>
                      <div className="relative">
                        <select
                          value={form.bus}
                          onChange={(e) =>
                            setForm({ ...form, bus: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Vehicle</option>
                          {vehicleList.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.vehicle_no}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Distance (km)</label>
                      <Input
                        placeholder="Enter distance"
                        value={form.distance}
                        onChange={(e) =>
                          setForm({ ...form, distance: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Branch</label>
                      <div className="relative">
                        <select
                          value={form.branchId}
                          onChange={(e) =>
                            setForm({ ...form, branchId: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleAdd}
                      className="w-full py-2 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 
                      hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all"
                    >
                      ➕ Add Route
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 shadow-xl">

                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                      ✏️ Edit Route
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Route Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Route Name</label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Students */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Number of Students</label>
                      <Input
                        value={form.students}
                        onChange={(e) =>
                          setForm({ ...form, students: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Driver */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Driver</label>
                      <div className="relative">
                        <select
                          value={form.driver}
                          onChange={(e) =>
                            setForm({ ...form, driver: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((d: any) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Vehicle</label>
                      <div className="relative">
                        <select
                          value={form.bus}
                          onChange={(e) =>
                            setForm({ ...form, bus: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Vehicle</option>
                          {vehicleList.map((v: any) => (
                            <option key={v.id} value={v.id}>
                              {v.vehicle_no}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Distance (km)</label>
                      <Input
                        value={form.distance}
                        onChange={(e) =>
                          setForm({ ...form, distance: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Branch</label>
                      <div className="relative">
                        <select
                          value={form.branchId}
                          onChange={(e) =>
                            setForm({ ...form, branchId: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleUpdate}
                      className="w-full py-2 text-lg rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 
                      hover:from-indigo-700 hover:to-blue-700 text-white shadow-md transition-all"
                    >
                      💾 Update Route
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>
              
            </Card>
          </TabsContent>

          <TabsContent value="pickup" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Input
                placeholder="🔍 Search pickup points..."
                className="max-w-sm bg-white shadow-sm"
                value={pickupSearch}
                onChange={(e) => setPickupSearch(e.target.value)}
              />

              <Button
                onClick={() => setIsPickupAddOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Point
              </Button>
            </div>

            {/* Table */}
            <Card className="shadow-lg border-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <TableHead>Pickup Point</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pickupList
                    .filter((p) =>
                      p.name.toLowerCase().includes(pickupSearch.toLowerCase()),
                    )
                    .map((p) => (
                      <TableRow
                        key={p.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <TableCell className="font-medium flex items-center gap-2 text-rose-600">
                          <MapPin className="h-4 w-4 text-rose-500" />
                          {p.name}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {p.route?.name || p.route}
                          </Badge>
                        </TableCell>

                        <TableCell className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {p.time}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {p.students}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-3">
                            <Edit
                              onClick={() => handlePickupEditClick(p)}
                              className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110"
                            />

                            <Trash2
                              onClick={() => handlePickupDelete(p.id)}
                              className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Dialog open={isPickupAddOpen} onOpenChange={setIsPickupAddOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50 shadow-xl">

                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                      📍 Add Pickup Point
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Pickup Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Pickup Point Name</label>
                      <Input
                        placeholder="Enter pickup name"
                        value={pickupForm.name}
                        onChange={(e) =>
                          setPickupForm({ ...pickupForm, name: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Route */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Route</label>
                      <div className="relative">
                        <select
                          value={pickupForm.route}
                          onChange={(e) =>
                            setPickupForm({ ...pickupForm, route: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select Route</option>
                          {routes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Pickup Time */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Pickup Time</label>
                      <Input
                        type="time"
                        value={pickupForm.time}
                        onChange={(e) =>
                          setPickupForm({ ...pickupForm, time: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Students */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Number of Students</label>
                      <Input
                        type="number"
                        placeholder="Enter students"
                        value={pickupForm.students}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            students: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <Input
                        placeholder="Enter address"
                        value={pickupForm.address}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            address: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Vehicle */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Vehicle</label>
                      <div className="relative">
                        <select
                          value={pickupForm.vehicleId}
                          onChange={(e) =>
                            setPickupForm({
                              ...pickupForm,
                              vehicleId: e.target.value,
                            })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select Vehicle</option>
                          {vehicleList.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.vehicle_no}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Branch</label>
                      <div className="relative">
                        <select
                          value={pickupForm.branchId}
                          onChange={(e) =>
                            setPickupForm({
                              ...pickupForm,
                              branchId: e.target.value,
                            })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handlePickupAdd}
                      className="w-full py-2 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                      hover:from-purple-700 hover:to-pink-700 text-white shadow-md transition-all"
                    >
                      ➕ Add Pickup Point
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>

              <Dialog open={isPickupEditOpen} onOpenChange={setIsPickupEditOpen}>
                <DialogContent className="max-w-3xl p-6 rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-xl">

                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
                      ✏️ Edit Pickup Point
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Pickup Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Pickup Point Name</label>
                      <Input
                        value={pickupForm.name}
                        onChange={(e) =>
                          setPickupForm({ ...pickupForm, name: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Route */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Route</label>
                      <div className="relative">
                        <select
                          value={pickupForm.route}
                          onChange={(e) =>
                            setPickupForm({ ...pickupForm, route: e.target.value })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Select Route</option>
                          {routes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Pickup Time</label>
                      <Input
                        type="time"
                        value={pickupForm.time}
                        onChange={(e) =>
                          setPickupForm({ ...pickupForm, time: e.target.value })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Students */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Number of Students</label>
                      <Input
                        type="number"
                        value={pickupForm.students}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            students: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <Input
                        value={pickupForm.address}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            address: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Vehicle */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Vehicle</label>
                      <div className="relative">
                        <select
                          value={pickupForm.vehicleId}
                          onChange={(e) =>
                            setPickupForm({
                              ...pickupForm,
                              vehicleId: e.target.value,
                            })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Select Vehicle</option>
                          {vehicleList.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.vehicle_no}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">Select Branch</label>
                      <div className="relative">
                        <select
                          value={pickupForm.branchId}
                          onChange={(e) =>
                            setPickupForm({
                              ...pickupForm,
                              branchId: e.target.value,
                            })
                          }
                          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-xl shadow-sm
                          focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handlePickupUpdate}
                      className="w-full py-2 text-lg rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 
                      hover:from-pink-700 hover:to-rose-700 text-white shadow-md transition-all"
                    >
                      💾 Update Pickup Point
                    </Button>
                  </div>

                </DialogContent>
              </Dialog>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Page;
