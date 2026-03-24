"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, Eye, ThumbsUp, Plus } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const videos = [
  { id: 1, title: "Introduction to Quadratic Equations", subject: "Mathematics", class: "Class 10", teacher: "Mr. Rajesh Kumar", duration: "24:30", views: 342, likes: 89, thumbnail: "📐", date: "2025-02-10" },
  { id: 2, title: "Chemical Bonding Explained", subject: "Chemistry", class: "Class 9", teacher: "Dr. Suresh Patel", duration: "18:45", views: 256, likes: 72, thumbnail: "🧪", date: "2025-02-09" },
  { id: 3, title: "Shakespeare's Sonnets Analysis", subject: "English", class: "Class 10", teacher: "Ms. Anita Verma", duration: "32:15", views: 189, likes: 56, thumbnail: "📖", date: "2025-02-08" },
  { id: 4, title: "Newton's Laws of Motion", subject: "Physics", class: "Class 9", teacher: "Mr. Rajesh Kumar", duration: "28:00", views: 412, likes: 103, thumbnail: "🔬", date: "2025-02-07" },
  { id: 5, title: "Indian Independence Movement", subject: "History", class: "Class 8", teacher: "Mrs. Kavita Jain", duration: "35:20", views: 178, likes: 45, thumbnail: "🏛️", date: "2025-02-06" },
  { id: 6, title: "Python Programming Basics", subject: "Computer Science", class: "Class 10", teacher: "Mr. Amit Gupta", duration: "42:10", views: 520, likes: 134, thumbnail: "💻", date: "2025-02-05" },
];

const Page = () => {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const subjects = ["All", ...Array.from(new Set(videos.map(v => v.subject)))];
  const filtered = videos.filter(v =>
    (subjectFilter === "All" || v.subject === subjectFilter) &&
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-foreground">Video Tutorials</h1>
            <p className="text-muted-foreground text-sm">Browse and manage educational video content</p>
            </div>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Video</Button>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1 flex-wrap">
            {subjects.map(s => (
                <Button key={s} variant={subjectFilter === s ? "default" : "outline"} size="sm" onClick={() => setSubjectFilter(s)}>{s}</Button>
            ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(video => (
            <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <span className="text-5xl">{video.thumbnail}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                    </div>
                </div>
                <Badge className="absolute top-2 right-2" variant="secondary">
                    <Clock className="h-3 w-3 mr-1" /> {video.duration}
                </Badge>
                </div>
                <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{video.teacher} • {video.class}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline">{video.subject}</Badge>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {video.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {video.likes}</span>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </AdminLayout>
  );
};

export default Page;
