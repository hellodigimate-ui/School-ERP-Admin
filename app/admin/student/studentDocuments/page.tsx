/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState } from "react";
import { Search,  ShieldCheck, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminLayout } from "@/components/layout/AdminLayout";

const mockDocuments = [
  { id: "ADM-2025-001", name: "Aarav Patel", class: "10-A", apaarId: "APR20251234", rte: "Yes", pen: "PEN98765", aadhar: "XXXX-XXXX-1234", docsUploaded: 4, docsRequired: 5, verified: true },
  { id: "ADM-2025-002", name: "Priya Sharma", class: "10-B", apaarId: "APR20251235", rte: "No", pen: "PEN98766", aadhar: "XXXX-XXXX-5678", docsUploaded: 5, docsRequired: 5, verified: true },
  { id: "ADM-2025-003", name: "Rohan Kumar", class: "9-A", apaarId: "—", rte: "Yes", pen: "PEN98767", aadhar: "XXXX-XXXX-9012", docsUploaded: 2, docsRequired: 5, verified: false },
  { id: "ADM-2025-004", name: "Ananya Singh", class: "9-B", apaarId: "APR20251237", rte: "No", pen: "—", aadhar: "XXXX-XXXX-3456", docsUploaded: 3, docsRequired: 5, verified: false },
  { id: "ADM-2025-005", name: "Vikram Reddy", class: "8-A", apaarId: "APR20251238", rte: "No", pen: "PEN98769", aadhar: "XXXX-XXXX-7890", docsUploaded: 5, docsRequired: 5, verified: true },
  { id: "ADM-2025-006", name: "Meera Joshi", class: "8-B", apaarId: "—", rte: "Yes", pen: "PEN98770", aadhar: "XXXX-XXXX-2345", docsUploaded: 1, docsRequired: 5, verified: false },
];

const documentTypes = ["Birth Certificate", "Aadhar Card", "Transfer Certificate", "Marksheet", "Caste Certificate", "Income Certificate", "Passport Photo", "Medical Certificate"];

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAadhar, setShowAadhar] = useState<Record<string, boolean>>({});

  const filtered = mockDocuments.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm)
  );

  const toggleAadhar = (id: string) => {
    setShowAadhar((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between relative overflow-hidden rounded-2xl p-6 shadow-md bg-white border border-slate-200">

          {/* Soft Gradient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 opacity-60"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="page-header font-heading text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
              Documents & IDs
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage APAAR ID, RTE, PEN & document verification
            </p>
          </div>

          <Badge className="relative z-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white border-0 px-5 py-1.5 text-xs rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Secure Access
          </Badge>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Total Students", value: "6", gradient: "gradient-primary" },
            { label: "Docs Verified", value: "3", gradient: "gradient-success" },
            { label: "Pending Docs", value: "3", gradient: "gradient-warning" },
            { label: "RTE Students", value: "3", gradient: "gradient-pink" },
          ].map((s) => (
            <div
              key={s.label}
              className={`stat-card-gradient ${s.gradient} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <p className="text-xs font-semibold opacity-80 tracking-wide">
                {s.label}
              </p>
              <p className="text-2xl font-bold mt-2">
                {s.value}
              </p>
            </div>
          ))}
        </div>


        <Tabs defaultValue="ids" className="space-y-4">
          <TabsList className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="ids"
              className="text-xs rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              ID Management
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="text-xs rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              Upload Documents
            </TabsTrigger>
          </TabsList>

          {/* IDs Tab */}
          <TabsContent value="ids">
            <Card className="border-border/40 shadow-md rounded-2xl overflow-hidden">

              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-indigo-500" />
                  <Input
                    placeholder="Search by name or admission number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 bg-white/70 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-300 h-9 rounded-lg text-sm"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-purple-50">
                      <TableHead className="text-xs font-semibold">Adm No</TableHead>
                      <TableHead className="text-xs font-semibold">Name</TableHead>
                      <TableHead className="text-xs font-semibold">Class</TableHead>
                      <TableHead className="text-xs font-semibold">APAAR ID</TableHead>
                      <TableHead className="text-xs font-semibold">RTE</TableHead>
                      <TableHead className="text-xs font-semibold">PEN</TableHead>
                      <TableHead className="text-xs font-semibold">Aadhar (Masked)</TableHead>
                      <TableHead className="text-xs font-semibold">Docs</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow
                        key={s.id}
                        className="hover:bg-purple-50/60 transition-all duration-200"
                      >
                        <TableCell className="text-xs font-mono text-indigo-600">
                          {s.id}
                        </TableCell>

                        <TableCell className="text-sm font-semibold text-slate-700">
                          {s.name}
                        </TableCell>

                        <TableCell className="text-sm">{s.class}</TableCell>

                        <TableCell className="text-xs font-mono text-purple-600">
                          {s.apaarId}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={s.rte === "Yes" ? "default" : "secondary"}
                            className="text-[10px] px-2 py-0.5 rounded-full shadow-sm"
                          >
                            {s.rte}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-xs font-mono text-blue-600">
                          {s.pen}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono">
                              {showAadhar[s.id]
                                ? s.aadhar.replace(/X/g, "9")
                                : s.aadhar}
                            </span>
                            <button
                              onClick={() => toggleAadhar(s.id)}
                              className="text-muted-foreground hover:text-indigo-600 transition"
                            >
                              {showAadhar[s.id] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-semibold text-indigo-600">
                            {s.docsUploaded}/{s.docsRequired}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={s.verified ? "default" : "secondary"}
                            className={`text-[10px] px-2 py-0.5 rounded-full shadow-sm ${
                              s.verified
                                ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/15 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {s.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

            </Card>
          </TabsContent>


          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card className="border-border/40 shadow-md overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 px-5">
                <CardTitle className="text-sm font-semibold text-white tracking-wide">
                  Upload Student Documents
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-5 bg-gradient-to-br from-white to-emerald-50/40">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-emerald-700">
                      Select Student *
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm rounded-xl border-emerald-200 focus:ring-2 focus:ring-emerald-300 transition">
                        <SelectValue placeholder="Choose student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDocuments.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-cyan-700">
                      Document Type *
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm rounded-xl border-cyan-200 focus:ring-2 focus:ring-cyan-300 transition">
                        <SelectValue placeholder="Choose document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-10 text-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50 hover:shadow-md transition-all duration-300">
                  <Upload className="w-9 h-9 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, JPG, PNG up to 5MB
                  </p>
                  <Input
                    type="file"
                    className="mt-4 max-w-xs mx-auto h-9 text-sm rounded-xl border-emerald-200 focus:ring-2 focus:ring-emerald-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="verify" className="text-emerald-600" />
                  <Label htmlFor="verify" className="text-xs text-slate-600">
                    Mark as verified by admin
                  </Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 px-6 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
                  >
                    <Upload className="w-4 h-4 mr-1.5" />
                    Upload Document
                  </Button>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default page;