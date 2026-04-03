"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText, Image, Film, File, Music, Archive } from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

const contentTypes = [
  { id: 1, name: "Study Material", description: "Textbooks, notes, and reference materials", icon: FileText, allowedFormats: "PDF, DOCX, PPTX", maxSize: "50 MB", count: 186, status: "Active" },
  { id: 2, name: "Image Gallery", description: "Event photos, diagrams, and illustrations", icon: Image, allowedFormats: "JPG, PNG, WEBP", maxSize: "10 MB", count: 89, status: "Active" },
  { id: 3, name: "Video Tutorial", description: "Recorded lectures and educational videos", icon: Film, allowedFormats: "MP4, WEBM", maxSize: "500 MB", count: 42, status: "Active" },
  { id: 4, name: "Audio Content", description: "Podcasts, language lessons, and audio books", icon: Music, allowedFormats: "MP3, WAV", maxSize: "100 MB", count: 15, status: "Active" },
  { id: 5, name: "Notice / Circular", description: "Official notices and circulars", icon: FileText, allowedFormats: "PDF", maxSize: "20 MB", count: 67, status: "Active" },
  { id: 6, name: "Assignment", description: "Homework and project submissions", icon: File, allowedFormats: "PDF, DOCX, ZIP", maxSize: "30 MB", count: 124, status: "Active" },
  { id: 7, name: "Archive", description: "Previous year papers and old records", icon: Archive, allowedFormats: "PDF, ZIP", maxSize: "100 MB", count: 58, status: "Inactive" },
];

const Page = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-foreground">Content Type</h1>
            <p className="text-muted-foreground text-sm">Manage content categories and file type settings</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Content Type
            </Button>
        </div>

        {showForm && (
            <Card>
            <CardHeader><CardTitle className="text-lg">Add New Content Type</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Type Name</label>
                    <Input placeholder="Enter content type name" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Allowed Formats</label>
                    <Input placeholder="e.g., PDF, DOCX, JPG" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Max File Size</label>
                    <Input placeholder="e.g., 50 MB" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Active</option><option>Inactive</option>
                    </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Input placeholder="Enter description" />
                </div>
                </div>
                <div className="flex gap-2 mt-4">
                <Button>Save Content Type</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
            </CardContent>
            </Card>
        )}

        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Allowed Formats</TableHead>
                    <TableHead>Max Size</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {contentTypes.map(ct => (
                    <TableRow key={ct.id}>
                    <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                        <ct.icon className="h-4 w-4 text-primary" /> {ct.name}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{ct.description}</TableCell>
                    <TableCell><Badge variant="outline">{ct.allowedFormats}</Badge></TableCell>
                    <TableCell>{ct.maxSize}</TableCell>
                    <TableCell>{ct.count}</TableCell>
                    <TableCell>
                        <Badge variant={ct.status === "Active" ? "default" : "secondary"}>{ct.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
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