/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SuperAdminLayout from "@/components/administrator/superAdminLayout";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 450 },
  { name: "May", value: 600 },
];

export default function SuperAdminReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2025-26");

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="p-6 bg-card dark:bg-card rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold">Super Admin Reports</h1>
          <p className="text-muted-foreground mt-1">Summary dashboards for top-level reports.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Overview ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge className="p-4 bg-blue-100 text-blue-800">Total Schools: 14</Badge>
              <Badge className="p-4 bg-emerald-100 text-emerald-800">Active Users: 9,852</Badge>
              <Badge className="p-4 bg-yellow-100 text-amber-800">Payments: ₹1.2M</Badge>
              <Badge className="p-4 bg-violet-100 text-violet-800">Open Tickets: 12</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Audit Summary", date: "2026-03-01", status: "Done" },
                  { name: "Finance Trend", date: "2026-02-24", status: "In Progress" },
                  { name: "Attendance QC", date: "2026-02-10", status: "Done" },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
