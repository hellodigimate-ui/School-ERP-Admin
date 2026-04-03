/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState, Suspense } from "react";

export const dynamic = 'force-dynamic';
import { Search, Plus, MoreHorizontal, Mail, Phone, Users } from "lucide-react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

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

  // const searchParams = useSearchParams();
  // const highlightId = searchParams.get('id');

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
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>No. of Children</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedParents.map((parent) => (
              <TableRow key={parent.id} id={`parent-${parent.userId}`} className={parent.userId === highlightId || parent.id === highlightId ? "bg-green-100 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-900" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{parent.fatherName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" /> {parent.email}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" /> {parent.fatherPhone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    {parent?.Student?.map((child:any) => (
                      <span key={child.id} className="text-sm">
                        {child.name || "Abhi "}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{parent.childrenCount || "5"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewParent(parent)} >View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditParent(parent)} >Edit</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteParent(parent.id)} >Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Parent Details</DialogTitle>
                        <DialogDescription>
                          View complete parent information
                        </DialogDescription>
                      </DialogHeader>

                      {selectedParent && (
                        <div className="space-y-9">

                          <div>
                            <p className="text-sm text-muted-foreground">Father Name</p>
                            <p className="font-medium">{selectedParent.fatherName}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Father Phone</p>
                            <p>{selectedParent.fatherPhone}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Father Email</p>
                            <p>{selectedParent.email}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Father Occupation</p>
                            <p className="font-medium">{selectedParent.fatherOccupation}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Mother Name</p>
                            <p className="font-medium">{selectedParent.motherName}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Mother Phone</p>
                            <p>{selectedParent.motherPhone}</p>
                          </div>

                          

                          <div>
                            <p className="text-sm text-muted-foreground">Mother Occupation</p>
                            <p className="font-medium">{selectedParent.motherOccupation}</p>
                          </div>
                          

                          <div>
                            <p className="text-sm text-muted-foreground">Guardian Name</p>
                            <p className="font-medium">{selectedParent.guardianName}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Guardian Ralation</p>
                            <p className="font-medium">{selectedParent.guardianRelation}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Guardian Phone</p>
                            <p className="font-medium">{selectedParent.guardianPhone}</p>
                          </div>



                          <div>
                            <p className="text-sm text-muted-foreground">Children</p>
                            {(selectedParent.children || []).map((child: string) => (
                              <p key={child}>{child}</p>
                            ))}
                          </div>

                          

                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">

                      <DialogHeader>
                        <DialogTitle>Edit Parent</DialogTitle>
                        <DialogDescription>
                          Update parent information
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-1">


                        <label>Father Name</label>
                        <Input
                          placeholder="Father Name"
                          value={editForm.fatherName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fatherName: e.target.value })
                          }
                        />

                        <label>Father Phone</label>
                        <Input
                          placeholder="Father Phone"
                          value={editForm.fatherPhone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fatherPhone: e.target.value })
                          }
                        />

                        <label>Father Occupation</label>
                        <Input
                          placeholder="Father Occupation"
                          value={editForm.fatherOccupation}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fatherOccupation: e.target.value })
                          }
                        />

                        <label>Mother Name</label>
                        <Input
                          placeholder="Mother Name"
                          value={editForm.motherName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, motherName: e.target.value })
                          }
                        />

                        <label>Mother Phone</label>
                        <Input
                          placeholder="Mother Phone"
                          value={editForm.motherPhone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, motherPhone: e.target.value })
                          }
                        />
                        <label>Guardian Name</label>
                        <Input
                          placeholder="Mother Name"
                          value={editForm.guardianName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, guardianName: e.target.value })
                          }
                        />

                        <label>Guardian Phone</label>
                        <Input
                          placeholder="Guardian Phone"
                          value={editForm.guardianPhone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, guardianPhone: e.target.value })
                          }
                        />

                        <label>Guardian Relation</label>
                        <Input
                          placeholder="Guardian Phone"
                          value={editForm.guardianRelation}
                          onChange={(e) =>
                            setEditForm({ ...editForm, guardianRelation: e.target.value })
                          }
                        />



                      </div>

                      <DialogFooter>
                        <Button onClick={updateParent}>Update Parent</Button>
                      </DialogFooter>

                    </DialogContent>
                  </Dialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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