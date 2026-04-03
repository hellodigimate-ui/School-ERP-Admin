"use client";

import { useState, useEffect } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Download,
  Edit,
  Trash2,
  FileUp,
} from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Class {
  id: string;
  name: string;
}

interface Section {
  id: string;
  name: string;
}

interface Homework {
  id: string;     
  title: string;
  category: string | null;
  dueDate: string;
  homeworkUrl: string | string[];
  fileUrls?: string[];
  type: string;
  sectionId: string;
  createdAt: string;
}

const getStatusBadge = (dueDate: string) => {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (due < now) {
    return (
      <Badge className="bg-destructive/20 text-destructive border-0">
        <Clock className="w-3 h-3 mr-1" />
        Overdue
      </Badge>
    );
  } else if (due.getTime() - now.getTime() < 48 * 60 * 60 * 1000) {
    return (
      <Badge className="bg-warning/20 text-warning border-0">
        <AlertCircle className="w-3 h-3 mr-1" />
        Due Soon
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-success/20 text-success border-0">
      <CheckCircle className="w-3 h-3 mr-1" />
      Active
    </Badge>
  );
};

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Homework data
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loadingHomework, setLoadingHomework] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formFiles, setFormFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // File viewer state
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<string[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await axiosInstance.get("/api/v1/classes", {
          params: {
            page: 1,
            perPage: 100,
          },
        });
        
        if (response.data?.data) {
          const classesData = response.data.data.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
          }));
          setClasses(classesData);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch sections when class is selected
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    const fetchSections = async () => {
      try {
        setLoadingSections(true);
        const response = await axiosInstance.get("/api/v1/sections", {
          params: {
            classId: selectedClass,
            page: 1,
            perPage: 100,
          },
        });
        
        if (response.data?.data) {
          const sectionsData = response.data.data.map((sec: any) => ({
            id: sec.id,
            name: sec.name,
          }));
          setSections(sectionsData);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [selectedClass]);

  // Fetch teacher's homework
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setLoadingHomework(true);
        const response = await axiosInstance.get("/api/v1/homework/teacher", {
          params: {
            page,
            perPage: 10,
          },
        });
        
        if (response.data?.data) {
          console.log("Homework data received:", response.data.data); // Debug
          setHomework(response.data.data);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoadingHomework(false);
      }
    };

    fetchHomework();
  }, [page]);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setSelectedClass("");
      setSelectedSection("");
      setFormTitle("");
      setFormCategory("");
      setFormDueDate("");
      setFormFiles([]);
      setError(null);
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormFiles([...formFiles, ...Array.from(files)]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFormFiles(formFiles.filter((_, i) => i !== index));
  };

  const handleAddEditFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setEditFiles([...editFiles, ...Array.from(files)]);
    }
    e.target.value = "";
  };

  const handleRemoveEditFile = (index: number) => {
    setEditFiles(editFiles.filter((_, i) => i !== index));
  };

  const handleCreateHomework = async () => {
    if (!selectedSection || !formTitle || !formDueDate || formFiles.length === 0) {
      setError("All fields including at least one file are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("sectionId", selectedSection);
      formData.append("title", formTitle);
      formData.append("dueDate", new Date(formDueDate).toISOString());
      formData.append("category", formCategory || "");
      
      // Add all files
      formFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await axiosInstance.post("/api/v1/homework", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        // Refresh homework list
        setPage(1);
        const refreshResponse = await axiosInstance.get("/api/v1/homework/teacher", {
          params: { page: 1, perPage: 10 },
        });
        if (refreshResponse.data?.data) {
          setHomework(refreshResponse.data.data);
        }
        handleDialogOpenChange(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create homework");
      console.error("Error creating homework:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHomework = async (homeworkId: string) => {
    if (!confirm("Are you sure you want to delete this homework?")) return;

    try {
      await axiosInstance.delete(`/api/v1/homework/${homeworkId}`);
      setHomework(homework.filter((h) => h.id !== homeworkId));
    } catch (err) {
      console.error("Error deleting homework:", err);
      alert("Failed to delete homework");
    }
  };

  const handleViewFiles = (hw: Homework) => {
    // Debug: log the homework object to see what data is available
    console.log("Homework object:", hw);
    console.log("fileUrls:", hw.fileUrls);
    console.log("homeworkUrl:", hw.homeworkUrl);
    
    // Collect all available file URLs
    let files: string[] = [];
    
    // First, include fileUrls if available
    if (hw.fileUrls && hw.fileUrls.length > 0) {
      files = [...hw.fileUrls];
    }
    
    // Then, add homeworkUrl - it could be a string or array of strings
    if (hw.homeworkUrl) {
      if (Array.isArray(hw.homeworkUrl)) {
        // It's an array, add all valid URLs
        const validUrls = hw.homeworkUrl.filter(url => typeof url === 'string' && url.trim().length > 0);
        files = [...files, ...validUrls];
      } else if (typeof hw.homeworkUrl === 'string' && hw.homeworkUrl.trim().length > 0) {
        // It's a single string
        if (!files.includes(hw.homeworkUrl)) {
          files.push(hw.homeworkUrl);
        }
      }
    }
    
    // Remove duplicates
    files = [...new Set(files)];
    
    console.log("Files after filtering:", files);
    
    if (files.length === 0) {
      alert("No files available for this assignment");
      return;
    }
    
    console.log("Files to display:", files); // Debug logging
    setCurrentFiles(files);
    setSelectedFileIndex(0);
    setFileViewerOpen(true);
  };

  const handleEditHomework = (hw: Homework) => {
    setEditingId(hw.id);
    setEditTitle(hw.title);
    setEditCategory(hw.category || "");
    setEditDueDate(hw.dueDate.split("T")[0]);
    setEditFiles([]);
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleUpdateHomework = async () => {
    if (!editingId || !editTitle || !editDueDate) {
      setEditError("All fields are required");
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);
      
      let response;

      if (editFiles.length > 0) {
        // If files are selected, use FormData
        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("category", editCategory);
        formData.append("dueDate", new Date(editDueDate).toISOString());
        
        // Add all files
        editFiles.forEach((file) => {
          formData.append(`files`, file);
        });

        response = await axiosInstance.put(
          `/api/v1/homework/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // If no files, use regular JSON
        response = await axiosInstance.put(
          `/api/v1/homework/${editingId}`,
          {
            title: editTitle,
            category: editCategory,
            dueDate: new Date(editDueDate).toISOString(),
          }
        );
      }

      if (response.data?.success) {
        // Update homework in list
        setHomework(
          homework.map((h) =>
            h.id === editingId
              ? {
                  ...h,
                  title: editTitle,
                  category: editCategory,
                  dueDate: new Date(editDueDate).toISOString(),
                }
              : h
          )
        );
        setEditDialogOpen(false);
      }
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update homework");
      console.error("Error updating homework:", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  // Filter homework based on search
  const filteredHomework = homework.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Assignments
              </h1>
              <p className="text-muted-foreground">
                Create and manage class assignments
              </p>
            </div>

            {/* Create Assignment Dialog */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new assignment
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Assignment title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>

                  {/* Class + Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger disabled={loadingClasses}>
                          <SelectValue placeholder={loadingClasses ? "Loading..." : "Select class"} />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass || loadingSections}>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingSections ? "Loading..." : selectedClass ? "Select section" : "Select class first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((sec) => (
                            <SelectItem key={sec.id} value={sec.id}>
                              {sec.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formCategory} onValueChange={setFormCategory} disabled={!selectedSection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input 
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Files</Label>
                    <input
                      type="file"
                      onChange={handleAddFiles}
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formFiles.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {formFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFile(index)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                <DialogFooter>
                  <Button 
                    variant="outline"
                    onClick={() => handleDialogOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateHomework}
                    disabled={submitting || !selectedSection || !formTitle || !formDueDate || formFiles.length === 0}
                    className="gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? "Creating..." : "Create Assignment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Assignment Dialog */}
            <Dialog 
              open={editDialogOpen} 
              onOpenChange={(open) => {
                setEditDialogOpen(open);
                if (!open) {
                  setEditFiles([]);
                }
              }}
            >
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Assignment</DialogTitle>
                  <DialogDescription>
                    Update the assignment details
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {editError && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-sm text-destructive">{editError}</p>
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input 
                      id="edit-title" 
                      placeholder="Assignment title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input 
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                    />
                  </div>

                  {/* File Upload (Optional) */}
                  <div className="space-y-2">
                    <Label>Update Files (Optional)</Label>
                    <input
                      type="file"
                      onChange={handleAddEditFiles}
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editFiles.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {editFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                            <span className="truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveEditFile(index)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    disabled={editSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateHomework}
                    disabled={editSubmitting || !editTitle || !editDueDate}
                    className="gap-2"
                  >
                    {editSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editSubmitting ? "Updating..." : "Update Assignment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* File Viewer Modal */}
            <Dialog open={fileViewerOpen} onOpenChange={setFileViewerOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>View Files ({currentFiles.length})</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex gap-4">
                  {/* File list on the left */}
                  <div className="w-48 border-r border-border overflow-y-auto">
                    <div className="space-y-2 p-2">
                      {currentFiles.map((fileUrl, index) => {
                        // Extract filename from URL, handling various URL formats
                        let displayName = `File ${index + 1}`;
                        
                        if (typeof fileUrl === 'string' && fileUrl.length > 0) {
                          try {
                            // Try to extract filename from URL path
                            const urlParts = fileUrl.split('/');
                            const lastPart = urlParts[urlParts.length - 1];
                            
                            // Remove query parameters if present
                            const fileName = lastPart.split('?')[0];
                            
                            // Decode URI component if it's URL-encoded
                            if (fileName && fileName.length > 0) {
                              displayName = decodeURIComponent(fileName);
                            }
                          } catch (e) {
                            console.error("Error parsing filename:", e);
                          }
                        }
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedFileIndex(index)}
                            className={`w-full text-left p-2 rounded text-sm truncate transition-colors ${
                              selectedFileIndex === index
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            title={displayName}
                          >
                            {displayName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* File preview on the right */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {currentFiles[selectedFileIndex] && (
                      <>
                        <div className="flex-1 overflow-auto bg-muted rounded mb-3">
                          <iframe
                            src={`${currentFiles[selectedFileIndex]}#toolbar=0`}
                            className="w-full h-full border-0 rounded"
                            title="File viewer"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(currentFiles[selectedFileIndex], '_blank')}
                            className="flex-1 gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          {currentFiles.length > 1 && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedFileIndex(Math.max(0, selectedFileIndex - 1))}
                                disabled={selectedFileIndex === 0}
                              >
                                ← Previous
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedFileIndex(Math.min(currentFiles.length - 1, selectedFileIndex + 1))}
                                disabled={selectedFileIndex === currentFiles.length - 1}
                              >
                                Next →
                              </Button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mb-6">
            <Input 
              placeholder="Search assignments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="dashboard-section">
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-3xl font-bold text-foreground">{homework.length}</p>
            </div>
            <div className="dashboard-section">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-success">{homework.filter(h => new Date(h.dueDate) > new Date()).length}</p>
            </div>
            <div className="dashboard-section">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-3xl font-bold text-destructive">{homework.filter(h => new Date(h.dueDate) < new Date()).length}</p>
            </div>
            <div className="dashboard-section">
              <p className="text-sm text-muted-foreground">Loading</p>
              <p className="text-3xl font-bold text-muted-foreground">{loadingHomework ? "..." : "Ready"}</p>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="dashboard-section">
            <h2 className="text-lg font-semibold mb-4">Active Assignments</h2>
            
            {loadingHomework ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredHomework.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No assignments found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">File</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHomework.map((hw) => (
                      <tr key={hw.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{hw.title}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {hw.category || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(hw.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(hw.dueDate)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewFiles(hw)}
                            className="text-primary hover:underline flex items-center gap-1 h-auto p-0"
                          >
                            <Download className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditHomework(hw)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteHomework(hw.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}



