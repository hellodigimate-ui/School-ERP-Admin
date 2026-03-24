
// import { LibrarianSidebar } from "@/components/librarian/LibrarianSidebar";
import { BookOpen, ArrowLeftRight, Users, TrendingUp, BookMarked, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import LibrarianLayout from "../shell/page";


const stats = [
  { label: "Total Books", value: "12,450", icon: BookOpen, change: "+120", color: "text-info" },
  { label: "Books Issued", value: "1,340", icon: ArrowLeftRight, change: "~85 students", color: "text-warning" },
  { label: "Books Returned", value: "1,180", icon: CheckCircle, change: "+8%", color: "text-success" },
  { label: "Overdue Books", value: "62", icon: AlertTriangle, change: "12 students", color: "text-destructive" },
  { label: "Total Students", value: "2,850", icon: Users, change: "+5%", color: "text-accent" },
  { label: "New Arrivals", value: "85", icon: BookMarked, change: "This Month", color: "text-info" },
  { label: "Lost / Damaged", value: "14", icon: Clock, change: "-3", color: "text-warning" },
  { label: "Active Members", value: "1,920", icon: TrendingUp, change: "+12%", color: "text-success" },
];

const recentActivity = [
  { student: "Aarav Sharma", class: "10-A", book: "Physics Vol. 2", action: "Issued", date: "20 Feb 2026" },
  { student: "Priya Patel", class: "9-B", book: "English Literature", action: "Returned", date: "20 Feb 2026" },
  { student: "Rahul Verma", class: "11-C", book: "Chemistry Lab Manual", action: "Issued", date: "19 Feb 2026" },
  { student: "Sneha Gupta", class: "8-A", book: "Mathematics NCERT", action: "Overdue", date: "15 Feb 2026" },
  { student: "Vikram Singh", class: "12-B", book: "Biology Textbook", action: "Returned", date: "19 Feb 2026" },
];

export default function LibrarianDashboard() {
  return (
    <LibrarianLayout>
        
        <div className="space-y-8">

            {/* ================= Welcome Banner ================= */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-xl">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 mb-2">
                    📚 Library Overview
                    </p>

                    <h1 className="text-4xl font-bold font-display">
                    Welcome back 👋
                    </h1>

                    <p className="mt-2 text-sm opacity-90">
                    Here’s what’s happening in your library today
                    </p>

                    <p className="text-xs opacity-70 mt-2">
                    Friday, 20 February 2026 • Librarian Panel
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md px-10 py-6 shadow-lg">
                    <span className="text-4xl font-bold font-display">1,340</span>
                    <span className="text-sm opacity-90 mt-1">Books Issued Today</span>
                </div>
                </div>
            </div>


            {/* ================= Stats Grid ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className={`text-xs font-semibold ${stat.color}`}>
                        {stat.change}
                    </span>
                    </div>

                    <p className="text-3xl font-bold font-display mb-1">
                    {stat.value}
                    </p>

                    <p className="text-sm text-muted-foreground">
                    {stat.label}
                    </p>
                </div>
                ))}
            </div>


            {/* ================= Recent Activity ================= */}
            <div className="rounded-3xl border border-border/50 bg-card shadow-sm">
                
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="text-xl font-semibold font-display">
                    Recent Activity
                </h2>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                    <tr className="text-left">
                        <th className="px-6 py-4 font-medium text-muted-foreground">Student</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Class</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Book</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Action</th>
                        <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    {recentActivity.map((row, i) => (
                        <tr
                        key={i}
                        className="border-t border-border/40 hover:bg-muted/30 transition-colors"
                        >
                        <td className="px-6 py-4 font-medium">
                            {row.student}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                            {row.class}
                        </td>

                        <td className="px-6 py-4">
                            {row.book}
                        </td>

                        <td className="px-6 py-4">
                            <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                row.action === "Issued"
                                ? "bg-blue-100 text-blue-700"
                                : row.action === "Returned"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                            {row.action}
                            </span>
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                            {row.date}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    </LibrarianLayout>
  );
}