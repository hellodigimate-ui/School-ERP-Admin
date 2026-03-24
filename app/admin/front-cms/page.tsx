/* eslint-disable jsx-a11y/alt-text */
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
  Globe,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Image,
  FileText,
  Menu,
  Flag,
  Newspaper,
  Upload,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Events data
const cmsEvents = [
  { id: 1, title: "Annual Day Celebration", date: "2026-03-20", venue: "School Auditorium", category: "Cultural", status: "Published", description: "Annual day celebrations with cultural programs." },
  { id: 2, title: "Science Exhibition", date: "2026-04-10", venue: "Science Lab", category: "Academic", status: "Published", description: "Inter-school science exhibition and competition." },
  { id: 3, title: "Sports Day", date: "2026-02-25", venue: "School Ground", category: "Sports", status: "Draft", description: "Annual sports day with track and field events." },
  { id: 4, title: "Parent-Teacher Meeting", date: "2026-03-05", venue: "Classrooms", category: "Meeting", status: "Published", description: "Quarterly parent-teacher interaction." },
];

// Gallery data
const galleryData = [
  { id: 1, title: "Annual Day 2025", images: 45, category: "Events", date: "2025-12-20", status: "Published" },
  { id: 2, title: "Science Fair", images: 30, category: "Academic", date: "2025-11-15", status: "Published" },
  { id: 3, title: "Sports Week", images: 60, category: "Sports", date: "2025-10-10", status: "Published" },
  { id: 4, title: "Campus Tour", images: 20, category: "Campus", date: "2025-09-01", status: "Draft" },
  { id: 5, title: "Independence Day", images: 25, category: "Events", date: "2025-08-15", status: "Published" },
  { id: 6, title: "Teacher's Day", images: 15, category: "Events", date: "2025-09-05", status: "Published" },
];

// News data
const newsData = [
  { id: 1, title: "School Ranks #1 in District Board Exams", date: "2026-02-12", author: "Admin", category: "Achievement", status: "Published", views: 1250 },
  { id: 2, title: "New Computer Lab Inaugurated", date: "2026-02-08", author: "Principal", category: "Infrastructure", status: "Published", views: 890 },
  { id: 3, title: "Inter-School Debate Competition Winners", date: "2026-02-05", author: "Admin", category: "Achievement", status: "Published", views: 670 },
  { id: 4, title: "Admission Open for 2026-27 Session", date: "2026-01-28", author: "Admin", category: "Admission", status: "Published", views: 2100 },
  { id: 5, title: "Summer Camp Registration", date: "2026-02-14", author: "Admin", category: "Events", status: "Draft", views: 0 },
];

// Pages data
const pagesData = [
  { id: 1, title: "About Us", slug: "/about-us", lastUpdated: "2026-01-15", status: "Published", author: "Admin" },
  { id: 2, title: "Admission Process", slug: "/admission", lastUpdated: "2026-02-01", status: "Published", author: "Admin" },
  { id: 3, title: "Contact Us", slug: "/contact", lastUpdated: "2025-12-20", status: "Published", author: "Admin" },
  { id: 4, title: "Faculty", slug: "/faculty", lastUpdated: "2026-01-25", status: "Published", author: "Admin" },
  { id: 5, title: "Facilities", slug: "/facilities", lastUpdated: "2026-02-10", status: "Draft", author: "Admin" },
];

// Menus data
const menusData = [
  { id: 1, name: "Main Navigation", items: 8, position: "Header", status: "Active" },
  { id: 2, name: "Footer Links", items: 12, position: "Footer", status: "Active" },
  { id: 3, name: "Quick Links", items: 5, position: "Sidebar", status: "Active" },
  { id: 4, name: "Mobile Menu", items: 6, position: "Mobile", status: "Inactive" },
];

// Banners data
const bannersData = [
  { id: 1, title: "Admission Open 2026-27", position: "Homepage Hero", status: "Active", startDate: "2026-01-01", endDate: "2026-03-31", clicks: 340 },
  { id: 2, title: "Annual Day Celebration", position: "Homepage Slider", status: "Active", startDate: "2026-02-01", endDate: "2026-03-20", clicks: 180 },
  { id: 3, title: "Exam Schedule Released", position: "Notice Bar", status: "Active", startDate: "2026-02-10", endDate: "2026-02-28", clicks: 95 },
  { id: 4, title: "Summer Camp 2026", position: "Homepage Slider", status: "Inactive", startDate: "2026-04-01", endDate: "2026-05-31", clicks: 0 },
];

const statusConfig: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Draft: "bg-amber-100 text-amber-700 border-amber-200",
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function FrontCMSPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [showDialog, setShowDialog] = useState(false);

  const stats = [
    { label: "Events", value: cmsEvents.length, color: "from-blue-400 to-blue-600", icon: Calendar },
    { label: "Gallery Albums", value: galleryData.length, color: "from-purple-400 to-purple-600", icon: Image },
    { label: "News Articles", value: newsData.length, color: "from-emerald-400 to-green-600", icon: Newspaper },
    { label: "Active Banners", value: bannersData.filter((b) => b.status === "Active").length, color: "from-amber-400 to-orange-500", icon: Flag },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Globe size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Front CMS</h1>
            <p className="text-sm text-muted-foreground">Manage website content, events, galleries & banners</p>
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
        <TabsList className="bg-muted p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Calendar size={14} className="mr-1.5" /> Events
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Image size={14} className="mr-1.5" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="news" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Newspaper size={14} className="mr-1.5" /> News
          </TabsTrigger>
          <TabsTrigger value="pages" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText size={14} className="mr-1.5" /> Pages
          </TabsTrigger>
          <TabsTrigger value="menus" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Menu size={14} className="mr-1.5" /> Menus
          </TabsTrigger>
          <TabsTrigger value="banners" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Flag size={14} className="mr-1.5" /> Banners
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-9 w-64 bg-card" />
            </div>
            <Dialog open={showDialog && activeTab === "events"} onOpenChange={(v) => setShowDialog(v)}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={16} /> Add Event</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2"><Label>Event Title</Label><Input placeholder="Enter title" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Venue</Label><Input placeholder="Venue" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Description..." rows={3} /></div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                    <Button onClick={() => setShowDialog(false)}>Create Event</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsEvents.map((ev) => (
              <div key={ev.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">{ev.category}</Badge>
                  <Badge className={`text-xs border ${statusConfig[ev.status] || ""}`}>{ev.status}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{ev.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{ev.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={12} />{ev.date}</span>
                  <span>{ev.venue}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-xs h-7"><Eye size={12} className="mr-1" /> View</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7"><Pencil size={12} className="mr-1" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive"><Trash2 size={12} className="mr-1" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search albums..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Create Album</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryData.map((album) => (
              <div key={album.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Image size={40} className="text-primary/40" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm text-foreground">{album.title}</h3>
                    <Badge className={`text-xs border ${statusConfig[album.status] || ""}`}>{album.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span>{album.images} images</span>
                    <span>{album.category}</span>
                    <span>{album.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-xs h-7"><Eye size={12} className="mr-1" /> View</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7"><Upload size={12} className="mr-1" /> Upload</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive"><Trash2 size={12} className="mr-1" /> Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add News</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Author</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Views</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsData.map((n, i) => (
                  <TableRow key={n.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">{n.title}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{n.category}</Badge></TableCell>
                    <TableCell>{n.author}</TableCell>
                    <TableCell className="text-xs">{n.date}</TableCell>
                    <TableCell>{n.views.toLocaleString()}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[n.status] || ""}`}>{n.status}</Badge></TableCell>
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

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search pages..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Page</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Slug</TableHead>
                  <TableHead className="font-semibold">Author</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagesData.map((p, i) => (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{p.slug}</TableCell>
                    <TableCell>{p.author}</TableCell>
                    <TableCell className="text-xs">{p.lastUpdated}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[p.status] || ""}`}>{p.status}</Badge></TableCell>
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

        {/* Menus Tab */}
        <TabsContent value="menus" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search menus..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Menu</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Menu Name</TableHead>
                  <TableHead className="font-semibold">Position</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menusData.map((m, i) => (
                  <TableRow key={m.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{m.position}</Badge></TableCell>
                    <TableCell>{m.items}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[m.status] || ""}`}>{m.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
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

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search banners..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Banner</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Position</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Clicks</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannersData.map((b, i) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{b.position}</Badge></TableCell>
                    <TableCell className="text-xs">{b.startDate} → {b.endDate}</TableCell>
                    <TableCell>{b.clicks}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[b.status] || ""}`}>{b.status}</Badge></TableCell>
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
      </Tabs>
    </AdminLayout>
  );
}
