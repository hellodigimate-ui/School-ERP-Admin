"use client"
import { useState } from "react";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
  Edit,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  FolderOpen,
  Upload,
  Clock,
  HardDrive,
  Files,
} from "lucide-react";
import { toast } from "sonner";

interface DocumentData {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "active" | "archived" | "draft";
}

const CATEGORIES = [
  "Policies",
  "Reports",
  "Forms",
  "Templates",
  "Contracts",
  "Curriculum",
  "Administrative",
  "Other",
];

const initialDocuments: DocumentData[] = [
  {
    id: "1",
    name: "Student Enrollment Form 2024",
    category: "Forms",
    type: "pdf",
    size: "245 KB",
    uploadedBy: "Admin User",
    uploadedAt: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Academic Calendar 2024-2025",
    category: "Administrative",
    type: "pdf",
    size: "1.2 MB",
    uploadedBy: "Principal Johnson",
    uploadedAt: "2024-01-10",
    status: "active",
  },
  {
    id: "3",
    name: "Teacher Employment Contract Template",
    category: "Contracts",
    type: "docx",
    size: "89 KB",
    uploadedBy: "HR Department",
    uploadedAt: "2024-01-08",
    status: "active",
  },
  {
    id: "4",
    name: "Annual Financial Report 2023",
    category: "Reports",
    type: "xlsx",
    size: "3.4 MB",
    uploadedBy: "Finance Team",
    uploadedAt: "2024-01-05",
    status: "active",
  },
  {
    id: "5",
    name: "School Safety Policy",
    category: "Policies",
    type: "pdf",
    size: "567 KB",
    uploadedBy: "Safety Officer",
    uploadedAt: "2024-01-03",
    status: "active",
  },
  {
    id: "6",
    name: "Lesson Plan Template",
    category: "Templates",
    type: "docx",
    size: "45 KB",
    uploadedBy: "Academic Coordinator",
    uploadedAt: "2023-12-28",
    status: "active",
  },
  {
    id: "7",
    name: "Student Progress Report Template",
    category: "Templates",
    type: "xlsx",
    size: "78 KB",
    uploadedBy: "Admin User",
    uploadedAt: "2023-12-20",
    status: "active",
  },
  {
    id: "8",
    name: "Anti-Bullying Policy Draft",
    category: "Policies",
    type: "pdf",
    size: "234 KB",
    uploadedBy: "Counselor Smith",
    uploadedAt: "2023-12-15",
    status: "draft",
  },
  {
    id: "9",
    name: "School Logo Assets",
    category: "Other",
    type: "png",
    size: "2.1 MB",
    uploadedBy: "Marketing Team",
    uploadedAt: "2023-12-10",
    status: "active",
  },
  {
    id: "10",
    name: "Previous Year Curriculum Guide",
    category: "Curriculum",
    type: "pdf",
    size: "4.5 MB",
    uploadedBy: "Academic Director",
    uploadedAt: "2023-11-15",
    status: "archived",
  },
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="h-5 w-5 text-destructive" />;
    case "docx":
    case "doc":
      return <FileText className="h-5 w-5 text-primary" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-5 w-5 text-primary" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage className="h-5 w-5 text-accent-foreground" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: DocumentData["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Active</Badge>;
    case "archived":
      return <Badge variant="secondary">Archived</Badge>;
    case "draft":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent">Draft</Badge>;
    default:
      return null;
  }
};

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentData[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    category: "",
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalDocuments: documents.length,
    activeDocuments: documents.filter((d) => d.status === "active").length,
    totalSize: "15.2 MB",
    recentUploads: documents.filter((d) => {
      const uploadDate = new Date(d.uploadedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate >= weekAgo;
    }).length,
  };

  const handleUpload = () => {
    if (!newDocument.name || !newDocument.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const doc: DocumentData = {
      id: Date.now().toString(),
      name: newDocument.name,
      category: newDocument.category,
      type: "pdf",
      size: "0 KB",
      uploadedBy: "Current User",
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    setDocuments([doc, ...documents]);
    setNewDocument({ name: "", category: "" });
    setIsUploadOpen(false);
    toast.success("Document uploaded successfully");
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.success("Document deleted successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage school documents, policies, and files
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add a new document to the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="docName">Document Name</Label>
                  <Input
                    id="docName"
                    placeholder="Enter document name"
                    value={newDocument.name}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="docCategory">Category</Label>
                  <Select
                    value={newDocument.category}
                    onValueChange={(value) =>
                      setNewDocument({ ...newDocument, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>File</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, XLSX, PNG (MAX. 10MB)
                        </p>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <Files className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDocuments}</div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSize}</div>
              <p className="text-xs text-muted-foreground">Of 100 MB limit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentUploads}</div>
              <p className="text-xs text-muted-foreground">In the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {doc.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.category}</Badge>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.uploadedBy}</TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDocuments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No documents found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
