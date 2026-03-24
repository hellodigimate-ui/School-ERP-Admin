"use client"

import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  name: string;
  teacher: string;
  progress: number;
}

const courses: Course[] = [
  { id: "1", name: "Mathematics", teacher: "Mrs. Sharma", progress: 75 },
  { id: "2", name: "Physics", teacher: "Mr. Patel", progress: 60 },
  { id: "3", name: "English", teacher: "Mrs. Gupta", progress: 85 },
  { id: "4", name: "Chemistry", teacher: "Mr. Kumar", progress: 45 },
];

export function CourseProgress() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Course Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {courses.map((course) => (
          <div key={course.id}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{course.name}</p>
                <p className="text-xs text-muted-foreground">{course.teacher}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}