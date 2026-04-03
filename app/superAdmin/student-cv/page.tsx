// import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUser, Download, Eye, Plus, Award, BookOpen, Trophy, Briefcase, Star, GraduationCap } from "lucide-react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

const cvTemplates = [
  { id: 1, name: "Classic Academic", style: "Traditional", color: "from-indigo-500 to-blue-500" },
  { id: 2, name: "Modern Minimal", style: "Contemporary", color: "from-emerald-500 to-teal-500" },
  { id: 3, name: "Creative Portfolio", style: "Creative", color: "from-pink-500 to-rose-500" },
  { id: 4, name: "Professional Plus", style: "Professional", color: "from-amber-500 to-orange-500" },
];

const generatedCVs = [
  { id: 1, student: "Rahul Sharma", class: "12-A", template: "Classic Academic", date: "2026-02-10", downloads: 3 },
  { id: 2, student: "Priya Patel", class: "12-B", template: "Modern Minimal", date: "2026-02-12", downloads: 1 },
  { id: 3, student: "Amit Kumar", class: "11-A", template: "Creative Portfolio", date: "2026-02-13", downloads: 5 },
];

const Sections = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { icon: GraduationCap, title: "Academic Records", desc: "Grades, subjects, and academic achievements", color: "from-indigo-500 to-blue-500" },
      { icon: Trophy, title: "Achievements & Awards", desc: "Competitions, scholarships, and recognitions", color: "from-amber-500 to-orange-500" },
      { icon: BookOpen, title: "Extra-Curricular", desc: "Sports, clubs, cultural activities", color: "from-emerald-500 to-teal-500" },
      { icon: Briefcase, title: "Skills & Projects", desc: "Technical skills, projects, and internships", color: "from-pink-500 to-rose-500" },
      { icon: Star, title: "Teacher Remarks", desc: "Character references and recommendations", color: "from-purple-500 to-violet-500" },
      { icon: Award, title: "Certifications", desc: "Online courses, workshops, and certificates", color: "from-cyan-500 to-blue-500" },
    ].map((section) => (
      <div key={section.title} className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} text-white shrink-0`}>
          <section.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{section.title}</h3>
          <p className="text-sm text-muted-foreground">{section.desc}</p>
          <Button variant="outline" size="sm" className="mt-2">Configure</Button>
        </div>
      </div>
    ))}
  </div>
);

const Page = () => {
  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Student CV Builder
            </h1>
            <p className="text-muted-foreground mt-1">Create professional CVs for students with academic records</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <Plus className="h-4 w-4 mr-2" /> Generate CV
            </Button>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sections">CV Sections</TabsTrigger>
            <TabsTrigger value="generated">Generated CVs</TabsTrigger>
            <TabsTrigger value="builder">CV Builder</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cvTemplates.map((t) => (
                <Card key={t.id} className="relative overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div className={`h-40 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <FileUser className="h-16 w-16 text-white/60 group-hover:scale-110 transition-transform" />
                    </div>
                    <CardContent className="p-4">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.style}</p>
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1"><Eye className="h-3 w-3 mr-1" /> Preview</Button>
                        <Button size="sm" className={`flex-1 bg-gradient-to-r ${t.color} text-white border-0`}>Use</Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            </TabsContent>

            <TabsContent value="sections">
            <Sections />
            </TabsContent>

            <TabsContent value="generated" className="space-y-4">
            <Input placeholder="Search generated CVs..." className="max-w-sm" />
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {generatedCVs.map((cv) => (
                    <TableRow key={cv.id}>
                        <TableCell className="font-medium">{cv.student}</TableCell>
                        <TableCell>{cv.class}</TableCell>
                        <TableCell><Badge variant="outline">{cv.template}</Badge></TableCell>
                        <TableCell>{cv.date}</TableCell>
                        <TableCell>{cv.downloads}</TableCell>
                        <TableCell className="space-x-2">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="builder" className="space-y-4">
            <Card>
                <CardHeader><CardTitle>Build Student CV</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Select Student</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                        <SelectContent><SelectItem value="1">Rahul Sharma - 12A</SelectItem><SelectItem value="2">Priya Patel - 12B</SelectItem></SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label>Template</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
                        <SelectContent>{cvTemplates.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Career Objective</Label>
                    <Textarea placeholder="Enter career objective or summary..." rows={3} />
                </div>
                <div className="space-y-2">
                    <Label>Additional Skills</Label>
                    <Input placeholder="e.g., Python, Public Speaking, Leadership" />
                </div>
                <div className="space-y-2">
                    <Label>Hobbies & Interests</Label>
                    <Input placeholder="e.g., Chess, Reading, Robotics" />
                </div>
                <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">Generate CV</Button>
                    <Button variant="outline"><Eye className="h-4 w-4 mr-2" /> Preview</Button>
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;