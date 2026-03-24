"use client"


import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Award, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const semesterResults = [
  {
    semester: "Semester 6",
    sgpa: 8.9,
    credits: 22,
    status: "current",
    subjects: [
      { name: "Data Structures", code: "CS301", credits: 4, grade: "A", marks: 85, maxMarks: 100 },
      { name: "Database Systems", code: "CS302", credits: 4, grade: "A+", marks: 92, maxMarks: 100 },
      { name: "Computer Networks", code: "CS303", credits: 3, grade: "B+", marks: 78, maxMarks: 100 },
      { name: "Operating Systems", code: "CS304", credits: 4, grade: "A", marks: 88, maxMarks: 100 },
      { name: "Software Engineering", code: "CS305", credits: 3, grade: "A", marks: 84, maxMarks: 100 },
      { name: "Web Technologies", code: "CS306", credits: 4, grade: "A+", marks: 95, maxMarks: 100 },
    ],
  },
  {
    semester: "Semester 5",
    sgpa: 8.7,
    credits: 21,
    status: "completed",
    subjects: [
      { name: "Algorithm Design", code: "CS251", credits: 4, grade: "A", marks: 86, maxMarks: 100 },
      { name: "Computer Architecture", code: "CS252", credits: 3, grade: "B+", marks: 76, maxMarks: 100 },
      { name: "Discrete Mathematics", code: "CS253", credits: 4, grade: "A", marks: 82, maxMarks: 100 },
      { name: "Object Oriented Programming", code: "CS254", credits: 4, grade: "A+", marks: 91, maxMarks: 100 },
      { name: "Statistics", code: "MA251", credits: 3, grade: "B", marks: 72, maxMarks: 100 },
      { name: "Communication Skills", code: "HS251", credits: 3, grade: "A", marks: 85, maxMarks: 100 },
    ],
  },
  {
    semester: "Semester 4",
    sgpa: 8.5,
    credits: 22,
    status: "completed",
    subjects: [
      { name: "Data Analysis", code: "CS201", credits: 4, grade: "A", marks: 84, maxMarks: 100 },
      { name: "Digital Logic", code: "CS202", credits: 3, grade: "B+", marks: 77, maxMarks: 100 },
      { name: "Linear Algebra", code: "MA201", credits: 4, grade: "A", marks: 83, maxMarks: 100 },
      { name: "Java Programming", code: "CS203", credits: 4, grade: "A+", marks: 90, maxMarks: 100 },
      { name: "Economics", code: "HS201", credits: 3, grade: "B+", marks: 75, maxMarks: 100 },
      { name: "Environmental Science", code: "ES201", credits: 4, grade: "A", marks: 86, maxMarks: 100 },
    ],
  },
];

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A+": return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
    case "A": return "bg-green-500/20 text-green-600 border-green-500/30";
    case "B+": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    case "B": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Results() {
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Results</h1>
          <p className="text-muted-foreground">View your semester-wise grades and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CGPA</p>
                <p className="text-xl font-bold text-foreground">8.7</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current SGPA</p>
                <p className="text-xl font-bold text-foreground">8.9</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Credits</p>
                <p className="text-xl font-bold text-foreground">132</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Class Rank</p>
                <p className="text-xl font-bold text-foreground">#5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CGPA Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">CGPA Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"].map((sem, i) => {
                const cgpas = [8.2, 8.4, 8.3, 8.5, 8.7, 8.9];
                return (
                  <div key={sem} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-14">{sem}</span>
                    <div className="flex-1">
                      <Progress value={cgpas[i] * 10} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-10">{cgpas[i]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Semester Results */}
        <Tabs defaultValue="semester-6" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            {semesterResults.map((sem) => (
              <TabsTrigger key={sem.semester} value={sem.semester.toLowerCase().replace(" ", "-")}>
                {sem.semester}
                {sem.status === "current" && (
                  <Badge variant="secondary" className="ml-2 text-[10px]">Current</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {semesterResults.map((sem) => (
            <TabsContent key={sem.semester} value={sem.semester.toLowerCase().replace(" ", "-")}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>{sem.semester} Results</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      SGPA: {sem.sgpa} | Credits: {sem.credits}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-medium">Subject</th>
                          <th className="text-left py-3 font-medium hidden sm:table-cell">Code</th>
                          <th className="text-center py-3 font-medium">Credits</th>
                          <th className="text-center py-3 font-medium">Marks</th>
                          <th className="text-center py-3 font-medium">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.subjects.map((subject) => (
                          <tr key={subject.code} className="border-b last:border-0">
                            <td className="py-3">
                              <span className="font-medium">{subject.name}</span>
                              <span className="text-muted-foreground sm:hidden text-xs block">
                                {subject.code}
                              </span>
                            </td>
                            <td className="py-3 text-muted-foreground hidden sm:table-cell">
                              {subject.code}
                            </td>
                            <td className="py-3 text-center">{subject.credits}</td>
                            <td className="py-3 text-center">
                              {subject.marks}/{subject.maxMarks}
                            </td>
                            <td className="py-3 text-center">
                              <Badge variant="outline" className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentLayout>
  );
}
