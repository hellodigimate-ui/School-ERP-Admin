/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Download } from "lucide-react";
import Layout from "@/components/accountant/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/apiHome/axiosInstanc";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import dynamic from "next/dynamic";

// Dynamically import the chart component to avoid SSR issues
const PaymentMethodChart = dynamic(() => import("./PaymentMethodChart"), {
  ssr: false,
  loading: () => <div className="bg-card p-4 rounded-xl shadow h-[250px] flex items-center justify-center">Loading chart...</div>
});

/* ---------------- TYPES ---------------- */

type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "ONLINE";

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("COMPLETED");

  const [open, setOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const [methodStats, setMethodStats] = useState<any[]>([]);
  const [methodLoading, setMethodLoading] = useState(false);

  const [form, setForm] = useState({
    admissionNumber: "",
    amount: "",
    method: "CASH" as PaymentMethod,
    transactionId: "",
  });

  const methodChartData = methodStats.map((m) => ({
    name: m.paymentMode,
    value: m.totalAmount,
  }));

  /* ---------------- FETCH ---------------- */

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/payments", {
        params: { page, perPage: 10, status, name: search },
      });

      if (res.data.success) {
        setPayments(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/dashboard/accountant/stats"
      );
      if (res.data.success) setStats(res.data.data);
    } catch (err) {}
  };

  const fetchMethodStats = async () => {
    try {
      setMethodLoading(true);

      const res = await axiosInstance.get(
        "/api/v1/payments/method/stats"
      );

      if (res.data.success) setMethodStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMethodLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
    fetchMethodStats();
  }, [page, search, status]);

  /* ---------------- ADD PAYMENT ---------------- */

  const addPayment = async () => {
    try {
      const res = await axiosInstance.post("/api/v1/payments", {
        admissionNumber: form.admissionNumber,
        amount: Number(form.amount),
        paymentMode: form.method,
        transactionId:
          form.method !== "CASH" ? form.transactionId : undefined,
      });

      if (res.data.success) {
        fetchPayments();
        fetchStats();
        setOpen(false);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message);
    }
  };

  /* ---------------- RECEIPT ---------------- */

  const downloadReceipt = async (p: any, type: "pdf" | "jpeg") => {
    const student = p.Fee?.Student;

    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.top = "-10000px";

    element.innerHTML = `
      <div style="
        font-family: Arial;
        width: 360px;
        padding: 20px;
        background: #fff;
        border-radius: 16px;
      ">
        <h2 style="text-align:center;color:#10B981;">Payment Receipt</h2>

        <div style="
          background:#ECFDF5;
          padding:12px;
          border-radius:10px;
          margin:15px 0;
          text-align:center;
        ">
          <div>Amount Paid</div>
          <div style="font-size:24px;font-weight:bold;color:#059669">
            ₹${p.amount}
          </div>
        </div>

        <p><b>Name:</b> ${student?.name}</p>
        <p><b>Admission:</b> ${student?.admissionNumber}</p>
        <p><b>Method:</b> ${p.paymentMode}</p>
        <p><b>Txn:</b> ${p.transactionId || "N/A"}</p>
        <p><b>Date:</b> ${new Date(p.createdAt).toLocaleDateString()}</p>
      </div>
    `;

    document.body.appendChild(element);

    if (type === "pdf") {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().from(element).save(`receipt-${p.id}.pdf`);
    } else {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(element);
      const link = document.createElement("a");
      link.download = `receipt-${p.id}.jpeg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    }

    document.body.removeChild(element);
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div className="space-y-4">

          <h2 className="text-lg font-semibold">
            💳 Payment Method Distribution
          </h2>

          {/* 🔥 CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {methodLoading ? (
              <p>Loading...</p>
            ) : (
              methodStats.map((m) => (
                <div
                  key={m.paymentMode}
                  className="p-4 rounded-xl bg-gradient-to-br 
                  from-indigo-500 to-purple-500 text-white shadow"
                >
                  <p className="text-xs opacity-80">{m.paymentMode}</p>

                  <h3 className="text-lg font-bold">
                    ₹{Number(m.totalAmount).toLocaleString("en-IN")}
                  </h3>

                  <p className="text-xs opacity-70">
                    {m.paymentCount} payments
                  </p>
                </div>
              ))
            )}
          </div>

          {/* 📊 CHART */}
          <div className="bg-card p-4 rounded-xl shadow">
            <PaymentMethodChart data={methodChartData} />
          </div>
        </div>

        {/* 🔍 SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* 🔍 SEARCH BAR */}
          <div className="relative w-full sm:max-w-md">
            <Input
              placeholder="🔍 Search student..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-4 pr-4 h-11 rounded-xl border border-border 
              bg-card/70 backdrop-blur 
              focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* ➕ ADD BUTTON */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-11 px-5 rounded-xl 
                bg-gradient-to-r from-blue-500 to-indigo-500 
                hover:from-blue-600 hover:to-indigo-600 
                text-white shadow-md transition-all"
              >
                <Plus size={16} className="mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>

            {/* 🔥 MODAL */}
            <DialogContent className="max-w-md rounded-2xl p-6 
              bg-card border border-border shadow-xl">

              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  💳 Add New Payment
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">

                {/* Admission */}
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">
                    Admission Number
                  </label>
                  <Input
                    placeholder="Enter admission number"
                    value={form.admissionNumber}
                    onChange={(e) =>
                      setForm({ ...form, admissionNumber: e.target.value })
                    }
                    className="h-10 rounded-lg"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className="h-10 rounded-lg"
                  />
                </div>

                {/* Method */}
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">
                    Payment Method
                  </label>

                  <select
                    value={form.method}
                    onChange={(e) =>
                      setForm({ ...form, method: e.target.value as any })
                    }
                    className="w-full h-10 rounded-lg border border-border 
                    bg-background px-3 text-sm 
                    focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option>CASH</option>
                    <option>UPI</option>
                    <option>CARD</option>
                    <option>BANK_TRANSFER</option>
                    <option>CHEQUE</option>
                  </select>
                </div>

                {/* Transaction */}
                {form.method !== "CASH" && (
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Transaction ID
                    </label>
                    <Input
                      placeholder="Enter transaction ID"
                      value={form.transactionId}
                      onChange={(e) =>
                        setForm({ ...form, transactionId: e.target.value })
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                )}

                {/* BUTTON */}
                <Button
                  onClick={addPayment}
                  className="w-full h-11 mt-2 rounded-xl 
                  bg-gradient-to-r from-emerald-500 to-green-500 
                  hover:from-emerald-600 hover:to-green-600 
                  text-white shadow-md transition-all"
                >
                  Save Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <div className="bg-card rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => {
                const student = p.Fee?.Student;

                return (
                  <tr key={p.id}>
                    <td className="p-3 text-center">{student?.name}</td>
                    <td className="p-3 text-center text-green-600">₹{p.amount}</td>
                    <td className="p-3 text-center">{p.paymentMode}</td>
                    <td className="p-3 text-center">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 flex gap-2 justify-center items-center">
                      {/* ✅ UPDATED BUTTONS */}
                      {/* <Button
                        size="sm"
                        className="bg-green-500 text-white"
                        onClick={() => downloadReceipt(p, "pdf")}
                      >
                        PDF
                      </Button> */}

                      <Button
                        size="sm"
                        className="bg-blue-500 text-white"
                        onClick={() => downloadReceipt(p, "jpeg")}
                      >
                        <Download size={14} />
                      </Button>

                      <Button size="sm" onClick={() => setViewData(p)}>
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 👁 VIEW MODAL */}
<Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
  <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">

    {viewData && (
      <div className="bg-white">

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h2 className="text-xl font-semibold">Payment Successful</h2>
          <p className="text-sm opacity-90">Transaction Details</p>
        </div>

        {/* 💰 AMOUNT CARD */}
        <div className="px-6 -mt-6">
          <div className="bg-white shadow-lg rounded-xl p-4 text-center border">
            <p className="text-xs text-gray-500">Amount Paid</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{viewData.amount}
            </h2>
          </div>
        </div>

        {/* 📋 DETAILS */}
        <div className="p-6 space-y-4">

          <div className="bg-gray-50 p-4 rounded-xl space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">👤 Student</span>
              <span className="font-medium">
                {viewData.Fee?.Student?.name}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">💳 Payment Mode</span>
              <span className="font-medium">
                {viewData.paymentMode}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">🧾 Transaction ID</span>
              <span className="font-medium">
                {viewData.transactionId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">📅 Date</span>
              <span className="font-medium">
                {new Date(viewData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Status</span>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-400">
                Completed
              </span>
            </div>

          </div>

          {/* 📩 MESSAGE */}
          <p className="text-xs text-gray-500 text-center">
            A confirmation receipt has been generated successfully.
          </p>

          {/* 🔘 ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewData(null)}
              className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
            >
              Close
            </button>

            <button
              onClick={() => downloadReceipt(viewData, "jpeg")}
              
              className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              Download 
            </button>
          </div>

        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

        {/* 📄 PAGINATION */}
        <div className="flex justify-between">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>

          <span>Page {page} / {totalPages}</span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>

      </div>
    </Layout>
  );
}