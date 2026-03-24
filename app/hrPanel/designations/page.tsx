"use client"
import Layout from "@/components/hrPanel/layout";
import { Plus, Edit2, Users } from "lucide-react";

const designations = [
  { id: 1, title: "Principal", department: "Admin", staffCount: 1, level: "Senior" },
  { id: 2, title: "Vice Principal", department: "Admin", staffCount: 1, level: "Senior" },
  { id: 3, title: "HOD", department: "Teaching", staffCount: 6, level: "Senior" },
  { id: 4, title: "Senior Teacher", department: "Teaching", staffCount: 8, level: "Mid" },
  { id: 5, title: "Teacher", department: "Teaching", staffCount: 14, level: "Junior" },
  { id: 6, title: "Lab Assistant", department: "Lab", staffCount: 5, level: "Junior" },
  { id: 7, title: "Accountant", department: "Admin", staffCount: 2, level: "Mid" },
  { id: 8, title: "Librarian", department: "Support", staffCount: 2, level: "Mid" },
  { id: 9, title: "Peon", department: "Support", staffCount: 4, level: "Junior" },
  { id: 10, title: "Security Guard", department: "Support", staffCount: 3, level: "Junior" },
  { id: 11, title: "IT Administrator", department: "Admin", staffCount: 1, level: "Mid" },
  { id: 12, title: "Counselor", department: "Support", staffCount: 1, level: "Mid" },
];

const levelColors: Record<string, string> = {
  Senior: "bg-accent/10 text-accent",
  Mid: "bg-primary/10 text-primary",
  Junior: "bg-info/10 text-info",
};

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Designations</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage staff designations and hierarchy</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Designation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designations.map((d, i) => (
            <div key={d.id} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{d.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.department}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[d.level]}`}>{d.level}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{d.staffCount} staff</span>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;