"use client";

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

const data = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 5000, expenses: 2800 },
  { month: "Apr", income: 4780, expenses: 3908 },
  { month: "May", income: 5890, expenses: 3200 },
  { month: "Jun", income: 6390, expenses: 4100 },
];

export default function IncomeExpenseChart() {
  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">
          Income & Expenses Report
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
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
