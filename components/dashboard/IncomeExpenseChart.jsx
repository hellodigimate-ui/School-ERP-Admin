/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function IncomeExpenseChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/payments/daily-amount");

      // Transform API data
      const formatted = res.data.data.map((item) => ({
        day: new Date(item.date).getDate(), // 1,2,3...
        income: item.totalAmount,
        expenses: 0, // optional (or remove line)
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">
          Daily Income Report (Current Month)
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}