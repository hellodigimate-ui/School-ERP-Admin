/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, ResponsiveContainer, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ChartsSection() {
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎨 Colors mapping
const genderColors = {
  Male: "#3b82f6",     // bright blue
  Female: "#ec4899",   // vibrant pink
  Other: "#dc2626",    // rich purple
};

  // 🚀 Fetch Gender Count API
  const fetchGenderData = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/students/gender/count");

      const formatted = res.data.data.map((g) => ({
        name:
          g.gender === "Male"
            ? "Boys"
            : g.gender === "Female"
              ? "Girls"
              : "Others",
        value: g.count,
        color: genderColors[g.gender] || "gray",
      }));

      setGenderData(formatted);
    } catch (error) {
      console.error("Error fetching gender data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenderData();
  }, []);

  // 💰 Static Fee Data (you can connect API later)
  const feeData = [
    { name: "Collected", value: 72, color: "hsl(155, 70%, 45%)" },
    { name: "Pending", value: 28, color: "hsl(0, 84%, 60%)" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gender Card */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">Student Gender Ratio</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : genderData.length === 0 ? (
            <p className="text-sm text-gray-500">No data found</p>
          ) : (
            <div className="flex items-center gap-6">
              {/* Chart */}
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="space-y-3">
                {genderData.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.value} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Card */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">Fee Collection Status</h3>

          <div className="flex items-center gap-6">
            {/* Chart */}
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {feeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-3">
              {feeData.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
