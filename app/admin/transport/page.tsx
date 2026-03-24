/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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

const vehicles = [
  {
    id: "KA-01-1234",
    type: "Bus",
    capacity: 50,
    year: 2022,
    insurance: "2026-08-15",
    fitness: "2026-12-31",
    status: "Active",
  },
  {
    id: "KA-01-5678",
    type: "Bus",
    capacity: 45,
    year: 2021,
    insurance: "2026-05-20",
    fitness: "2026-11-30",
    status: "Active",
  },
  {
    id: "KA-01-9012",
    type: "Mini Bus",
    capacity: 30,
    year: 2023,
    insurance: "2027-01-10",
    fitness: "2027-06-30",
    status: "Active",
  },
  {
    id: "KA-01-3456",
    type: "Van",
    capacity: 15,
    year: 2020,
    insurance: "2026-03-01",
    fitness: "2026-09-30",
    status: "Maintenance",
  },
];

const pickupPoints = [
  {
    id: 1,
    name: "Central Park Gate",
    route: "Route A",
    time: "7:15 AM",
    students: 8,
  },
  {
    id: 2,
    name: "Mall Road Junction",
    route: "Route A",
    time: "7:25 AM",
    students: 6,
  },
  {
    id: 3,
    name: "Railway Station",
    route: "Route B",
    time: "7:10 AM",
    students: 12,
  },
  {
    id: 4,
    name: "City Hospital",
    route: "Route B",
    time: "7:20 AM",
    students: 5,
  },
  { id: 5, name: "MG Road", route: "Route C", time: "7:00 AM", students: 10 },
  { id: 6, name: "Tech Park", route: "Route D", time: "7:30 AM", students: 7 },
];

const Page = () => {
  const stats = [
    {
      label: "Total Routes",
      value: "12",
      icon: Route,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Total Vehicles",
      value: "18",
      icon: Bus,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Students Using",
      value: "856",
      icon: Users,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Pickup Points",
      value: "96",
      icon: MapPin,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Route A",
      stops: 5,
      students: 30,
      driver: "Ramesh",
      bus: "RJ14-1234",
      distance: "12 km",
      time: "30 min",
    },
  ]);

  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    stops: "",
    students: "",
    driver: "",
    bus: "",
    distance: "",
    time: "",
  });

  const [vehicleList, setVehicleList] = useState(vehicles);
  const [vehicleSearch, setVehicleSearch] = useState("");

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
  });

  const [pickupList, setPickupList] = useState(pickupPoints);
  const [pickupSearch, setPickupSearch] = useState("");

  const [isPickupAddOpen, setIsPickupAddOpen] = useState(false);
  const [isPickupEditOpen, setIsPickupEditOpen] = useState(false);

  const [selectedPickup, setSelectedPickup] = useState<any>(null);

  const [pickupForm, setPickupForm] = useState({
    id: "",
    name: "",
    route: "",
    time: "",
    students: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      stops: "",
      students: "",
      driver: "",
      bus: "",
      distance: "",
      time: "",
    });
  };

  const handleAdd = () => {
    setRoutes(
      (prev) =>
        [
          ...prev,
          {
            id: Date.now(),
            ...form,
            stops: parseInt(form.stops) || 0,
            students: parseInt(form.students) || 0,
          },
        ] as any,
    );
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditClick = (route: any) => {
    setSelectedRoute(route);
    setForm(route);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === selectedRoute.id ? { ...selectedRoute, ...form } : r,
      ),
    );
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
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
    });
  };

  const handleVehicleAdd = () => {
    setVehicleList(
      (prev) =>
        [
          ...prev,
          {
            ...vehicleForm,
            capacity: parseInt(vehicleForm.capacity) || 0,
            year: parseInt(vehicleForm.year) || 0,
          },
        ] as any,
    );
    setIsVehicleAddOpen(false);
    resetVehicleForm();
  };

  const handleVehicleEditClick = (v: any) => {
    setSelectedVehicle(v);
    setVehicleForm(v);
    setIsVehicleEditOpen(true);
  };

  const handleVehicleUpdate = () => {
    setVehicleList((prev) =>
      prev.map((v) =>
        v.id === selectedVehicle.id
          ? { ...selectedVehicle, ...vehicleForm }
          : v,
      ),
    );
    setIsVehicleEditOpen(false);
    resetVehicleForm();
  };

  const handleVehicleDelete = (id: string) => {
    setVehicleList((prev) => prev.filter((v) => v.id !== id));
  };

  const resetPickupForm = () => {
    setPickupForm({
      id: "",
      name: "",
      route: "",
      time: "",
      students: "",
    });
  };

  const handlePickupAdd = () => {
    setPickupList(
      (prev) =>
        [
          ...prev,
          {
            ...pickupForm,
            id: Date.now(),
            students: parseInt(pickupForm.students) || 0,
          },
        ] as any,
    );
    setIsPickupAddOpen(false);
    resetPickupForm();
  };

  const handlePickupEditClick = (p: any) => {
    setSelectedPickup(p);
    setPickupForm(p);
    setIsPickupEditOpen(true);
  };

  const handlePickupUpdate = () => {
    setPickupList((prev) =>
      prev.map((p) =>
        p.id === selectedPickup.id ? { ...selectedPickup, ...pickupForm } : p,
      ),
    );
    setIsPickupEditOpen(false);
    resetPickupForm();
  };

  const handlePickupDelete = (id: number) => {
    setPickupList((prev) => prev.filter((p) => p.id !== id));
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

        <Tabs defaultValue="routes" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="pickup">Pickup Points</TabsTrigger>
          </TabsList>

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
                            {route.stops} Stops
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            {route.students}
                          </Badge>
                        </TableCell>

                        <TableCell>{route.driver}</TableCell>

                        <TableCell className="font-mono text-sm">
                          {route.bus}
                        </TableCell>

                        <TableCell>{route.distance}</TableCell>

                        <TableCell>
                          <Badge variant="outline">{route.time}</Badge>
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Route</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(form).map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={(form as any)[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handleAdd} className="w-full mt-3">
                    Add Route
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Route</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(form).map((key) => (
                      <Input
                        key={key}
                        value={(form as any)[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handleUpdate} className="w-full mt-3">
                    Update Route
                  </Button>
                </DialogContent>
              </Dialog>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-5">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Input
                placeholder="🔍 Search vehicles..."
                className="max-w-sm bg-white shadow-sm"
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
            <Card className="shadow-lg border-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50">
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
                      v.id.toLowerCase().includes(vehicleSearch.toLowerCase()),
                    )
                    .map((v) => (
                      <TableRow
                        key={v.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <TableCell className="font-mono font-semibold text-emerald-600">
                          {v.id}
                        </TableCell>

                        <TableCell>{v.type}</TableCell>

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {v.capacity}
                          </Badge>
                        </TableCell>

                        <TableCell>{v.year}</TableCell>

                        <TableCell>{v.insurance}</TableCell>

                        <TableCell>{v.fitness}</TableCell>

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

              <Dialog
                open={isVehicleAddOpen}
                onOpenChange={setIsVehicleAddOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Vehicle</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(vehicleForm).map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={(vehicleForm as any)[key]}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handleVehicleAdd} className="w-full mt-3">
                    Add Vehicle
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isVehicleEditOpen}
                onOpenChange={setIsVehicleEditOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(vehicleForm).map((key) => (
                      <Input
                        key={key}
                        value={(vehicleForm as any)[key]}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handleVehicleUpdate} className="w-full mt-3">
                    Update Vehicle
                  </Button>
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
                          <Badge variant="outline">{p.route}</Badge>
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Pickup Point</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(pickupForm).map((key) => (
                      <Input
                        key={key}
                        placeholder={key}
                        value={(pickupForm as any)[key]}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handlePickupAdd} className="w-full mt-3">
                    Add Point
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isPickupEditOpen}
                onOpenChange={setIsPickupEditOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Pickup Point</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(pickupForm).map((key) => (
                      <Input
                        key={key}
                        value={(pickupForm as any)[key]}
                        onChange={(e) =>
                          setPickupForm({
                            ...pickupForm,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ))}
                  </div>

                  <Button onClick={handlePickupUpdate} className="w-full mt-3">
                    Update Point
                  </Button>
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
