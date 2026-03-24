"use client";

import { Cell, Pie, ResponsiveContainer, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const genderData = [
  { name: "Boys", value: 1580, color: "hsl(210, 100%, 55%)" },
  { name: "Girls", value: 1267, color: "hsl(330, 75%, 55%)" },
];

const feeData = [
  { name: "Collected", value: 72, color: "hsl(155, 70%, 45%)" },
  { name: "Pending", value: 28, color: "hsl(0, 84%, 60%)" },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Gender Card */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">
            Student Gender Ratio
          </h3>

          <div className="flex items-center gap-6">
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
        </CardContent>
      </Card>

      {/* Fee Card */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">
            Fee Collection Status
          </h3>

          <div className="flex items-center gap-6">
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

            <div className="space-y-3">
              {feeData.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.value}%
                    </p>
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
