/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const genderData = [
  { name: "Boys", students: 1580 },
  { name: "Girls", students: 1267 },
];

const feeData = [
  { name: "Collected", percentage: 72 },
  { name: "Pending", percentage: 28 },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const textColor = theme === "dark" ? "#E5E7EB" : "#1F2937";
  const gridColor = theme === "dark" ? "#374151" : "#E5E7EB";
  const barColor = theme === "dark" ? "#06B6D4" : "#3B82F6";

  return (
    <div className="p-8 bg-background text-foreground min-h-screen transition-colors duration-300">
      
      <h1 className="text-2xl font-bold mb-8 text-foreground">
        School Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Student Gender Ratio */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-md dark:shadow-dark">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Student Gender Ratio
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    color: textColor,
                  }}
                />
                <Bar dataKey="students" fill={barColor} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-md dark:shadow-dark">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Fee Collection Status
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis domain={[0, 100]} stroke={textColor} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    color: textColor,
                  }}
                />
                <Bar dataKey="percentage" fill={barColor} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
