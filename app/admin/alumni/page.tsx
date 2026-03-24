"use client"


import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Users,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const alumniData = [
  { id: 1, name: "Ankit Sharma", batch: "2020", class: "12-A", phone: "9876543210", email: "ankit@email.com", occupation: "Software Engineer", company: "TCS", city: "Mumbai", status: "Active" },
  { id: 2, name: "Priya Patel", batch: "2019", class: "12-B", phone: "9876543211", email: "priya@email.com", occupation: "Doctor", company: "AIIMS", city: "Delhi", status: "Active" },
  { id: 3, name: "Vikram Singh", batch: "2021", class: "12-A", phone: "9876543212", email: "vikram@email.com", occupation: "CA", company: "Deloitte", city: "Bangalore", status: "Active" },
  { id: 4, name: "Sneha Gupta", batch: "2018", class: "12-C", phone: "9876543213", email: "sneha@email.com", occupation: "Teacher", company: "DPS School", city: "Jaipur", status: "Inactive" },
  { id: 5, name: "Rajesh Kumar", batch: "2020", class: "12-B", phone: "9876543214", email: "rajesh@email.com", occupation: "Entrepreneur", company: "Self", city: "Pune", status: "Active" },
  { id: 6, name: "Meera Nair", batch: "2017", class: "12-A", phone: "9876543215", email: "meera@email.com", occupation: "Lawyer", company: "High Court", city: "Chennai", status: "Active" },
];

const eventsData = [
  { id: 1, title: "Annual Alumni Meet 2026", date: "2026-03-15", venue: "School Auditorium", type: "Reunion", attendees: 120, status: "Upcoming", description: "Annual gathering of all alumni batches." },
  { id: 2, title: "Career Guidance Workshop", date: "2026-02-28", venue: "Conference Hall", type: "Workshop", attendees: 45, status: "Upcoming", description: "Alumni sharing career insights with current students." },
  { id: 3, title: "Alumni Cricket Tournament", date: "2026-01-20", venue: "School Ground", type: "Sports", attendees: 60, status: "Completed", description: "Inter-batch cricket competition." },
  { id: 4, title: "Fundraiser Gala Night", date: "2025-12-10", venue: "Hotel Grand", type: "Fundraiser", attendees: 200, status: "Completed", description: "Charity dinner to raise funds for school infrastructure." },
  { id: 5, title: "Batch of 2020 Reunion", date: "2026-04-05", venue: "School Campus", type: "Reunion", attendees: 0, status: "Planned", description: "Special reunion for 2020 batch alumni." },
];

const statusConfig: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
  Upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Planned: "bg-amber-100 text-amber-700 border-amber-200",
};

const eventTypeConfig: Record<string, string> = {
  Reunion: "bg-purple-100 text-purple-700 border-purple-200",
  Workshop: "bg-blue-100 text-blue-700 border-blue-200",
  Sports: "bg-orange-100 text-orange-700 border-orange-200",
  Fundraiser: "bg-pink-100 text-pink-700 border-pink-200",
};

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [showAlumniDialog, setShowAlumniDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const filteredAlumni = alumniData.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBatch = batchFilter === "all" || a.batch === batchFilter;
    return matchSearch && matchBatch;
  });

  const stats = [
    { label: "Total Alumni", value: alumniData.length, color: "from-blue-400 to-blue-600", icon: Users },
    { label: "Active Members", value: alumniData.filter((a) => a.status === "Active").length, color: "from-emerald-400 to-green-600", icon: UserCheck },
    { label: "Upcoming Events", value: eventsData.filter((e) => e.status === "Upcoming").length, color: "from-purple-400 to-purple-600", icon: Calendar },
    { label: "Total Batches", value: [...new Set(alumniData.map((a) => a.batch))].length, color: "from-amber-400 to-orange-500", icon: GraduationCap },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <UserCheck size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alumni</h1>
            <p className="text-sm text-muted-foreground">Manage alumni records & events</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-primary-foreground shadow-card animate-fade-in`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
              <stat.icon size={28} className="opacity-40" />
            </div>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Users size={14} className="mr-1.5" /> Manage Alumni
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Calendar size={14} className="mr-1.5" /> Events
          </TabsTrigger>
        </TabsList>

        {/* Manage Alumni Tab */}
        <TabsContent value="manage" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search alumni..."
                  className="pl-9 w-64 bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-32 bg-card">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2"><Download size={14} /> Export</Button>
              <Dialog open={showAlumniDialog} onOpenChange={setShowAlumniDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus size={16} /> Add Alumni</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Alumni</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Batch Year</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                          <SelectContent>
                            {["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Input placeholder="e.g. 12-A" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input placeholder="Enter phone number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Enter email address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input placeholder="Current occupation" />
                      </div>
                      <div className="space-y-2">
                        <Label>Company/Organization</Label>
                        <Input placeholder="Company name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input placeholder="Current city" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setShowAlumniDialog(false)}>Cancel</Button>
                      <Button onClick={() => setShowAlumniDialog(false)}>Add Alumni</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Batch</TableHead>
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Occupation</TableHead>
                  <TableHead className="font-semibold">City</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlumni.map((a, i) => (
                  <TableRow key={a.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{a.batch}</Badge></TableCell>
                    <TableCell>{a.class}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1"><Phone size={10} />{a.phone}</div>
                        <div className="flex items-center gap-1"><Mail size={10} />{a.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="flex items-center gap-1"><Briefcase size={10} />{a.occupation}</div>
                        <div className="text-muted-foreground">{a.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs"><MapPin size={10} />{a.city}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${statusConfig[a.status] || ""}`}>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-9 w-64 bg-card" />
            </div>
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={16} /> Add Event</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Alumni Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input placeholder="Enter event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reunion">Reunion</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="fundraiser">Fundraiser</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input placeholder="Event venue" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Event description..." rows={3} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
                    <Button onClick={() => setShowEventDialog(false)}>Create Event</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventsData.map((event) => (
              <div key={event.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`text-xs border ${eventTypeConfig[event.type] || ""}`}>{event.type}</Badge>
                  <Badge className={`text-xs border ${statusConfig[event.status] || ""}`}>{event.status}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{event.description}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar size={12} /> {event.date}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} /> {event.venue}</div>
                  <div className="flex items-center gap-2"><Users size={12} /> {event.attendees} Attendees</div>
                </div>
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-xs h-7"><Eye size={12} className="mr-1" /> View</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7"><Pencil size={12} className="mr-1" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive"><Trash2 size={12} className="mr-1" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
