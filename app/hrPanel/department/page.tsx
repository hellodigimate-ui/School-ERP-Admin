"use client"

import Layout from "@/components/hrPanel/layout";
import { Plus, Edit2, Users } from "lucide-react";

const departments = [
  { id: 1, name: "Mathematics", head: "Dr. Anita Roy", staff: 5, color: "bg-primary/10 text-primary" },
  { id: 2, name: "Science", head: "Mr. Vikram Das", staff: 8, color: "bg-success/10 text-success" },
  { id: 3, name: "English", head: "Mrs. Priya Nair", staff: 4, color: "bg-accent/10 text-accent" },
  { id: 4, name: "Social Studies", head: "Mr. Suresh Rao", staff: 4, color: "bg-warning/10 text-warning" },
  { id: 5, name: "Computer Science", head: "Ms. Neha Agarwal", staff: 3, color: "bg-info/10 text-info" },
  { id: 6, name: "Physical Education", head: "Mr. Ravi Sharma", staff: 2, color: "bg-destructive/10 text-destructive" },
  { id: 7, name: "Administration", head: "Mr. Rajesh Kumar", staff: 8, color: "bg-primary/10 text-primary" },
  { id: 8, name: "Library", head: "Mrs. Suman Verma", staff: 2, color: "bg-accent/10 text-accent" },
];

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departments</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage school departments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((d, i) => (
            <div key={d.id} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${d.color} flex items-center justify-center mb-3`}>
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">{d.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Head: {d.head}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">{d.staff} members</span>
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
