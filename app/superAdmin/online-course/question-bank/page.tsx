"use client"

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Question {
  id: string;
  question: string;
  subject: string;
  class: string;
  type: "MCQ" | "True/False" | "Short Answer" | "Essay";
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
}

const sampleQuestions: Question[] = [
  { id: "1", question: "What is the value of π (pi) to two decimal places?", subject: "Mathematics", class: "Class 10", type: "MCQ", difficulty: "Easy", marks: 1 },
  { id: "2", question: "Explain Newton's Third Law of Motion with examples.", subject: "Science", class: "Class 9", type: "Essay", difficulty: "Medium", marks: 5 },
  { id: "3", question: "The Earth revolves around the Sun.", subject: "Science", class: "Class 8", type: "True/False", difficulty: "Easy", marks: 1 },
  { id: "4", question: "Write the chemical formula of water.", subject: "Chemistry", class: "Class 10", type: "Short Answer", difficulty: "Easy", marks: 2 },
  { id: "5", question: "Solve: 2x + 5 = 15", subject: "Mathematics", class: "Class 9", type: "MCQ", difficulty: "Medium", marks: 2 },
  { id: "6", question: "Discuss the causes and effects of the French Revolution.", subject: "History", class: "Class 10", type: "Essay", difficulty: "Hard", marks: 10 },
  { id: "7", question: "Define photosynthesis and its importance.", subject: "Biology", class: "Class 9", type: "Short Answer", difficulty: "Medium", marks: 3 },
  { id: "8", question: "HTML stands for HyperText Markup Language.", subject: "Computer", class: "Class 8", type: "True/False", difficulty: "Easy", marks: 1 },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-stat-green/10 text-stat-green",
  Medium: "bg-stat-orange/10 text-stat-orange",
  Hard: "bg-destructive/10 text-destructive",
};

const typeColors: Record<string, string> = {
  MCQ: "bg-primary/10 text-primary",
  "True/False": "bg-stat-teal/10 text-stat-teal",
  "Short Answer": "bg-stat-purple/10 text-stat-purple",
  Essay: "bg-stat-pink/10 text-stat-pink",
};

const Page = () => {
  const [search, setSearch] = useState("");

  const filtered = sampleQuestions.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage questions for online examinations</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:scale-105 transition-transform">
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {["MCQ", "True/False", "Short Answer", "Essay"].map(type => (
            <div
              key={type}
              className={`rounded-xl p-5 border border-gray-200 shadow-sm text-center bg-gradient-to-r ${
                type === "MCQ" ? "from-blue-50 to-blue-100" :
                type === "True/False" ? "from-green-50 to-green-100" :
                type === "Short Answer" ? "from-yellow-50 to-yellow-100" :
                "from-pink-50 to-pink-100"
              } hover:shadow-md transition-shadow`}
            >
              <p className="text-2xl font-bold text-foreground">{sampleQuestions.filter(q => q.type === type).length}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{type}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Question</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Subject</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Difficulty</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Marks</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr
                    key={q.id}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-foreground max-w-xs truncate">{q.question}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{q.subject}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{q.class}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          typeColors[q.type] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {q.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          difficultyColors[q.difficulty] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{q.marks}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Page;