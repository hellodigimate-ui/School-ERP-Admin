/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AdminLayout } from "@/components/layout/AdminLayout";

const recentImports = [
  { file: "students_class10_2025.csv", date: "2025-01-15", records: 45, status: "Success" },
  { file: "students_class9_2025.xlsx", date: "2025-01-12", records: 52, status: "Success" },
  { file: "students_batch_feb.csv", date: "2025-02-01", records: 38, status: "Partial" },
];

const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    if (!file) return alert("Please upload a file first.");

    setImporting(true);
    setProgress(0);

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setImporting(false);
      }
    }, 200);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">

      {/* ================= Header ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-border/40 shadow-sm">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Bulk Import / Export
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Import or export student data in bulk via CSV/Excel
          </p>
        </div>

        <Badge className="bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 text-white border-0 px-4 py-2 text-xs rounded-xl shadow-sm">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Bulk Operations
        </Badge>

      </div>


        {/* Tabs */}
        <Tabs defaultValue="import" className="space-y-4">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="import" className="text-xs">Import Data</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export Data</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

        {/* ================= IMPORT ================= */}
        <TabsContent value="import">
          <Card className="rounded-2xl border border-border/40 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Import Student Data
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-10 rounded-xl"
              />

              <div>
                <Progress value={progress} className="h-2 rounded-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  {importing ? "Importing..." : "Ready to import"}
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? "Importing..." : "Start Import"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        {/* ================= EXPORT ================= */}
        <TabsContent value="export">
          <Card className="rounded-2xl border border-border/40 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Export Student Data
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <Select>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-end">
                <Button className="h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md transition-all">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        {/* ================= HISTORY ================= */}
        <TabsContent value="history">
          <Card className="rounded-2xl border border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Recent Import / Export History
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentImports.map((r) => (
                    <TableRow key={r.file} className="hover:bg-muted/40 transition-colors">
                      <TableCell>{r.file}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.records}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            r.status === "Success"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>


        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default page;
