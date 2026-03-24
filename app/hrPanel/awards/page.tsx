"use client"

import Layout from "@/components/hrPanel/layout";
import { Award, Plus, Trophy, Medal } from "lucide-react";

const awards = [
  { name: "Dr. Anita Roy", award: "Best Teacher of the Year", date: "2026-01-15", category: "Teaching Excellence", icon: Trophy },
  { name: "Mr. Vikram Das", award: "Innovation in Teaching", date: "2025-12-20", category: "Innovation", icon: Award },
  { name: "Mrs. Priya Nair", award: "Student's Choice Award", date: "2025-11-10", category: "Student Feedback", icon: Medal },
  { name: "Mr. Rajesh Kumar", award: "Best Admin Staff", date: "2025-10-05", category: "Administration", icon: Award },
];

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Awards & Recognition</h1>
            <p className="text-sm text-muted-foreground mt-1">Celebrate staff achievements</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Award
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{a.award}</h3>
                    <p className="text-sm text-primary font-medium mt-0.5">{a.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="bg-secondary px-2 py-0.5 rounded-full">{a.category}</span>
                      <span>{a.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
