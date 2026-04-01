/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {  Search } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, Suspense } from "react";
import Layout from "@/components/accountant/Layout";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { Button } from "@/components/ui/button";

/* ------------------ COLLECT FEES ------------------ */

const CollectFees = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  /* 🔥 Debounce */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* 🔥 Fetch API */
  const fetchFees = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/fees", {
        params: {
          name: debouncedSearch,
          page,
          limit,
        },
      });

      const data = res?.data;

      setFees(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error("Fees API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-6">

      {/* 🔥 Gradient Header */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-400 p-6 rounded-3xl text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Collect Fees</h1>
          <p className="text-white/80 text-sm">Manage student payments easily</p>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="bg-card p-4 rounded-xl shadow">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="pl-9 w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              ...
            </span>
          )}
        </div>
      </div>

      {/* 📊 Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-5 py-3 text-left text-xs">Student</th>
                <th className="px-5 py-3 text-left text-xs">Admission</th>
                <th className="px-5 py-3 text-right text-xs">Total</th>
                <th className="px-5 py-3 text-right text-xs">Paid</th>
                <th className="px-5 py-3 text-right text-xs">Due</th>
                <th className="px-5 py-3 text-center text-xs">Status</th>
                <th className="px-5 py-3 text-center text-xs">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    No data found
                  </td>
                </tr>
              ) : (
                fees.map((fee: any) => {
                  const student = fee.Student;

                  const total = Number(fee.totalFee || 0);
                  const paid = Number(fee.depositFee || 0);
                  const due = Math.max(total - paid, 0);

                  let status = "Unpaid";
                  if (paid >= total && total > 0) status = "Paid";
                  else if (paid > 0) status = "Partial";

                  return (
                    <tr key={fee.id} className="border-b hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">
                        {student?.name}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {student?.admissionNumber}
                      </td>

                      <td className="px-5 py-3 text-right">
                        ₹{total.toLocaleString()}
                      </td>

                      <td className="px-5 py-3 text-right text-green-600 font-semibold">
                        ₹{paid.toLocaleString()}
                      </td>

                      <td className="px-5 py-3 text-right text-red-500 font-semibold">
                        ₹{due.toLocaleString()}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-center">
                        <button
                          className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs hover:opacity-90 disabled:opacity-50"
                          disabled={due === 0}
                        >
                          {due === 0 ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 Pagination */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

/* ------------------ PAGE ------------------ */

const Page = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "collect";

  return (
    <Layout>
      {/* <Header
        title="Fees Collection"
        description="Collect and manage student fees"
        icon={IndianRupee}
      /> */}

      <Tabs defaultValue={tab}>
        <TabsContent value="collect">
          <CollectFees />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

const PageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWrapper;