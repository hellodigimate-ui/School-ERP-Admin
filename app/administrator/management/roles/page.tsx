/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, ShieldCheck, Search } from "lucide-react";
import { toast } from "sonner";

const modules = [
  "Dashboard", "Front Office", "Academics", "Student Information", "Certificate",
  "Attendance", "Examination", "Fees Collection", "Scholarship", "Human Resource",
  "Online Course", "Behaviour Records", "G-Meet Classes", "Lesson Plan", "Calendar",
  "Communicate", "Homework", "Download Center", "Library", "Inventory",
  "Transport", "Hostel", "Canteen", "Sports", "Front CMS", "Alumni", "Reports",
  "Admin Management", "System Settings",
];

const permissions = ["View", "Create", "Edit", "Delete"];

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  modulePermissions: Record<string, string[]>;
}

const defaultRoles: Role[] = [
  {
    id: "1", name: "Super Admin", description: "Full system access with all permissions",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    modulePermissions: Object.fromEntries(modules.map(m => [m, [...permissions]])),
  },
  {
    id: "2", name: "Admin", description: "Administrative access with limited settings",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    modulePermissions: Object.fromEntries(modules.filter(m => m !== "System Settings" && m !== "Admin Management").map(m => [m, [...permissions]])),
  },
  {
    id: "3", name: "Teacher", description: "Access to academic and student modules",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    modulePermissions: { Dashboard: ["View"], Academics: ["View", "Edit"], "Student Information": ["View"], Attendance: ["View", "Create", "Edit"], Examination: ["View", "Create", "Edit"], Homework: ["View", "Create", "Edit", "Delete"], "Lesson Plan": ["View", "Create", "Edit"] },
  },
  {
    id: "4", name: "Accountant", description: "Access to financial modules",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    modulePermissions: { Dashboard: ["View"], "Fees Collection": ["View", "Create", "Edit"], Scholarship: ["View", "Create", "Edit"], Reports: ["View"] },
  },
  {
    id: "5", name: "Receptionist", description: "Front office operations",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    modulePermissions: { Dashboard: ["View"], "Front Office": ["View", "Create", "Edit", "Delete"], Communicate: ["View", "Create"] },
  },
  {
    id: "6", name: "Librarian", description: "Library management access",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    modulePermissions: { Dashboard: ["View"], Library: ["View", "Create", "Edit", "Delete"] },
  },
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [search, setSearch] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [editPerms, setEditPerms] = useState<Record<string, string[]>>({});

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setNewRole({ name: role.name, description: role.description });
    setEditPerms({ ...role.modulePermissions });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingRole(null);
    setNewRole({ name: "", description: "" });
    setEditPerms({});
    setDialogOpen(true);
  };

  const togglePerm = (mod: string, perm: string) => {
    setEditPerms(prev => {
      const current = prev[mod] || [];
      if (current.includes(perm)) {
        const next = current.filter(p => p !== perm);
        if (next.length === 0) { const { [mod]: _, ...rest } = prev; return rest; }
        return { ...prev, [mod]: next };
      }
      return { ...prev, [mod]: [...current, perm] };
    });
  };

  const toggleAllModule = (mod: string) => {
    setEditPerms(prev => {
      const current = prev[mod] || [];
      if (current.length === permissions.length) {
        const { [mod]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [mod]: [...permissions] };
    });
  };

  const saveRole = () => {
    if (!newRole.name.trim()) { toast.error("Role name is required"); return; }
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, name: newRole.name, description: newRole.description, modulePermissions: editPerms } : r));
      toast.success("Role updated");
    } else {
      const colors = ["bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700", "bg-orange-100 text-orange-700"];
      setRoles(prev => [...prev, { id: Date.now().toString(), name: newRole.name, description: newRole.description, color: colors[prev.length % colors.length], modulePermissions: editPerms }]);
      toast.success("Role created");
    }
    setDialogOpen(false);
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    toast.success("Role deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage user roles and module-level access control</p>
        </div>
        <Button onClick={openNewDialog} className="gap-2">
          <Plus className="w-4 h-4" /> Create Role
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRoles.map(role => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">{role.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(role)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  {role.name !== "Super Admin" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteRole(role.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground mb-2">Modules ({Object.keys(role.modulePermissions).length})</p>
              <div className="flex flex-wrap gap-1">
                {Object.keys(role.modulePermissions).slice(0, 6).map(mod => (
                  <Badge key={mod} variant="secondary" className="text-[10px] font-normal">{mod}</Badge>
                ))}
                {Object.keys(role.modulePermissions).length > 6 && (
                  <Badge variant="outline" className="text-[10px]">+{Object.keys(role.modulePermissions).length - 6} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role Name</Label>
                <Input value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Teacher" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={newRole.description} onChange={e => setNewRole(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Module Permissions</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_repeat(4,60px)_50px] gap-0 bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
                  <span>Module</span>
                  {permissions.map(p => <span key={p} className="text-center">{p}</span>)}
                  <span className="text-center">All</span>
                </div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {modules.map(mod => (
                    <div key={mod} className="grid grid-cols-[1fr_repeat(4,60px)_50px] gap-0 px-4 py-2 items-center hover:bg-muted/50 text-sm">
                      <span>{mod}</span>
                      {permissions.map(perm => (
                        <div key={perm} className="flex justify-center">
                          <Checkbox
                            checked={(editPerms[mod] || []).includes(perm)}
                            onCheckedChange={() => togglePerm(mod, perm)}
                          />
                        </div>
                      ))}
                      <div className="flex justify-center">
                        <Checkbox
                          checked={(editPerms[mod] || []).length === permissions.length}
                          onCheckedChange={() => toggleAllModule(mod)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveRole}>{editingRole ? "Update Role" : "Create Role"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
