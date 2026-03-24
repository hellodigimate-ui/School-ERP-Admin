/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import LibrarianLayout from "../shell/page";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "", admissionNo: "", class: "", section: "", rollNo: "", mobile: "", email: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <LibrarianLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold font-display">Add Student to Library</h1>
          <p className="text-sm text-muted-foreground">Register a student for library membership</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ["name", "Student Name"],
              ["admissionNo", "Admission No."],
              ["class", "Class"],
              ["section", "Section"],
              ["rollNo", "Roll Number"],
              ["mobile", "Mobile Number"],
              ["email", "Email Address"],
            ] as const).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <input
                  type="text"
                  value={(form as any)[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <UserPlus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}
