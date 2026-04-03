// /* eslint-disable react-hooks/rules-of-hooks */
"use client"


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { useState } from "react";

const feeTypes = [
  { id: 1, name: "Admission Fees", code: "ADM", amount: "₹5,000", frequency: "One Time", status: "Active" },
  { id: 2, name: "Tuition Fees", code: "TUT", amount: "₹3,000/month", frequency: "Monthly", status: "Active" },
  { id: 3, name: "Book Fees", code: "BKF", amount: "₹2,500", frequency: "Annual", status: "Active" },
  { id: 4, name: "Uniform Fees", code: "UNF", amount: "₹3,500", frequency: "Annual", status: "Active" },
  { id: 5, name: "Transport Fees", code: "TRN", amount: "₹1,500/month", frequency: "Monthly", status: "Active" },
  { id: 6, name: "Hostel Fees", code: "HST", amount: "₹5,000/month", frequency: "Monthly", status: "Active" },
  { id: 7, name: "Exam Fees", code: "EXM", amount: "₹1,000", frequency: "Per Exam", status: "Active" },
  { id: 8, name: "Late Fees (Fine)", code: "LTF", amount: "₹50/day", frequency: "As Applicable", status: "Active" },
  { id: 9, name: "Library Fees", code: "LIB", amount: "₹500", frequency: "Annual", status: "Active" },
  { id: 10, name: "Miscellaneous Fees", code: "MSC", amount: "Variable", frequency: "As Applicable", status: "Active" },
];

const Page = () => {
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1400px]">

        {/* Header Section */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 
        p-6 rounded-3xl shadow-sm border border-white/60">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 ">
              Fees Type
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Configure different types of fees for the institution
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 
              text-white gap-2 shadow-md hover:brightness-110 transition">
                <Plus className="w-4 h-4" />
                Add Fee Type
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add Fee Type
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Fee Name *</Label>
                  <Input placeholder="e.g. Admission Fees" />
                </div>

                <div className="space-y-2">
                  <Label>Fee Code *</Label>
                  <Input placeholder="e.g. ADM" />
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="Amount" />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Description..." />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110">
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Card */}
        <Card className="border border-gray-100 shadow-xl rounded-3xl overflow-hidden bg-white">

          <CardContent className="p-0">

            <Table>

              {/* Table Header */}
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <TableHead>#</TableHead>
                  <TableHead>Fee Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>
                {feeTypes.map((f) => (
                  <TableRow
                    key={f.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition"
                  >
                    <TableCell>{f.id}</TableCell>

                    <TableCell className="font-semibold text-gray-800">
                      {f.name}
                    </TableCell>

                    <TableCell>
                      <code className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                        {f.code}
                      </code>
                    </TableCell>

                    <TableCell className="font-medium text-gray-700">
                      {f.amount}
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-600">
                        {f.frequency}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-green-100 text-green-600">
                        {f.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>

          </CardContent>
        </Card>

    </div>
    </AdminLayout>

  );
};

export default Page;
