// export function AttendanceCard() {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm">
//       <div className="flex justify-between mb-4">
//         <h3 className="font-semibold">Today`s Attendance</h3>
//         <span className="text-sm text-blue-600 cursor-pointer">
//           View Details →
//         </span>
//       </div>

//       <div className="grid grid-cols-4 gap-4 text-center">
//         <Stat label="Rate" value="0%" />
//         <Stat label="Present" value="0" color="text-green-600" />
//         <Stat label="Absent" value="0" color="text-red-600" />
//         <Stat label="On Leave" value="0" color="text-yellow-600" />
//       </div>
//     </div>
//   );
// }

// function Stat({
//   label,
//   value,
//   color,
// }: {
//   label: string;
//   value: string;
//   color?: string;
// }) {
//   return (
//     <div>
//       <p className={`text-xl font-semibold ${color ?? ""}`}>{value}</p>
//       <p className="text-xs text-muted-foreground">{label}</p>
//     </div>
//   );
// }



"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { name: "Class 10-A", percentage: 97, color: "#a855f7" },
  { name: "Class 6-B", percentage: 95, color: "#3b82f6" },
  { name: "Class 8-A", percentage: 91, color: "#10b981" },
  { name: "Class 7-C", percentage: 88, color: "#f97316" },
  { name: "Class 9-A", percentage: 85, color: "#6366f1" },
  { name: "Class 5-B", percentage: 82, color: "#ec4899" },
];

export default function TopAttendance() {
  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">
            Top Attendance
          </h3>

          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md">
            <Trophy size={18} />
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              
              <XAxis type="number" domain={[0, 100]} />
              
              <YAxis
                dataKey="name"
                type="category"
                width={100}
              />

              <Tooltip formatter={(value) => `${value}%`} />

              <Bar
                dataKey="percentage"
                radius={[0, 10, 10, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  );
}

