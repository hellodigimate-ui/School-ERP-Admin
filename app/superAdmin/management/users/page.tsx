"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";

type Role =
  | "super_admin"
  | "admin"
  | "teacher"
  | "accountant"
  | "receptionist"
  | "librarian";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
}

const roleColors: Record<Role, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  teacher: "bg-green-100 text-green-700",
  accountant: "bg-yellow-100 text-yellow-700",
  receptionist: "bg-pink-100 text-pink-700",
  librarian: "bg-orange-100 text-orange-700",
};

const initialUsers: AdminUser[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@school.com",
    role: "super_admin",
    status: "active",
  },
  {
    id: "2",
    name: "Rahul Sharma",
    email: "rahul@school.com",
    role: "admin",
    status: "active",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya@school.com",
    role: "teacher",
    status: "active",
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    email: string;
    role: Role;
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    role: "admin",
    status: "active",
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      role: "admin",
      status: "active",
    });
    setOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
    });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id ? { ...u, ...form } : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
    }

    setOpen(false);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Manage Users
            </h1>
            <p className="text-sm text-muted-foreground">
              Create, edit and manage admin users and their roles
            </p>
          </div>

          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users List */}
        <div className="grid gap-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{u.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {u.email}
                  </p>
                </div>

                {/* Role */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[u.role]}`}
                >
                  {u.role.replace("_", " ")}
                </span>

                {/* Status */}
                <Badge
                  variant={
                    u.status === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {u.status}
                </Badge>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(u)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {u.role !== "super_admin" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteUser(u.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit User" : "Create New User"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Role
                </label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({ ...form, role: v as Role })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="accountant">
                      Accountant
                    </SelectItem>
                    <SelectItem value="receptionist">
                      Receptionist
                    </SelectItem>
                    <SelectItem value="librarian">
                      Librarian
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button onClick={save}>
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}