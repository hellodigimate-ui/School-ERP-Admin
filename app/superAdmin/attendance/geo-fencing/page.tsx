// /* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  MapPin, Plus,  CheckCircle, XCircle, Navigation,
  TrendingUp, Search, Download,  Globe, Target
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const stats = [
  { label: "Active Zones", value: "4", icon: Target, gradient: "gradient-hero", change: "All configured" },
  { label: "Inside Zone", value: "392", icon: CheckCircle, gradient: "gradient-green", change: "94.9% present" },
  { label: "Outside Zone", value: "21", icon: XCircle, gradient: "gradient-pink", change: "5.1% absent" },
  { label: "Geo-tagged Today", value: "413", icon: Navigation, gradient: "gradient-blue", change: "+52 in last hour" },
];

const zones = [
  { id: 1, name: "School Campus", radius: "500m", lat: "28.6139", lng: "77.2090", devices: 342, status: "Active", color: "gradient-hero" },
  { id: 2, name: "Sports Ground", radius: "200m", lat: "28.6145", lng: "77.2085", devices: 48, status: "Active", color: "gradient-green" },
  { id: 3, name: "Bus Stop Area", radius: "100m", lat: "28.6130", lng: "77.2100", devices: 23, status: "Active", color: "gradient-blue" },
  { id: 4, name: "Hostel Block", radius: "150m", lat: "28.6150", lng: "77.2075", devices: 86, status: "Active", color: "gradient-orange" },
];

const geoLogs = [
  { id: 1, student: "Aarav Patel", class: "10-A", zone: "School Campus", lat: "28.6140", lng: "77.2089", time: "07:52 AM", accuracy: "5m", status: "Inside" },
  { id: 2, student: "Priya Sharma", class: "10-A", zone: "School Campus", lat: "28.6138", lng: "77.2091", time: "07:55 AM", accuracy: "3m", status: "Inside" },
  { id: 3, student: "Rohit Kumar", class: "10-A", zone: "Bus Stop Area", lat: "28.6131", lng: "77.2099", time: "07:58 AM", accuracy: "8m", status: "Inside" },
  { id: 4, student: "Meera Das", class: "10-B", zone: "-", lat: "28.6200", lng: "77.2150", time: "08:05 AM", accuracy: "12m", status: "Outside" },
  { id: 5, student: "Ananya Singh", class: "10-B", zone: "School Campus", lat: "28.6142", lng: "77.2088", time: "08:01 AM", accuracy: "4m", status: "Inside" },
  { id: 6, student: "Kiran Yadav", class: "10-B", zone: "Sports Ground", lat: "28.6146", lng: "77.2084", time: "08:10 AM", accuracy: "6m", status: "Inside" },
];

const Page = () => {
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
              <MapPin className="w-7 h-7 text-primary" /> Geo-Fencing Attendance
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Location-based attendance with geo-tagging & zone management</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-hero text-primary-foreground shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Create Geo-Fence Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Zone Name</Label>
                  <Input placeholder="e.g. School Campus" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input placeholder="28.6139" />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input placeholder="77.2090" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Radius</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select radius" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 meters</SelectItem>
                      <SelectItem value="100">100 meters</SelectItem>
                      <SelectItem value="200">200 meters</SelectItem>
                      <SelectItem value="500">500 meters</SelectItem>
                      <SelectItem value="1000">1 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-hero text-primary-foreground">Create Zone</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Card key={i} className="card-hover border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-12 h-12 rounded-xl ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
                <div className="px-5 py-2 bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {s.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map + Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mock Map */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1 gradient-aurora" />
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Zone Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted/30 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center relative overflow-hidden">
                  {/* Simulated map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50" />
                  <div className="relative z-10 text-center">
                    <Globe className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">Interactive Map View</p>
                    <p className="text-xs text-muted-foreground mt-1">Showing 4 geo-fence zones</p>
                    <div className="flex gap-2 mt-3 justify-center">
                      {zones.map((z) => (
                        <div key={z.id} className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${z.color}`} />
                          <span className="text-[10px] text-muted-foreground">{z.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone List */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 gradient-hero" />
            <CardHeader>
              <CardTitle className="text-lg font-display">Active Zones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((zone) => (
                <Card key={zone.id} className="card-hover border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${zone.color} flex items-center justify-center`}>
                        <Target className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">Radius: {zone.radius} · {zone.devices} devices</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-xs">{zone.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Geo Log */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 gradient-blue" />
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-display">Geo-Tag Log</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 w-56" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geoLogs.filter(l => l.student.toLowerCase().includes(search.toLowerCase())).map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{log.student}</TableCell>
                    <TableCell><Badge variant="outline">{log.class}</Badge></TableCell>
                    <TableCell className="text-sm">{log.zone}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{log.lat}, {log.lng}</TableCell>
                    <TableCell className="text-sm font-mono">{log.time}</TableCell>
                    <TableCell className="text-sm">±{log.accuracy}</TableCell>
                    <TableCell>
                      <Badge className={`border text-xs ${log.status === "Inside" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Page;
