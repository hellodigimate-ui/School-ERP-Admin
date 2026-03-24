"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Share2, FileText, Image, Film, File, Clock } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const sharedContent = [
  { id: 1, title: "Physics Chapter 3 Notes", type: "PDF", sharedBy: "Mr. Rajesh Kumar", sharedWith: "Class 10-A, 10-B", date: "2025-02-10", views: 85, downloads: 62, status: "Active" },
  { id: 2, title: "Annual Day Photos Album", type: "Image", sharedBy: "Admin", sharedWith: "All Students", date: "2025-02-09", views: 245, downloads: 142, status: "Active" },
  { id: 3, title: "Math Revision Worksheet", type: "PDF", sharedBy: "Mrs. Priya Sharma", sharedWith: "Class 9-A", date: "2025-02-08", views: 56, downloads: 48, status: "Expired" },
  { id: 4, title: "Science Project Guidelines", type: "Document", sharedBy: "Dr. Suresh Patel", sharedWith: "Class 8, 9, 10", date: "2025-02-07", views: 120, downloads: 89, status: "Active" },
  { id: 5, title: "Hindi Literature Video", type: "Video", sharedBy: "Mr. Deepak Singh", sharedWith: "Class 7-C", date: "2025-02-06", views: 34, downloads: 15, status: "Active" },
  { id: 6, title: "Exam Schedule Notice", type: "PDF", sharedBy: "Admin", sharedWith: "All Classes", date: "2025-02-05", views: 410, downloads: 320, status: "Active" },
];

const typeIcons: Record<string, React.ElementType> = { PDF: FileText, Image: Image, Video: Film, Document: File };

const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = sharedContent.filter(c =>
    (filter === "All" || c.status === filter) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Share List</h1>
          <p className="text-muted-foreground text-sm">View all shared content and their access details</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search shared content..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-1">
            {["All", "Active", "Expired"].map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const TypeIcon = typeIcons[item.type] || File;
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Shared by {item.sharedBy}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Share2 className="h-3 w-3" /> {item.sharedWith}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.views}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {item.downloads}</span>
                    </div>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.date}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;