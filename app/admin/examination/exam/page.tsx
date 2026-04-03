/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface ExamData {
  id: string;
  name: string;
  code: string;
  type: string;
  description?: string;
  branchId: string;
  classId?: string;
  branch?: { name: string };
  Class?: { name: string };
}

interface Branch {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

const API_BASE = "/api/v1/exams";
const API_BRANCH = "/api/v1/branches";
const API_CLASS = "/api/v1/classes";

const Page = () => {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editExam, setEditExam] = useState<any>(null);

  const [newExam, setNewExam] = useState({
    branchId: "",
    classId: "",
    name: "",
    code: "",
    type: "Internal",
    description: "",
  });

  const filtered = exams.filter((exam) =>
    exam.name.toLowerCase().includes(search.toLowerCase()),
  );

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get(`${API_BRANCH}?perPage=100`);
      if (response.data.success) {
        setBranches(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

const fetchClasses = async (branchId?: string) => {
  try {
    const res = await axiosInstance.get(API_CLASS, {
      params: {
        perPage: 100,
        ...(branchId && { branchId }),
      },
    });

    setClasses(res.data?.data || []);
  } catch (error) {
    console.error("Failed to fetch classes", error);
  }
};

  const fetchExams = async () => {
    try {
      let url = `${API_BASE}?page=1&perPage=100`;
      if (selectedBranch) {
        url += `&branchId=${selectedBranch}`;
      }
      if (selectedClass) {
        url += `&classId=${selectedClass}`;
      }

      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setExams(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch exams", error);
    }
  };

  const handleAddExam = async () => {
    if (!newExam.name || !newExam.code || !newExam.type || !newExam.branchId) {
      return;
    }

    try {
      const response = await axiosInstance.post(API_BASE, newExam);
      if (response.data.success) {
        fetchExams();
        setDialogOpen(false);
        setNewExam({
          branchId: "",
          classId: "",
          name: "",
          code: "",
          type: "Internal",
          description: "",
        });
      }
    } catch (error) {
      console.error("Failed to create exam", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${API_BASE}/${id}`);
      if (response.data.success) {
        setExams((prev) => prev.filter((exam) => exam.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete exam", error);
    }
  };

  const handleUpdateExam = async () => {
    if (!editExam.name || !editExam.code || !editExam.type) return;

    try {
      const response = await axiosInstance.put(
        `${API_BASE}/${editExam.id}`,
        editExam
      );

      if (response.data.success) {
        fetchExams();
        setEditDialogOpen(false);
        setEditExam(null);
      }
    } catch (error) {
      console.error("Failed to update exam", error);
    }
  };

useEffect(() => {
  const storedBranchId = localStorage.getItem("branchId");

  if (storedBranchId) {
    setSelectedBranch(storedBranchId);

    setNewExam((prev) => ({
      ...prev,
      branchId: storedBranchId,
    }));

    fetchClasses(storedBranchId); // ✅ load classes immediately
  }

  fetchBranches();
  fetchExams();
}, []);


  useEffect(() => {
    fetchBranches();
    fetchExams();
  }, []);

useEffect(() => {
  if (selectedBranch) {
    fetchClasses(selectedBranch);
  }
}, [selectedBranch]);

  useEffect(() => {
    fetchExams();
  }, [selectedBranch, selectedClass]);

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" /> Exam Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage school examinations
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:scale-105 transition">
                <Plus className="h-4 w-4 mr-2" /> Add Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Exam</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* <div>
                  <Label>Branch</Label>
                  <Select
                    value={newExam.branchId}
                    onValueChange={(value) => {
                      setNewExam({ ...newExam, branchId: value, classId: "" });
                      setSelectedBranch(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
                <div>
                  <Label>Class</Label>
                  <Select
                    value={newExam.classId}
                    onValueChange={(value) =>
                      setNewExam({ ...newExam, classId: value })
                    }
                    disabled={!classes.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose class" />
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
                <div>
                  <Label>Exam Name</Label>
                  <Input
                    value={newExam.name}
                    onChange={(e) =>
                      setNewExam({ ...newExam, name: e.target.value })
                    }
                    placeholder="e.g. Unit Test 1"
                  />
                </div>
                <div>
                  <Label>Exam Code</Label>
                  <Input
                    value={newExam.code}
                    onChange={(e) =>
                      setNewExam({ ...newExam, code: e.target.value })
                    }
                    placeholder="e.g. UT2026"
                  />
                </div>
                <div>
                  <Label>Exam Type</Label>
                  <Select
                    value={newExam.type}
                    onValueChange={(value) =>
                      setNewExam({ ...newExam, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="Board">Board</SelectItem>
                      <SelectItem value="Practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newExam.description}
                    onChange={(e) =>
                      setNewExam({ ...newExam, description: e.target.value })
                    }
                    placeholder="Optional exam description"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  onClick={handleAddExam}
                >
                  Save Exam
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 focus-visible:ring-indigo-400"
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* <Select
            value={selectedBranch}
            onValueChange={(value) => {
              setSelectedBranch(value === "ALL_BRANCHES" ? "" : value);
              setSelectedClass("");
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_BRANCHES">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedClass}
            onValueChange={(value) =>
              setSelectedClass(value === "ALL_CLASSES" ? "" : value)
            }
            disabled={!selectedBranch}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_CLASSES">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Exam Name
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Type
                  </th>
                  {/* <th className="text-left p-3 font-medium text-muted-foreground">
                    Branch
                  </th> */}
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Class
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Code
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam, index) => (
                  <tr
                    key={exam.id}
                    className="border-b hover:bg-indigo-50/40 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium text-foreground">
                      {exam.name}
                    </td>
                    <td className="p-3">
                      <Badge
                        className={
                          exam.type === "Board"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : exam.type === "Practical"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                        }
                      >
                        {exam.type}
                      </Badge>
                    </td>
                    {/* <td className="p-3">
                      {exam.branch?.name || exam.branchId}
                    </td> */}
                    <td className="p-3">{exam.Class?.name || "-"}</td>
                    <td className="p-3">{exam.code}</td>
                    <td className="p-3 text-muted-foreground">
                      {exam.description || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-100 text-blue-600"
                          onClick={()=>{
                            setEditExam(exam);
                            setEditDialogOpen(true);

                             if (exam.branchId) {
                              fetchClasses(exam.branchId);
                             }

                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-100 text-red-600"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Edit Exam</DialogTitle>
                </DialogHeader>

                {editExam && (
                  <div className="space-y-4 mt-4 overflow-y-auto max-h-[65vh] pr-2">

                    {/* Class */}
                    <div>
                      <Label>Class</Label>
                      <Select
                        value={editExam.classId}
                        onValueChange={(value) =>
                          setEditExam({ ...editExam, classId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose class" />
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

                    {/* Name */}
                    <div>
                      <Label>Exam Name</Label>
                      <Input
                        value={editExam.name}
                        onChange={(e) =>
                          setEditExam({ ...editExam, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Code */}
                    <div>
                      <Label>Exam Code</Label>
                      <Input
                        value={editExam.code}
                        onChange={(e) =>
                          setEditExam({ ...editExam, code: e.target.value })
                        }
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <Label>Exam Type</Label>
                      <Select
                        value={editExam.type}
                        onValueChange={(value) =>
                          setEditExam({ ...editExam, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="Board">Board</SelectItem>
                          <SelectItem value="Practical">Practical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={editExam.description || ""}
                        onChange={(e) =>
                          setEditExam({ ...editExam, description: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      onClick={handleUpdateExam}
                    >
                      Update Exam
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;