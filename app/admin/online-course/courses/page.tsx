"use client"


import { useState } from "react";
import { Plus, Search, Play, Users, Clock, MoreVertical, BookOpen, Star } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  duration: string;
  lessons: number;
  rating: number;
  status: "active" | "draft" | "archived";
  category: string;
  progress?: number;
}

const sampleCourses: Course[] = [
  { id: "1", title: "Mathematics - Class 10", description: "Complete mathematics course covering algebra, geometry, and trigonometry.", instructor: "Mr. Rajesh Kumar", students: 45, duration: "40 hrs", lessons: 32, rating: 4.8, status: "active", category: "Mathematics", progress: 65 },
  { id: "2", title: "Science - Class 9", description: "Physics, chemistry and biology fundamentals for class 9 students.", instructor: "Mrs. Priya Sharma", students: 38, duration: "35 hrs", lessons: 28, rating: 4.6, status: "active", category: "Science", progress: 42 },
  { id: "3", title: "English Literature", description: "Poetry, prose, and grammar comprehensive course.", instructor: "Ms. Anita Verma", students: 52, duration: "30 hrs", lessons: 24, rating: 4.9, status: "active", category: "English", progress: 80 },
  { id: "4", title: "Hindi - Class 8", description: "Hindi vyakaran and sahitya for class 8.", instructor: "Mr. Suresh Yadav", students: 30, duration: "25 hrs", lessons: 20, rating: 4.3, status: "draft", category: "Hindi" },
  { id: "5", title: "Computer Science", description: "Introduction to programming and digital literacy.", instructor: "Mr. Amit Singh", students: 60, duration: "45 hrs", lessons: 36, rating: 4.7, status: "active", category: "Computer", progress: 55 },
  { id: "6", title: "Social Studies - Class 10", description: "History, geography, civics and economics.", instructor: "Mrs. Kavita Jain", students: 42, duration: "38 hrs", lessons: 30, rating: 4.5, status: "archived", category: "Social Studies" },
];


const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");

  const filtered = sampleCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout>
        <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-3xl font-bold text-foreground">Online Courses</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and monitor all online courses</p>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:scale-105 transition-transform">
            <Plus className="h-4 w-4" />
            Add Course
            </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{sampleCourses.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Courses</p>
                </div>
            </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-md">
                <Users className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{sampleCourses.reduce((a, c) => a + c.students, 0)}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Enrolled</p>
                </div>
            </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-md">
                <Play className="h-6 w-6" />
                </div>
                <div>
                <p className="text-2xl font-bold text-foreground">{sampleCourses.filter(c => c.status === "active").length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Courses</p>
                </div>
            </div>
            </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {(["all", "active", "draft", "archived"] as const).map(f => (
                <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    filter === f ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow" : "text-muted-foreground hover:text-foreground"
                }`}
                >
                {f}
                </button>
            ))}
            </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(course => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                
                {/* Status Color Bar */}
                <div className={`h-2 ${
                course.status === "active" ? "bg-blue-500" :
                course.status === "draft" ? "bg-orange-500" :
                "bg-gray-300"
                }`} />

                <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-white bg-blue-500 px-2 py-0.5 rounded">{course.category}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                        course.status === "active" ? "bg-blue-100 text-blue-800" :
                        course.status === "draft" ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-600"
                        }`}>{course.status}</span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                    </button>
                </div>

                <div className="text-sm text-muted-foreground">by {course.instructor}</div>

                {course.progress !== undefined && (
                    <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gray-400" />{course.students}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" />{course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-gray-400" />{course.lessons} lessons</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                    <Star className="h-3.5 w-3.5 fill-current" />{course.rating}
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>

        </div>
    </AdminLayout>
  );
};

export default Page;