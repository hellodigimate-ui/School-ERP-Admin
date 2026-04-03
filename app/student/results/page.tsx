"use client"

import { useEffect, useState } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface ResultRecord {
  id: string;
  examName: string;
  className: string;
  totalMarks: number;
  obtained: number;
  percentage: number;
  grade: string;
  status: string;
  rank: number;
}

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
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalResults = results.length;
  const averagePercentage =
    totalResults > 0
      ? Number(
          (
            results.reduce((sum, item) => sum + item.percentage, 0) /
            totalResults
          ).toFixed(2),
        )
      : 0;
  const passCount = results.filter((item) => item.status === "Pass").length;
  const failCount = results.filter((item) => item.status === "Fail").length;

  const fetchResults = async () => {
    setLoadingResults(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/v1/results/me");
      if (response.data?.success) {
        setResults(response.data.data || []);
      } else {
        setError(response.data?.message || "Unable to load results.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load results.");
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Exams</p>
                <p className="text-xl font-bold text-foreground">{totalResults}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average %</p>
                <p className="text-xl font-bold text-foreground">{averagePercentage}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Passed</p>
                <p className="text-xl font-bold text-foreground">{passCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-xl font-bold text-foreground">{failCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-2">
            <div>
              <CardTitle>Exam Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                View your latest exam results and progress summary.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchResults} disabled={loadingResults}>
              <Download className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loadingResults ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading results...</div>
            ) : error ? (
              <div className="text-center py-8 text-sm text-destructive">{error}</div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No results available yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Exam</th>
                      <th className="text-left py-3 font-medium">Class</th>
                      <th className="text-center py-3 font-medium">Total</th>
                      <th className="text-center py-3 font-medium">Obtained</th>
                      <th className="text-center py-3 font-medium">%</th>
                      <th className="text-center py-3 font-medium">Grade</th>
                      <th className="text-center py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b last:border-0 hover:bg-muted/10">
                        <td className="py-3">
                          <div className="font-medium">{result.examName || "Exam"}</div>
                        </td>
                        <td className="py-3 text-muted-foreground">{result.className || "-"}</td>
                        <td className="py-3 text-center">{result.totalMarks}</td>
                        <td className="py-3 text-center">{result.obtained}</td>
                        <td className="py-3 text-center">{result.percentage}%</td>
                        <td className="py-3 text-center">
                          <Badge variant="outline" className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">{result.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
