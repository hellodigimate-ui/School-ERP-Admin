/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState, Suspense } from "react";

export const dynamic = 'force-dynamic';
import { Search,  MoreHorizontal, Mail, Phone, Users, User } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";

interface Parent {
  id: string;
  userId: string;
  email: string;

  fatherName: string;
  fatherPhone: string;
  fatherOccupation?: string;

  motherName: string;
  motherPhone: string;
  motherOccupation?: string;

  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;

  childrenCount: number;

  Student?: any[];
}


const ParentsComponent = ({ highlightId }: { highlightId: string | null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;



  const [selectedParent, setSelectedParent] = useState<any>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    fatherOccupation: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
  });

  const filteredParents = parents;

const fetchParents = async (name = "") => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/v1/parents", {
      params: {
        page: currentPage,
        perPage: itemsPerPage,
        name: name,
      },
    });

    setParents(res?.data?.data || []);

  } catch (error) {
    toast.error("Failed to load parents");
  } finally {
    setLoading(false);
  }
};

const handleViewParent = async (parent: any) => {
  try {
    const res = await axiosInstance.get(`/api/v1/parents/${parent.id}`);

    setSelectedParent(res.data.data);
    setIsViewModalOpen(true);

  } catch (error) {
    toast.error("Failed to fetch parent");
  }
};

const handleEditParent = (parent: any) => {
  setSelectedParent(parent);

  setEditForm({
    fatherName: parent.fatherName || "",
    motherName: parent.motherName || "",
    fatherPhone: parent.fatherPhone || "",
    motherPhone: parent.motherPhone || "",
    fatherOccupation: parent.fatherOccupation || "",
    guardianName: parent.guardianName || "",
    guardianPhone: parent.guardianPhone || "",
    guardianRelation: parent.guardianRelation || "",
  });

  setIsEditModalOpen(true);
};

const updateParent = async () => {
  try {
    await axiosInstance.put(`/api/v1/parents/${selectedParent.id}`,
      editForm
    );

    toast.success("Parent updated successfully");

    setIsEditModalOpen(false);

    fetchParents(searchQuery);

  } catch (error) {
    toast.error("Failed to update parent");
  }
};

const deleteParent = async (id: string) => {
  try {
    await axiosInstance.delete(`/api/v1/parents/${id}`);

    toast.success("Parent deleted");

    fetchParents(searchQuery);

  } catch (error) {
    toast.error("Failed to delete parent");
  }
};

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchParents(searchQuery);
  }, 400); 

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

useEffect(() => {
  if (highlightId) {
    // Scroll to the highlighted row
    const element = document.getElementById(`parent-${highlightId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}, [highlightId, parents]);

  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const paginatedParents = filteredParents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Parents</h1>
          <p className="text-muted-foreground mt-1">Manage and view all registered parents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search parents by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <TableHead className="text-white">👨 Parent Name</TableHead>
              <TableHead className="text-white">📞 Contact</TableHead>
              <TableHead className="text-white">👶 Children</TableHead>
              <TableHead className="text-white">👥 Count</TableHead>
              <TableHead className="text-white">⚙️ Action</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedParents.map((parent) => (
              <TableRow
                key={parent.id}
                id={`parent-${parent.userId}`}
                className={`transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
                  parent.userId === highlightId || parent.id === highlightId
                    ? "bg-green-100 dark:bg-green-900"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {/* Parent Name */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {parent.fatherName}
                    </span>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <Mail className="w-3 h-3" /> {parent.email}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Phone className="w-3 h-3" /> {parent.fatherPhone}
                    </span>
                  </div>
                </TableCell>

                {/* Children */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {parent?.Student?.map((child: any) => (
                      <span
                        key={child.id}
                        className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900"
                      >
                        {child.name || "Abhi"}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Count */}
                <TableCell>
                  <div className="flex items-center gap-2 text-orange-600 font-medium">
                    <Users className="w-4 h-4" />
                    {parent.childrenCount || "5"}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="rounded-lg shadow-lg"
                    >
                      <DropdownMenuItem onClick={() => handleViewParent(parent)}>
                        👁 View Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleEditParent(parent)}>
                        ✏️ Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => deleteParent(parent.id)}
                      >
                        🗑 Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              👨 Parent Details
            </DialogTitle>
            <DialogDescription>
              Complete parent information
            </DialogDescription>
          </DialogHeader>

          {selectedParent && (
            <div className="space-y-4 text-sm">

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <p className="text-gray-500">Father Name</p>
                <p className="font-semibold">{selectedParent.fatherName}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <p className="text-gray-500">Phone</p>
                <p>{selectedParent.fatherPhone}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <p className="text-gray-500">Email</p>
                <p>{selectedParent.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-lg">
                  <p className="text-xs">Mother</p>
                  <p className="font-medium">{selectedParent.motherName}</p>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                  <p className="text-xs">Guardian</p>
                  <p className="font-medium">{selectedParent.guardianName}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Children</p>
                <div className="flex flex-wrap gap-1">
                  {(selectedParent.children || []).map((child: string) => (
                    <span
                      key={child}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                    >
                      👶 {child}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        </Dialog>


        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 shadow-xl p-6 max-h-[80vh] overflow-hidden">
            
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-purple-600 flex items-center gap-2">
                ✏️ Edit Parent
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Form Area */}
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[60vh]">

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Father Name
                </label>
                <Input
                  placeholder="Enter father name"
                  value={editForm.fatherName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fatherName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Father Phone
                </label>
                <Input
                  placeholder="Enter father phone"
                  value={editForm.fatherPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fatherPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Father Occupation
                </label>
                <Input
                  placeholder="Enter occupation"
                  value={editForm.fatherOccupation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fatherOccupation: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mother Name
                </label>
                <Input
                  placeholder="Enter mother name"
                  value={editForm.motherName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, motherName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mother Phone
                </label>
                <Input
                  placeholder="Enter mother phone"
                  value={editForm.motherPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, motherPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Guardian Name
                </label>
                <Input
                  placeholder="Enter guardian name"
                  value={editForm.guardianName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, guardianName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Guardian Phone
                </label>
                <Input
                  placeholder="Enter guardian phone"
                  value={editForm.guardianPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, guardianPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relation with Student
                </label>
                <Input
                  placeholder="e.g. Uncle, Aunt"
                  value={editForm.guardianRelation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, guardianRelation: e.target.value })
                  }
                />
              </div>

            </div>

            <DialogFooter className="pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-lg shadow-md">
                🚀 Update Parent
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredParents.length)} of {filteredParents.length}{" "}
          parents
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </AdminLayout>
  );
};

export default function Parents() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParentsWrapper />
    </Suspense>
  );
}

function ParentsWrapper() {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setHighlightId(urlParams.get('id'));
  }, []);

  return <ParentsComponent highlightId={highlightId} />;
}